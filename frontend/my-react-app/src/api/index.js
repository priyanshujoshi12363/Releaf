import apiClient, { ApiError } from "./client.js";
import { getUserId, saveSession, clearSession, getUser, isLoggedIn } from "./session.js";

export { ApiError, getUser, getUserId, clearSession, isLoggedIn };

const requireUserId = () => {
  const id = getUserId();
  if (!id) throw new ApiError("You need to log in first.", 401);
  return id;
};

export const register = ({ playerName, email, password, phone, avatar }) => {
  const form = new FormData();
  form.append("PlayerName", playerName);
  form.append("email", email);
  form.append("password", password);
  form.append("PhoneNO", phone);
  form.append("Avatar", avatar);
  return apiClient.post("/auth/register", form, { auth: false });
};

export const login = async ({ email, password }) => {
  const data = await apiClient.post("/auth/login", { email, password }, { auth: false });
  saveSession({ token: data.token, user: data.user });
  return data;
};

export const logout = () => clearSession();

export const getPlayer = async (studentId = requireUserId()) => {
  const data = await apiClient.get(`/auth/game/${studentId}`);
  return data.student;
};

export const addXp = ({ xp, topic, studentId = requireUserId() }) =>
  apiClient.post("/auth/Xp", { studentId, playerXp: xp, topic });

export const saveQuizResult = ({ xp, studentId = requireUserId() }) =>
  apiClient.post(`/auth/quize/${studentId}`, { playerXp: xp });

export const getProgress = async (studentId = requireUserId()) => {
  const data = await apiClient.get(`/auth/wholedata/${studentId}`);
  return data.progress ?? {};
};

export const getIntroProgress = (studentId = requireUserId()) =>
  apiClient.get(`/auth/intro/${studentId}`);

export const getConservationProgress = (studentId = requireUserId()) =>
  apiClient.get(`/auth/convo/${studentId}`);

export const createClan = ({ clanName, desc, avatar, playerId = requireUserId() }) => {
  const form = new FormData();
  form.append("clanName", clanName);
  form.append("desc", desc);
  form.append("avatar", avatar);
  return apiClient.post(`/auth/create/clan/${playerId}`, form);
};

export const getClan = (studentId = requireUserId()) =>
  apiClient.get(`/auth/clan/${studentId}`);

export const joinClan = ({ clanCode, studentId = requireUserId() }) =>
  apiClient.post("/auth/join", { clanCode, studentId });

export const sendChatMessage = async (message, options) => {
  const data = await apiClient.post("/chat", { message }, options);
  return data.reply;
};

export const getCurrentWeather = async ({ latitude = 20, longitude = 77 } = {}) => {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  const res = await fetch(url);
  if (!res.ok) throw new ApiError("Weather service unavailable", res.status);

  const data = await res.json();
  const code = data?.current_weather?.weathercode;
  if (typeof code !== "number") throw new ApiError("Weather service unavailable", 502);

  if (code < 3) return "sunny";
  if (code < 60) return "cloudy";
  return "rainy";
};
