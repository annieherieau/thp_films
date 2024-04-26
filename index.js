// VARIABLES AND SECRETS
import { _APIKEY } from "./env.js";

const NO_POSTER = "images/placeholder.png";
// Animations
AOS.init();

// eviter action du formulaire
document.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Construction de l'URL
function getUrl(params) {
  let url = `https://www.omdbapi.com/?&apikey=${_APIKEY}`;
  for (const [key, value] of Object.entries(params)) {
    url += `&${key}=${value}`;
  }
  return url;
}

// Recherche Open Movie Database
const getMovies = () => {
  displayError();
  document.getElementById("movies").innerHTML = "";
  let searchInput = document
    .getElementById("searchInput")
    .value.replace(" ", "%20");
  if (searchInput.length < 3) {
    displayError("3 characters minimum");
  } else {
    let params = { s: searchInput };
    getResquest(getUrl(params));
  }
};
window.getMovies = getMovies;

// afficher les erreurs
function displayError(error = "") {
  const div = document.getElementById("error");
  div.innerHTML = error ? `<p class='text-warning'>Error: ${error}</p>` : "";
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
      if (response.Response === "True") {
        if (response.Search) {
          displayMovieCards(response);
        } else {
          displayMovie(response);
        }
      } else {
        displayError(response.Error);
      }
    })
    .catch((error) => {
      displayError(error.message);
    });
}

// requete pour Movie by ID
function getOneMovie(movieId) {
  let params = { i: movieId };
  getResquest(getUrl(params));
}
window.getOneMovie = getOneMovie;

// affichage 1 film dans le modal popup
function displayMovie(movie) {
  let div = document.getElementById("displayMovie");
  div.innerHTML = "";
  // poster
  if (movie.Poster != "N/A") {
    div.innerHTML += `<div class="modal-poster">
    <img id="movieModalPoster" class="rounded" src="${movie.Poster}" />
  </div>`;
  }

  div.innerHTML += `<div class="modal-body">
    <h1 class="modal-title fs-5 border-bottom mb-3">${movie.Title}</h1>
      <p><strong>${movie.Released !='N/A' ? movie.Released : ''}</strong></br>
      ${movie.Plot !='N/A' ? movie.Plot : ''}</p>
      <ul >
      ${liDetails("Genre", movie.Genre)}
      ${liDetails("Director", movie.Director)}
      ${liDetails("Actors", movie.Actors)}
      ${liDetails("Awards", movie.Awards)}
      ${liDetails("Ratings", movie.imdbRating + "/10")}
      </ul>
              </div>`;
}

// liste des détails du film
function liDetails(key, value) {
  if (value != "N/A") {
    return `<li class="list-group-item"><strong>${key} :</strong> ${value}</li>`;
  } else {
    return "";
  }
}
