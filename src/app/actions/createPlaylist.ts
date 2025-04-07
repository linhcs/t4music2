export async function createPlaylist(
  name: string,
  user_id: number,
  playlist_art: string
) {
  const res = await fetch("/api/playlists/create", {
    method: "POST",
    body: JSON.stringify({ name, user_id, playlist_art }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create playlist");
  }

  return res.json();
}
