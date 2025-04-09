export async function createPlaylist(name: string, user_id: number, playlist_art: string) {
  console.log("Sending playlist to API:", { name, user_id, playlist_art });

  const res = await fetch("/api/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, user_id, playlist_art }),
  });

  const data = await res.json(); // reads body here
  console.log("API response:", data);

  if (!res.ok) {
    throw new Error("Failed to create playlist");
  }

  return data; // previously was trying to re-read the body which messes up compilation time
}
