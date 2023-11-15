const retrievedWatchlistIDs = new Set(
  JSON.parse(window.localStorage.getItem("watchlist"))
);
document.body.addEventListener("click", function (e) {
  if (e.target.parentElement.dataset.movieId) {
    retrievedWatchlistIDs.delete(e.target.parentElement.dataset.movieId);
    window.localStorage.setItem(
      "watchlist",
      JSON.stringify([...retrievedWatchlistIDs])
    );
    renderWatchlist();
  }
});

async function renderWatchlist() {
  if (retrievedWatchlistIDs.size !== 0) {
    const moviePromises = [...retrievedWatchlistIDs].map(async (movieID) => {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=d3633d59&i=${movieID}`
      );
      return response.json();
    });

    const moviesData = await Promise.all(moviePromises);

    const watchlistHTMLString = moviesData.map((data) => {
      return `
        <div class="movie-card">
          <img src="${data["Poster"]}" alt="Movie poster of ${data["Title"]}">
          <div class="movie-info">
            <h3>${data["Title"]}</h3>
            <p class="movie-rating"><i class="fa-solid fa-star"></i>${data["imdbRating"]}</p>
          </div>
          <div class="movie-info">
            <p>${data["Runtime"]}</p>
            <p>${data["Genre"]}</p>
            <div data-movie-id="${data["imdbID"]}" class="movie-watchlist-btn"><i class="fa-solid fa-minus"></i></i><p class="watchlist-btn">Remove</p></div>
          </div>
          <p class="movie-desc">${data["Plot"]}</p>
        </div>`;
    });

    const watchlistHTML = watchlistHTMLString.join("");

    document.querySelector("#movie-list").innerHTML = watchlistHTML;
  } else {
    document.querySelector("#movie-list").innerHTML =
      "<div class='status'><p class='status-text'>Your watchlist is looking a little empty...</p><a href='index.html' class='watchlist-link'><i class='fa-solid fa-plus'></i>Let's add some movies!</a></div>";
  }
}

renderWatchlist();
