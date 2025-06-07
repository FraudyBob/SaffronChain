// frontend/utils/auth.js
export function getToken() {
  try {
    const data = JSON.parse(localStorage.getItem("auth_token"));
    return data?.token || null;
  } catch {
    return null;
  }
}

export function getRole() {
  try {
    const data = JSON.parse(localStorage.getItem("auth_token"));
    return data?.role || null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("auth_token");
}
