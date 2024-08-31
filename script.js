const APIURL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const movieBox = document.querySelector("#movie-box");
const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#search-button");
const suggestionBox = document.createElement("div");

suggestionBox.classList.add("suggestions");
searchInput.parentNode.appendChild(suggestionBox);

const getMovies = async (api) => {
  const response = await fetch(api);
  const data = await response.json();
  showMovies(data.results);
};

const showMovies = (data) => {
  movieBox.innerHTML = "";
  data.forEach((item) => {
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = `
      <img src="${IMGPATH + item.poster_path}" alt="">
      <div class="overlay">
          <div class="title">
              <h2>${item.original_title}</h2>
              <span>${Math.round(item.vote_average)}</span>
          </div>
          <h3>Overview</h3> 
          <p>${item.overview}</p>
      </div>`;
    movieBox.appendChild(box);
  });
};

const fetchSuggestions = async (query) => {
  const response = await fetch(SEARCHAPI + query);
  const data = await response.json();
  showSuggestions(data.results);
};

const showSuggestions = (data) => {
  suggestionBox.innerHTML = "";
  data.slice(0, 5).forEach((item) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion-item");
    suggestionItem.textContent = item.original_title;
    suggestionItem.addEventListener("click", () => {
      searchInput.value = item.original_title;
      fetchMovies();
      suggestionBox.innerHTML = "";
    });
    suggestionBox.appendChild(suggestionItem);
  });
};

const fetchMovies = () => {
  if (searchInput.value !== "") {
    getMovies(SEARCHAPI + searchInput.value);
  } else {
    getMovies(APIURL);
  }
};

searchInput.addEventListener("keyup", (event) => {
  if (event.target.value !== "") {
    fetchSuggestions(event.target.value);
  } else {
    suggestionBox.innerHTML = "";
  }
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchMovies();
    suggestionBox.innerHTML = "";
  }
});

searchButton.addEventListener("click", () => {
  fetchMovies();
  suggestionBox.innerHTML = "";
});

getMovies(APIURL);
