const searchForm = document.querySelector("#search-bar");
const myWatchlist = new Set(JSON.parse(localStorage.getItem("watchlist")));

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchMovies(document.querySelector("#search-query").value);
  searchForm.reset();
});

document.body.addEventListener("click", function (e) {
  if (e.target.parentElement.dataset.movieId) {
    myWatchlist.add(e.target.parentElement.dataset.movieId);
    window.localStorage.setItem("watchlist", JSON.stringify([...myWatchlist]));
    e.target.parentElement.classList.add("disabled");
  }
});

async function fetchMovies(query) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=d3633d59&s=${query}`
  );
  const data = await response.json();
  const searchData = data["Search"];

  try {
    const moviePromises = searchData.map(async (movie) => {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=d3633d59&i=${movie.imdbID}`
      );
      return response.json();
    });

    const moviesData = await Promise.all(moviePromises);

    const moviesHTML = moviesData.map((data) => {
      const isWatchlisted = myWatchlist.has(data["imdbID"]) ? "disabled" : "";

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
          <div data-movie-id="${data["imdbID"]}" class="movie-watchlist-btn ${isWatchlisted}"><i class="fa-solid fa-plus"></i><p class="watchlist-btn">Watchlist</p></div>
        </div>
        <p class="movie-desc">${data["Plot"]}</p>
      </div>`;
    });

    // Convert the array of HTML strings to a single string
    const moviesHTMLString = moviesHTML.join("");

    document.querySelector("#movie-list").innerHTML = moviesHTMLString;
  } catch {
    document.querySelector("#movie-list").innerHTML =
      "<div class='status'><p class='status-text'>Unable to find what you’re looking for. Please try another search.</p></div>";
  }
}
