const apiKey = "51cacaf7bab5327b6fd505c18b4d83ca";
const categoriesElement = document.getElementById("categories");
const moviesElement = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const sidebar = document.getElementById("sidebar");
const openMobile = document.getElementById("openMobile");
const closeToggle = document.getElementById("closeToggle");

let selectedCategoryId = null;
let favorites = [];

window.addEventListener("DOMContentLoaded", () => {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  renderFavorites();
});

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
  .then((response) => response.json())
  .then((data) => {
    const categories = data.genres;

    const ul = document.createElement("ul");
    ul.classList.add("list-group");

    categories.forEach((category) => {
      const li = document.createElement("li");
      li.textContent = category.name;
      li.classList.add("list-group-item");
      li.setAttribute("data-id", category.id);

      li.addEventListener("click", () => {
        selectedCategoryId = category.id;
        updateCategoryActiveClass();

        filterMoviesByCategory(category.id);
      });

      ul.appendChild(li);
    });

    categoriesElement.appendChild(ul);
  })
  .catch((error) => console.error(error));

function listAllMovies() {
  moviesElement.innerHTML = "";

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loading");
  loadingElement.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
  moviesElement.appendChild(loadingElement);

  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      moviesElement.innerHTML = "";

      const movies = data.results;

      movies.forEach((movie) => {
        createMovieCard(movie);
      });
    })
    .catch((error) => console.error(error));
}

function filterMoviesByCategory(categoryId) {
  moviesElement.innerHTML = "";

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loading");
  loadingElement.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
  moviesElement.appendChild(loadingElement);

  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${categoryId}`
  )
    .then((response) => response.json())
    .then((data) => {
      moviesElement.innerHTML = "";

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

  if (isFavorite(movie)) {
    favoriteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg>`;
  } else {
    favoriteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg>`;
  }

  favoriteButton.addEventListener("click", () => {
    toggleFavorite(movie);
    renderFavorites();
    updateMovieCardFavoriteIcon(movieDiv, favoriteButton, movie);
    favoriteButton.classList.add("animated", "bounce");
    setTimeout(() => {
      favoriteButton.classList.remove("animated", "bounce");
    }, 1000);
  });

  cardBody.appendChild(favoriteButton);

  movieDiv.appendChild(cardBody);

  moviesElement.appendChild(movieDiv);
}

function isFavorite(movie) {
  return favorites.some((fav) => fav.id === movie.id);
}

function updateMovieCardFavoriteIcon(movieDiv, favoriteButton, movie) {
  const isMovieFavorite = isFavorite(movie);

  if (isMovieFavorite) {
    favoriteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg>`;
  } else {
    favoriteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg>`;
  }

  // Kırmızı bir görsel geri bildirim için seçili filmin kartını vurgula
  if (isMovieFavorite) {
    movieDiv.classList.add("favorite");
  } else {
    movieDiv.classList.remove("favorite");
  }
}

function toggleFavorite(movie) {
  const index = favorites.findIndex((fav) => fav.id === movie.id);
  if (index === -1) {
    favorites.push(movie);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function updateCategoryActiveClass() {
  const allListItems = document.querySelectorAll(".list-group-item");
  allListItems.forEach((item) => item.classList.remove("active"));

  const selectedCategoryLi = document.querySelector(
    `.list-group-item[data-id="${selectedCategoryId}"]`
  );
  if (selectedCategoryLi) {
    selectedCategoryLi.classList.add("active");
  }
}

function renderFavorites() {
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No favorites yet.";
    favoritesList.appendChild(message);
  } else {
    favorites.forEach((movie) => {
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
      favoriteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
    </svg>`;
      favoriteButton.classList.add("btn", "favorite-button", "remove-favorite");
      favoriteButton.addEventListener("click", () => {
        toggleFavorite(movie);
        renderFavorites();
        updateMovieCardFavoriteIcon(movieDiv, favoriteButton, movie);
        favoriteButton.classList.add("animated", "bounce");
        setTimeout(() => {
          favoriteButton.classList.remove("animated", "bounce");
        }, 1000);
      });
      cardBody.appendChild(favoriteButton);

      movieDiv.appendChild(cardBody);

      favoritesList.appendChild(movieDiv);
    });
  }
}

listAllMovies();

function searchMovies(searchTerm) {
  moviesElement.innerHTML = "";

  const loadingElement = document.createElement("div");
  loadingElement.classList.add("loading");
  loadingElement.innerHTML =
    '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
  moviesElement.appendChild(loadingElement);

  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`
  )
    .then((response) => response.json())
    .then((data) => {
      moviesElement.innerHTML = "";

      const movies = data.results;

      if (movies.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No results found.";
        moviesElement.appendChild(message);
      } else {
        movies.forEach((movie) => {
          createMovieCard(movie);
        });
      }
    })
    .catch((error) => console.error(error));
}

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();

  if (searchTerm !== "") {
    searchMovies(searchTerm);

    const loadingElement = document.createElement("div");
    loadingElement.classList.add("loading");
    loadingElement.innerHTML =
      '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    moviesElement.appendChild(loadingElement);

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`
    )
      .then((response) => response.json())
      .then((data) => {
        moviesElement.innerHTML = "";

        const movies = data.results;

        if (movies.length === 0) {
          const message = document.createElement("p");
          message.textContent = "No results found.";
          moviesElement.appendChild(message);
        } else {
          movies.forEach((movie) => {
            createMovieCard(movie);
          });
        }
      })
      .catch((error) => console.error(error));
  }
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== "") {
      searchMovies(searchTerm);
    }
  }
});

openMobile.addEventListener("click", () => {
  sidebar.classList.add("ml0");
});

closeToggle.addEventListener("click", () => {
  sidebar.classList.remove("ml0");
});
