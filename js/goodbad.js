let movieTitles = [];
const itemsPerPage = 10;
let currentPage = 1;

async function loadMovies() {
    try {
        const response = await fetch('movies.json');
        const movieData = await response.json();
        movieTitles = movieData.map(movie => ({
            title: movie.title,
            painScore: movie.painScore || '',
            specialtyCategories: movie.specialtyCategories || '',
            quote: movie.quote || ''
        }));
        generateTableRows();
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function generateTableRows() {
    const tableBody = document.getElementById('movie-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = movieTitles.slice(start, end);

    paginatedItems.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.title}</td>
            <td><input type="text" value="${movie.painScore}" placeholder="Pain Score"></td>
            <td><input type="text" value="${movie.specialtyCategories}" placeholder="Specialty Categories"></td>
            <td><input type="text" value="${movie.quote}" placeholder="Quote"></td>
        `;
        tableBody.appendChild(row);
    });

    updatePaginationControls();
}

function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === Math.ceil(movieTitles.length / itemsPerPage);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        generateTableRows();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(movieTitles.length / itemsPerPage)) {
        currentPage++;
        generateTableRows();
    }
}

// Load movies and generate the table rows when the page loads
window.onload = loadMovies;