const TOKEN_KEY = "token";
const USER_KEY = "user";
const LOGIN_TIME_KEY = "loginTime";

// Save token and user
export const saveAuthData = (token, user) => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
};

// Get token
export const getToken = () => {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem(TOKEN_KEY);
};

// Get user
export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = sessionStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};

// Logged in?
export const isLoggedIn = () => {
  return !!getToken();
};

// Logout
export const logout = () => {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(LOGIN_TIME_KEY);
};

// Session expired?
export const isSessionExpired = () => {
  if (typeof window === "undefined") return true;

  const loginTime = sessionStorage.getItem(LOGIN_TIME_KEY);

  if (!loginTime) return true;

  const THIRTY_MINUTES = 30 * 60 * 1000;

  return Date.now() - Number(loginTime) > THIRTY_MINUTES;
};