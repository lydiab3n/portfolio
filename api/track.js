import { createHash } from "node:crypto";
import { configured, dayKey, pipeline } from "./_redis.js";

const BOT = /bot|crawl|spider|preview|headless|lighthouse|monitor|curl|wget/i;
const NAME = /^[a-z0-9:_\-./@ ]{1,60}$/i;
const clean = (s, n = 40) => String(s ?? "").slice(0, n).replace(/[^\w.\-: ]/g, "");
const KEEP_DAYS = 400;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).end();
  if (!configured()) return res.status(204).end();
  const ua = String(req.headers["user-agent"] || "");
  if (BOT.test(ua)) return res.status(204).end();

  let b = req.body;
  if (typeof b === "string") {
    try {
      b = JSON.parse(b);
    } catch {
      b = {};
    }
  }
  b = b || {};
  const day = dayKey();
  const cmds = [];
  const sid = /^[a-z0-9]{6,16}$/.test(String(b.s)) ? String(b.s) : "";
  const now = Date.now();
  const KEEP_VISITS = 90 * 86400;
  /* one visit's trail: a short list of "time|what" lines under a random per-visit id */
  const trail = (what) => {
    if (!sid) return;
    cmds.push(["RPUSH", `s:${sid}`, `${now}|${what}`], ["LTRIM", `s:${sid}`, "-300", "-1"], ["EXPIRE", `s:${sid}`, String(KEEP_VISITS)]);
  };
  const touch = (key) => cmds.push(["EXPIRE", key, String(KEEP_DAYS * 86400)]);

  if (b.t === "view") {
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    /* a one-way hash that changes every day: counts unique visitors without storing who they are */
    const visitor = createHash("sha256").update(`${ip}|${ua}|${day}|${process.env.STATS_SALT || "lydia"}`).digest("hex").slice(0, 24);
    const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|iphone|android/i.test(ua) ? "mobile" : "desktop";
    const country = clean(req.headers["x-vercel-ip-country"] || "??", 3) || "??";
    const page = b.p === "/room" ? "room" : "home";
    for (const [key, field] of [
      [`r:${day}`, clean(b.ref, 60) || "direct"],
      [`c:${day}`, country],
      [`d:${day}`, device],
      [`l:${day}`, clean(b.l, 5).toLowerCase() || "??"],
      [`p:${day}`, page],
    ]) {
      cmds.push(["HINCRBY", key, field, "1"]);
      touch(key);
    }
    if (sid) {
      cmds.push(["ZADD", "sx", String(now), sid], ["ZREMRANGEBYRANK", "sx", "0", "-501"], ["HSET", `sm:${sid}`, "country", country, "device", device, "ref", clean(b.ref, 60) || "direct"], ["EXPIRE", `sm:${sid}`, String(KEEP_VISITS)]);
      trail(`view:${page}`);
    }
    cmds.push(["INCR", `v:${day}`], ["PFADD", `u:${day}`, visitor]);
    touch(`v:${day}`);
    touch(`u:${day}`);
  } else if (b.t === "ev" && typeof b.n === "string" && NAME.test(b.n)) {
    cmds.push(["HINCRBY", `e:${day}`, b.n.toLowerCase(), "1"]);
    trail(b.n.toLowerCase());
    touch(`e:${day}`);
  } else {
    return res.status(400).end();
  }
  try {
    await pipeline(cmds);
  } catch {
    /* never fail the visitor */
  }
  return res.status(204).end();
}
