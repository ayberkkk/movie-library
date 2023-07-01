const apiKey = "51cacaf7bab5327b6fd505c18b4d83ca";
const categoriesElement = document.getElementById("categories");
const moviesElement = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const sidebar = document.getElementById("sidebar");
const openMobile = document.getElementById("openMobile");
const closeToggle = document.getElementById("closeToggle");

let selectedCategoryId = null;

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

  movieDiv.appendChild(cardBody);

  moviesElement.appendChild(movieDiv);
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

listAllMovies();

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();

  if (searchTerm !== "") {
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
          message.textContent = "Sonuç bulunamadı.";
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

openMobile.addEventListener("click", () => {
  sidebar.classList.add("ml0");
});

closeToggle.addEventListener("click", () => {
  sidebar.classList.remove("ml0");
});
