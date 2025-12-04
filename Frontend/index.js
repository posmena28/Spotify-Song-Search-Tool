async function getToken() {
  const res = await fetch("http://localhost:3000/token");
  const data = await res.json();
  return data.access_token;
}

async function searchSong(query) {
  const token = await getToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=6`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.tracks.items;
}

document.getElementById("searchBtn").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value;
  if (!query) return;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<div class="loading__tag">Loading...</div>`;

  try {
    const songs = await searchSong(query);
    if (songs.length === 0) {
      resultsDiv.innerHTML = "No results found.";
      return;
    }

    resultsDiv.innerHTML = songs.map(song => `
      <div class="song">
        <img src="${song.album.images[0].url}" alt="Album cover" />
        <div class="song-info">
          <strong>${song.name}</strong><br>
          ${song.artists.map(a => a.name).join(", ")}
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".song").forEach((el, index) => {
      setTimeout(() => {
      el.classList.add("show");
      }, index * 100); // stagger effect (optional)
    });
  } catch (err) {
    resultsDiv.innerHTML = "Error fetching songs. Make sure the backend is running.";
    console.error(err);
  }
});
