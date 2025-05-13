interface ExcalidrawData {
  localStorage: Record<string, string>;
  cookies: Record<string, string>;
}

export const getExcalidrawData = (): ExcalidrawData => {
  const data: ExcalidrawData = {
    localStorage: {},
    cookies: {},
  };

  // Get all localStorage items that start with 'excalidraw'
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("excalidraw")) {
      data.localStorage[key] = localStorage.getItem(key) || "";
    }
  });

  // Get all cookies that start with 'excalidraw'
  document.cookie.split(";").forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key.startsWith("excalidraw")) {
      data.cookies[key] = value;
    }
  });

  return data;
};

export const setExcalidrawData = (data: ExcalidrawData) => {
  // Restore localStorage items
  Object.entries(data.localStorage).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });

  // Restore cookies
  Object.entries(data.cookies).forEach(([key, value]) => {
    document.cookie = `${key}=${value}; path=/; max-age=31536000`; // 1 year expiry
  });
};
