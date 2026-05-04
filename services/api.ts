
export const fetchJSON = async (url: string, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

