export async function getDashboard() {
  const response = await fetch("/api/dashboard", {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}