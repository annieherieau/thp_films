// VARIABLES AND SECRETS
import { _APIKEY } from "./env.js";

const _URL = "https://www.omdbapi.com";
const NO_POSTER = "images/placeholder.png";
const _apikey = _APIKEY !== '' ? _APIKEY : github-pages._OMBD_APIKEY;
// Animations
AOS.init();

// eviter action du formulaire
document.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Recherche Open Movie Database
const getMovies = () => {
  displayError("");
  let searchInput = document
    .getElementById("searchInput")
    .value.replace(" ", "%20");
  if (searchInput.length < 3 && searchInput.length > 0) {
    displayError("3 characters minimum");
  } else {
    const url = `${_URL}/?s=${searchInput}&apikey=${_apikey}`;
    getResquest(url);
  }
};
window.getMovies = getMovies;

// afficher les erreurs
function displayError(error) {
  const div = document.getElementById("error");
  div.innerHTML = `<p class='text-warning'>${error}</p>`;
}

// créer la liste des films
function displayMovieCards(response) {
  const div = document.getElementById("movies");
  div.innerHTML = `<p>Résultats: ${response.totalResults}</p>`;

  const movies = response.Search;
  for (const movie of movies) {
    div.innerHTML += `<div class="card bg-white mb-3 shadow-sm" data-aos="fade-up">
    <div class="card-body d-flex">
      <img class="card-poster" src="${
        movie.Poster === "N/A" ? NO_POSTER : movie.Poster
      }">
      <div class="p-3 w-100 h-100 d-flex flex-column justify-content-around">
        <h4 class="card-title">${movie.Title}</h4>
        <p class="card-text">${movie.Type} - ${movie.Year}</p>
        <button id="${movie.imdbID}" onclick="getOneMovie('${
      movie.imdbID
    }')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#movieModal">
          Read more
        </button>
      </div>
    </div>
  </div>`;
  }
}

// REQUEST OMDB
function getResquest(url) {
  fetch(url)
    .then((response) => {
      return response.json(); // Décodage JSON de la réponse (notez bien le `return` ici)
    })
    .then((response) => {
      if (response.Search) {
        displayMovieCards(response);
      } else {
        displayMovie(response);
      }
    })
    .catch((error) => {
      displayError(error.message);
    });
}

// requete pour Movie by ID
function getOneMovie(movieId) {
  const url = `${_URL}/?i=${movieId}&plot=full&apikey=${_apikey}`;
  getResquest(url);
}
window.getOneMovie = getOneMovie;

// affichage 1 film dans le modal popup
function displayMovie(movie) {
  document.getElementById("movieModalLabel").innerText = movie.Title;
  document.getElementById("movieModalPoster").src = movie.Poster;
  document.getElementById(
    "synopsis"
  ).innerHTML = `<strong>${movie.Released}</strong></br>
  ${movie.Plot}`;
  let details = document.getElementById("details");
  details.innerHTML = "";
  details.innerHTML += liDetails("Genre", movie.Genre);
  details.innerHTML += liDetails("Director", movie.Director);
  details.innerHTML += liDetails("Actors", movie.Actors);
  details.innerHTML += liDetails("Awards", movie.Awards);
  details.innerHTML += liDetails("Ratings", movie.imdbRating + "/10");
}

// liste des détails du film
function liDetails(key, value) {
  return `<li class="list-group-item"><strong>${key} :</strong> ${value}</li>`;
}
