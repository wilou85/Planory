const BASE = "https://api.dataforseo.com/v3";

export function getCredentials() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error(
      "DATAFORSEO_LOGIN et DATAFORSEO_PASSWORD requis (voir .env.example)",
    );
  }
  return { login, password };
}

export async function dataforseoPost(path, body) {
  const { login, password } = getCredentials();
  const auth = Buffer.from(`${login}:${password}`).toString("base64");

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DataForSEO ${path} HTTP ${res.status}: ${text.slice(0, 400)}`);
  }

  const json = await res.json();
  const task = json.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    throw new Error(
      `DataForSEO error: ${task?.status_message ?? JSON.stringify(json).slice(0, 300)}`,
    );
  }
  return { result: task.result, cost: task.cost, time: task.time };
}

export const LOCATIONS = {
  fr: { location_code: 2250, language_code: "fr", label: "France" },
  en_us: { location_code: 2840, language_code: "en", label: "United States" },
};
