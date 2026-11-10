/* Tiny Upstash/Vercel-KV REST client (no dependency). Env vars are set by the Upstash integration. */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const configured = () => Boolean(URL_ && TOKEN);

export async function pipeline(commands) {
  const r = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return (await r.json()).map((x) => x.result);
}

/** HGETALL comes back as a flat [k, v, k, v] list */
export const toObject = (flat) => {
  const o = {};
  for (let i = 0; Array.isArray(flat) && i < flat.length; i += 2) o[flat[i]] = Number(flat[i + 1]);
  return o;
};

/** today's date in Paris, YYYY-MM-DD */
export const dayKey = (d = new Date()) => d.toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
