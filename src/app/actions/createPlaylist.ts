// src/app/actions/createPlaylist.ts
export async function createPlaylist(name: string, user_id: number) {
  console.log("Sending playlist to API:", { name, user_id });

  const res = await fetch("/api/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, user_id }),
  });

  const data = await res.json();
  console.log("API response:", data);

  if (!res.ok) throw new Error("Failed to create playlist");

  return data;
}
