export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Fetched token:", token);
  return token;
};

export const setToken = (token) => {
  console.log("Setting token:", token);
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  console.log("Removing token");
  localStorage.removeItem("token");
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    console.warn("Unauthorized. Redirecting to login...");
    window.location.href = "/login";
  }

  return res;
};
