const popularElement = document.getElementById("popular");

function listPopularMovies() {
  popularElement.innerHTML = "";

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loading");
  loadingElement.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
  popularElement.appendChild(loadingElement);

  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      popularElement.innerHTML = "";

      const movies = data.results;

      movies.forEach((movie) => {
        createMovieCard(movie);
      });
    })
    .catch((error) => console.error(error));
}

function createMovieCard(movie) {
  const movieDiv = document.createElement("div");
  movieDiv.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  img.classList.add("img-fluid");
  img.alt = movie.title;
  movieDiv.appendChild(img);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const title = document.createElement("h5");
  title.textContent = movie.title;
  title.classList.add("card-title");
  cardBody.appendChild(title);

  const rate = document.createElement("p");
  rate.textContent = `Rate: ${movie.vote_average}`;
  rate.classList.add("card-text");
  cardBody.appendChild(rate);

  const popularity = document.createElement("p");
  popularity.textContent = `İzlenme Sayısı: ${movie.popularity}`;
  popularity.classList.add("card-text");
  cardBody.appendChild(popularity);

  const favoriteButton = document.createElement("button");
  favoriteButton.classList.add("btn", "favorite-button");

  updateMovieCardFavoriteIcon(favoriteButton, movie);

  favoriteButton.addEventListener("click", () => {
    toggleFavorite(movie);
    updateMovieCardFavoriteIcon(favoriteButton, movie);
    favoriteButton.classList.add("animated", "bounce");
    setTimeout(() => {
      favoriteButton.classList.remove("animated", "bounce");
    }, 1000);
  });

  cardBody.appendChild(favoriteButton);

  movieDiv.appendChild(cardBody);

  popularElement.appendChild(movieDiv);
}

listPopularMovies();
