// src/api/index.js

/** ex) https://sg3yrs-masil.duckdns.org  (.env에 VITE_API_URL 권장)
 *  - 개발에서 Vite 프록시(/api → duckdns)를 쓰면 비워둬도 됩니다.
 */
export const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(
  /\/+$/,
  ""
);

/** 기본 타임아웃(ms) */
const DEFAULT_TIMEOUT = 12_000;

/** 개발 환경 기본 접두: /api (Vite proxy 대상) */
const DEV_API_PREFIX = "/api";

/**
 * 경로 보정
 * - 절대 URL이면 그대로
 * - API_BASE가 설정된(직통 호출) 경우: '/api' 접두가 오더라도 제거해 서버 루트에 맞춤
 * - API_BASE가 없으면(프록시 사용): 항상 '/api' 접두를 보장
 */
function normalizePath(path) {
  if (!path) return "/";
  if (/^https?:\/\//i.test(path)) return path; // 절대 URL

  if (API_BASE) {
    if (/^\/api(\/|$)/i.test(path)) return path.replace(/^\/api/i, "") || "/";
    return path.startsWith("/") ? path : `/${path}`;
  }

  if (/^\/api(\/|$)/i.test(path)) return path; // 이미 /api
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${DEV_API_PREFIX}${p}`;
}

function buildUrl(path) {
  const p = normalizePath(path);
  if (/^https?:\/\//i.test(p)) return p;
  return API_BASE ? `${API_BASE}${p}` : p;
}

/**
 * 공통 요청 함수
 * @param {string} path - "/chat" | "/api/meet/1" | "/user/1" 등
 * @param {object} [options]
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} [options.method]
 * @param {any} [options.body] - 자동 JSON.stringify
 * @param {Record<string,string>} [options.headers]
 * @param {number} [options.timeout] - ms
 */
async function request(
  path,
  { method = "GET", body, headers, timeout = DEFAULT_TIMEOUT } = {}
) {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new Error("Request timeout")),
    timeout
  );

  const url = buildUrl(path);

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body != null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      // credentials: "include",
    });

    const raw = await res.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw; // 순수 텍스트 대응
    }

    if (!res.ok) {
      const msg = data?.error?.message || `API ${method} ${url} ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/* ----------------- API 함수들 ----------------- */

/** 모임 목록 (옵션: sort=currentDesc 등) */
export async function fetchMeetList({ sort = "currentDesc" } = {}, opts) {
  try {
    const qs = new URLSearchParams({ sort }).toString();
    return await request(`/api/meet/list?${qs}`, { ...opts });
  } catch (e) {
    console.error("Failed to fetch meet list:", e);
    return [];
  }
}

/** 모임 상세 */
export async function fetchMeetingDetail(id, opts) {
  try {
    return await request(`/api/meet/${id}`, { ...opts });
  } catch (error) {
    console.error("Failed to fetch meeting data:", error);
    return null;
  }
}

/** 호스트(유저) 정보 */
export async function fetchHostInfo(id, opts) {
  try {
    return await request(`/api/user/${id}`, { ...opts });
  } catch (error) {
    console.error("Failed to fetch host data:", error);
    return null;
  }
}

/** 장소 목록 */
export async function fetchLocationList(opts) {
  try {
    const data = await request(`/api/location/list`, { ...opts });
    if (Array.isArray(data)) return data;
    const arr = data?.data ?? data?.items ?? data?.result ?? [];
    return Array.isArray(arr) ? arr : [];
  } catch (error) {
    console.error("Failed to fetch location data:", error);
    return null;
  }
}

/** 모임 생성 (POST /api/meet/create) */
export function createMeeting(payload, opts) {
  // payload: { name, datetime, maximum, detail, tag: string[], locationId, userId, intro }
  return request(`/api/meet/create`, {
    method: "POST",
    body: payload,
    ...opts,
  });
}

/** 모임 참여 (POST /api/meet/join) */
export function joinMeeting(userId, meetId, opts) {
  return request(`/api/meet/join`, {
    method: "POST",
    body: { userId: Number(userId), meetId: Number(meetId) },
    ...opts,
  });
}

/** 모임 참여 취소 (DELETE /api/meet/join) */
export function leaveMeeting(userId, meetId, opts) {
  // NOTE: 일부 서버는 DELETE body를 제한하는데, 스펙 문서 기준 body 사용
  return request(`/api/meet/join`, {
    method: "DELETE",
    body: { userId: Number(userId), meetId: Number(meetId) },
    ...opts,
  });
}

/** 내가 만든 모임 목록 (GET /api/user/:id/created-list) */
export async function fetchUserCreatedList(userId, opts) {
  try {
    return await request(`/api/user/${userId}/created-list`, { ...opts });
  } catch (e) {
    console.error("Failed to fetch created list:", e);
    return [];
  }
}

/** 내가 참여한 모임 목록 (GET /api/user/:id/joined-list) */
export async function fetchUserJoinedList(userId, opts) {
  try {
    return await request(`/api/user/${userId}/joined-list`, { ...opts });
  } catch (e) {
    console.error("Failed to fetch joined list:", e);
    return [];
  }
}

/** 챗봇 답변 생성 */
export function chat(userId, message, opts) {
  return request("/api/chat", {
    method: "POST",
    body: { userID: userId, userId, message }, // 백엔드 케이스 둘 다 대응
    ...opts,
  });
}

/** 사용자 맞춤 추천 (path param 버전) */
export function getRecommendations(userId, opts) {
  const id = Number.isFinite(Number(userId)) ? String(Number(userId)) : "1";
  return request(`/api/chat/${id}/recommend`, { method: "GET", ...opts });
}

/** (옵션) 헬스체크 */
export function health() {
  return request("/api/health").catch((e) => ({
    ok: false,
    error: String(e?.message || e),
  }));
}

/* 선택: default export(과거 코드 호환) */
export default {
  request,
  fetchMeetList,
  fetchMeetingDetail,
  fetchHostInfo,
  fetchLocationList,
  createMeeting,
  joinMeeting,
  leaveMeeting,
  fetchUserCreatedList,
  fetchUserJoinedList,
  chat,
  getRecommendations,
  health,
};
