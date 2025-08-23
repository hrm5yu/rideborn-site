const SERVICE = import.meta.env.PUBLIC_MICROCMS_SERVICE_DOMAIN;
const KEY = import.meta.env.MICROCMS_API_KEY;

const BASE = `https://${SERVICE}.microcms.io/api/v1`;

if (!SERVICE) {
  console.warn('PUBLIC_MICROCMS_SERVICE_DOMAIN が未設定です (.env を確認)');
}
if (!KEY) {
  console.warn('MICROCMS_API_KEY が未設定です (.env を確認)');
}

export async function cmsFetch(path: string, params: Record<string, string | number> = {}) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) usp.set(k, String(v));
  const url = `${BASE}${path}?${usp.toString()}`;
  const res = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': KEY }
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`microCMS fetch failed ${res.status}: ${t}`);
  }
  return res.json();
}
