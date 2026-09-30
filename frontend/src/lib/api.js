const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // some responses have no JSON body
  }

  if (!res.ok) {
    const err = new Error(data?.error || data?.message || "Request failed");
    err.status = res.status;
    throw err;
  }

  return data;
}

export const signup = (payload) =>
  request("/auth/signup", { method: "POST", body: payload });
export const login = (payload) =>
  request("/auth/login", { method: "POST", body: payload });
export const verifyEmail = (payload) =>
  request("/auth/verify-email", { method: "POST", body: payload });
export const resendOtp = (payload) =>
  request("/auth/resend-otp", { method: "POST", body: payload });
export const forgotPassword = (payload) =>
  request("/auth/forgot-password", { method: "POST", body: payload });
export const resetPassword = (payload) =>
  request("/auth/reset-password", { method: "POST", body: payload });
export const getMe = () => request("/auth/me");
export const logout = () => request("/auth/logout", { method: "POST" });
export const updatePhone = (payload) =>
  request("/auth/phone", { method: "PATCH", body: payload });
export const updateVehicle = (payload) =>
  request("/auth/vehicle", { method: "PATCH", body: payload });
