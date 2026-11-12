import { timingSafeEqual } from "node:crypto";
import { configured, dayKey, pipeline, toObject } from "./_redis.js";

const same = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};
const add = (into, from) => {
  for (const [k, v] of Object.entries(from)) into[k] = (into[k] || 0) + v;
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return res.status(500).json({ error: "ADMIN_PASSWORD is not set" });
  const given = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!same(given, pw)) return res.status(401).json({ error: "wrong password" });
  if (!configured()) return res.status(500).json({ error: "database is not connected" });

  if (req.method === "DELETE") {
    /* wipe every counter and visit trail this site has written */
    for (const pat of ["v:*", "u:*", "e:*", "r:*", "c:*", "d:*", "l:*", "p:*", "s:*", "sm:*", "sx"]) {
      let cursor = "0";
      do {
        const [[next, keys]] = await pipeline([["SCAN", cursor, "MATCH", pat, "COUNT", "500"]]);
        cursor = String(next);
        if (keys.length) await pipeline([["DEL", ...keys]]);
      } while (cursor !== "0");
    }
    return res.status(200).json({ ok: true });
  }
  if (req.query?.visits) {
    const ids = (await pipeline([["ZREVRANGE", "sx", "0", "39"]]))[0] || [];
    const out = ids.length ? await pipeline(ids.flatMap((id) => [["HGETALL", `sm:${id}`], ["LRANGE", `s:${id}`, "0", "-1"]])) : [];
    const visits = ids.map((id, i) => {
      const m = out[i * 2] || [];
      const meta = {};
      for (let k = 0; k < m.length; k += 2) meta[m[k]] = m[k + 1];
      const steps = (out[i * 2 + 1] || []).map((l) => {
        const [t, ...w] = l.split("|");
        return { t: Number(t), what: w.join("|") };
      });
      return { id, ...meta, steps };
    });
    return res.status(200).json({ visits });
  }
  const n = Math.min(90, Math.max(1, Number(req.query?.days) || 30));
  const days = [];
  for (let i = n - 1; i >= 0; i--) days.push(dayKey(new Date(Date.now() - i * 86400000)));
  const cmds = [];
  for (const d of days) cmds.push(["GET", `v:${d}`], ["PFCOUNT", `u:${d}`], ["HGETALL", `e:${d}`], ["HGETALL", `r:${d}`], ["HGETALL", `c:${d}`], ["HGETALL", `d:${d}`], ["HGETALL", `l:${d}`], ["HGETALL", `p:${d}`]);
  const out = await pipeline(cmds);
  const series = [];
  const total = { events: {}, referrers: {}, countries: {}, devices: {}, langs: {}, pages: {} };
  days.forEach((day, i) => {
    const o = out.slice(i * 8, i * 8 + 8);
    series.push({ day, views: Number(o[0]) || 0, visitors: Number(o[1]) || 0 });
    add(total.events, toObject(o[2]));
    add(total.referrers, toObject(o[3]));
    add(total.countries, toObject(o[4]));
    add(total.devices, toObject(o[5]));
    add(total.langs, toObject(o[6]));
    add(total.pages, toObject(o[7]));
  });
  return res.status(200).json({ days: series, ...total });
}
