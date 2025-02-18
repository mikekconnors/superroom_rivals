let movieTitles = [];
const itemsPerPage = 10;
let currentPage = 1;

async function loadMovies() {
    try {
        const response = await fetch('movies.json');
        const movieData = await response.json();

        // Generate a random Friday in 2016
        let startDate = new Date(2016, 0, 1); // January 1, 2016
        while (startDate.getDay() !== 5) { // 5 is Friday
            startDate.setDate(startDate.getDate() + 1);
        }
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 52) * 7); // Random Friday in 2016

        // Assign watched dates to movies
        movieTitles = movieData.map((movie, index) => {
            const watchedDate = new Date(startDate);
            watchedDate.setDate(startDate.getDate() + index * 7); // Every Friday
            return {
                title: movie.title,
                painScore: movie.painScore || '',
                specialtyCategories: movie.specialtyCategories || '',
                quote: movie.quote || '',
                watchedDate: watchedDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
            };
        });

        generateTableRows();
        generateTimeline();
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

function generateTimeline() {
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = ''; // Clear existing timeline

    movieTitles.sort((a, b) => new Date(a.watchedDate) - new Date(b.watchedDate));

    movieTitles.forEach(movie => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="date">${new Date(movie.watchedDate).toLocaleDateString()}</div>
            <div class="content">
                <h2>${movie.title}</h2>
                <p>${movie.quote}</p>
            </div>
        `;
        timelineContainer.appendChild(item);
    });

    // Add zoom functionality
    timelineContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            timelineContainer.style.transform = `scale(${Math.min(2, (parseFloat(timelineContainer.style.transform.replace('scale(', '').replace(')', '')) || 1) + 0.1)})`;
        } else {
            timelineContainer.style.transform = `scale(${Math.max(0.5, (parseFloat(timelineContainer.style.transform.replace('scale(', '').replace(')', '')) || 1) - 0.1)})`;
        }
    });
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

// Load movies and generate the table rows and timeline when the page loads
window.onload = loadMovies;