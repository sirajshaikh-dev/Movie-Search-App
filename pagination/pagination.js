const APIURL3 = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";
const movieBox = document.getElementById('movie-box');
const loading = document.getElementById('loading');
const pagination = document.getElementById('pagination');

const pageButtons = document.getElementById('page-buttons');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

// Function to create pagination buttons
function createPagination(pages) {
    pageButtons.innerHTML = ''; 
    for (let i = 1; i <= pages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => fetchMovies(i));
        pageButtons.appendChild(button);
    }
}

// Function to fetch movies and display them
async function fetchMovies(page) {
    try {
        movieBox.innerHTML = ''; // Clear current movies
        loading.style.display = 'block'; // Show loading message
        const response = await fetch(APIURL3 + page);
        const data = await response.json();
        loading.style.display = 'none'; // Hide loading message

        if (data.results.length === 0) {
            movieBox.innerHTML = '<p>No movies found.</p>';
            return;
        }

        data.results.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            movieDiv.innerHTML = `
                <h3>${movie.original_title}</h3>
                <p>${movie.overview}</p>
            `;
            movieBox.appendChild(movieDiv);
        });
    } catch (error) {
        loading.style.display = 'none';
        movieBox.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

prevPageBtn.addEventListener('click', () => {
    pageButtons.scrollBy({ left: -200, behavior: 'smooth' });
});

nextPageBtn.addEventListener('click', () => {
    pageButtons.scrollBy({ left: 200, behavior: 'smooth' });
});


createPagination(20); // Assuming 20 pages for example

// Fetch and display movies from page 1 initially
fetchMovies(1);
