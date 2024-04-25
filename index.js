// VARIABLES AND SECRETS
import { _APIKEY } from "./env.js";
import { _URL } from "./env.js";

//
let RESPONSE_LIST;
let MOVIE;

// Recherche Open Movie Database
const getMovies = () => {
  let searchInput = document
    .getElementById("searchInput")
    .value.replace(" ", "%20");
  if (searchInput) {
    const url = `${_URL}/?s=${searchInput}&apikey=${_APIKEY}`;
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
    div.innerHTML += `<div class="card bg-white mb-3 w-100 shadow-sm">
    <div class="card-body d-flex">
      <img class="card-poster" src="${movie.Poster ==='N/A' ? '' : movie.Poster}">
      <div class="p-3 w-100 h-100 d-flex flex-column justify-content-around">
        <h4 class="card-title">${movie.Title}</h4>
        <p class="card-text">${movie.Type} - ${movie.Year}</p>
        <button id="${movie.imdbID}" onclick="getOneMovie('${movie.imdbID}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#movieModal">
          Launch demo modal
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
  const url = `${_URL}/?i=${movieId}&plot=full&apikey=${_APIKEY}`;
  getResquest(url);
}
window.getOneMovie = getOneMovie;

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

function liDetails(key, value) {
  return `<li class="list-group-item"><strong>${key} :</strong> ${value}</li>`;
}
