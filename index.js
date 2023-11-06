const searchForm = document.querySelector("#search-bar")

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    fetchMovies(document.querySelector("#search-query").value);
    searchForm.reset()
  });

async function fetchMovies(query) {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=d3633d59&s=${query}`
  );
  const data = await response.json();
  const searchData = data["Search"];
  const moviePromises = searchData.map(async (movie) => {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=d3633d59&i=${movie.imdbID}`
    );
    return response.json();
  });

  const moviesData = await Promise.all(moviePromises);
  const moviesHTML = moviesData.map((data, index) => {
    const movie = searchData[index];
    return `
    <div class="movie-card">
      <img src="${movie["Poster"]}" alt="Movie poster of ${movie["Title"]}">
      <div class="movie-info">
        <h3>${movie["Title"]}</h3>
        <p class="movie-rating"><i class="fa-solid fa-star"></i>${data["imdbRating"]}</p>
      </div>
      <div class="movie-info">
        <p>${data["Runtime"]}</p>
        <p>${data["Genre"]}</p>
        <p class="watchlist-btn"><i class="fa-solid fa-plus"></i>Watchlist</p>
      </div>
      <p class="movie-desc">${data["Plot"]}</p>
    </div>`;
  });

  // Convert the array of HTML strings to a single string
  const moviesHTMLString = moviesHTML.join("");

  console.log(moviesHTMLString);
  document.querySelector("#movie-list").innerHTML = moviesHTMLString;
}