const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const movieBox = document.querySelector("#movie-box");
const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#search-button");
const suggestionBox = document.createElement("div");

suggestionBox.classList.add("suggestions");
searchInput.parentNode.appendChild(suggestionBox);

const getMovies = async (api) => {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    const data = await response.json();
    showMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
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

const pageButtons = document.getElementById('page-buttons');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

let currentPage = 1;
function createPagination(pages) {
    pageButtons.innerHTML = ''; 
    for (let i = 1; i <= pages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => fetchMoviesByPage(i));
        pageButtons.appendChild(button);
    }
}

async function fetchMoviesByPage(page) {
    currentPage = page;
    const apiURL = APIURL + page;
    getMovies(apiURL);
    clearSuggestions() 
    searchInput.value=""
}
// Only scroll left-right
prevPageBtn.addEventListener('click', () => {
    pageButtons.scrollBy({ left: -200, behavior: 'smooth' });
});

nextPageBtn.addEventListener('click', () => {
    pageButtons.scrollBy({ left: 200, behavior: 'smooth' });
});

// fetch when click on prev & next btn
// prevPageBtn.addEventListener('click', () => {
//     if (currentPage > 1) {
//         currentPage--;
//         fetchMoviesByPage(currentPage);
//     }
// });

// nextPageBtn.addEventListener('click', () => {
//     currentPage++;
//     fetchMoviesByPage(currentPage);
// });

// Initial fetch
createPagination(50); 
fetchMoviesByPage(1);

searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value;
  if (searchValue) {
    getMovies(SEARCHAPI + searchValue);
  } else {
    fetchMoviesByPage(1);
  }
    clearSuggestions()  
});

const fetchSuggestions = async (query) => {
    const response = await fetch(SEARCHAPI + query);
    const data = await response.json();
    showSuggestions(data.results);
  };
  
  const showSuggestions = (data) => {
    clearSuggestions()
        data.slice(0,10).forEach((item) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.textContent = item.original_title;
        suggestionItem.addEventListener("click", () => {
        searchInput.value = item.original_title;
        // getMovies(SEARCHAPI + item.original_title);  // Fetch movies immediately on item click
        clearSuggestions();
      });
      suggestionBox.appendChild(suggestionItem);
    });
  };
  searchInput.addEventListener("keyup", (event) => {
    if (event.target.value !== "") {
      fetchSuggestions(event.target.value);
    } else {
    clearSuggestions()
  }
  });
  const clearSuggestions =()=>{
    suggestionBox.innerHTML=""
  }
