import { projectId, publicAnonKey } from "./info";
import { supabase } from "../../src/lib/supabase";

const FUNCTION_BASE_URL =
  `https://${projectId}.supabase.co/functions/v1/server`;

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const headers = new Headers(options.headers || {});

  headers.set("Content-Type", "application/json");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;

  headers.set(
    "Authorization",
    `Bearer ${accessToken || publicAnonKey}`
  );

  const response = await fetch(`${FUNCTION_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data: any = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status})`
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed (${response.status})`
    );
  }

  return data;
}