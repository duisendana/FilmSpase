const movieGrid = document.getElementById("movieGrid");
const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genreFilter");
const resultsCount = document.getElementById("resultsCount");
const noResults = document.getElementById("noResults");

const favoriteList = document.getElementById("favoriteList");
const recommendGenre = document.getElementById("recommendGenre");
const recommendButton = document.getElementById("recommendButton");
const recommendResult = document.getElementById("recommendResult");

const movieModal = document.getElementById("movieModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const movieCards = Array.from(
    movieGrid.querySelectorAll(".movie-card")
);

const trailerLinks = {
    "1": "https://www.youtube.com/results?search_query=Как+приручить+дракона+2010+трейлер+на+русском",
    "2": "https://www.youtube.com/results?search_query=Чарли+и+шоколадная+фабрика+2005+трейлер+на+русском",
    "3": "https://www.youtube.com/results?search_query=Человек+паук+Через+вселенные+2018+трейлер+на+русском",
    "4": "https://www.youtube.com/results?search_query=Рататуй+2007+трейлер+на+русском",
    "5": "https://www.youtube.com/results?search_query=Тайна+Коко+2017+трейлер+на+русском",
    "6": "https://www.youtube.com/results?search_query=Головоломка+2015+трейлер+на+русском",
    "7": "https://www.youtube.com/results?search_query=Хроники+Нарнии+2005+трейлер+на+русском",
    "8": "https://www.youtube.com/results?search_query=Зверополис+2016+трейлер+на+русском",
    "9": "https://www.youtube.com/results?search_query=Малефисента+2014+трейлер+на+русском",
    "10": "https://www.youtube.com/results?search_query=Холодное+сердце+2013+трейлер+на+русском",
    "11": "https://www.youtube.com/results?search_query=Хатико+Самый+верный+друг+2009+трейлер+на+русском"
};

let favorites = new Set();

try {
    const savedFavorites = JSON.parse(
        localStorage.getItem("filmSpaceFavorites")
    );

    if (Array.isArray(savedFavorites)) {
        favorites = new Set(savedFavorites);
    }
} catch (error) {
    favorites = new Set();
}

function saveFavorites() {
    localStorage.setItem(
        "filmSpaceFavorites",
        JSON.stringify([...favorites])
    );
}

function getMovieData(card) {
    return {
        id: card.dataset.id,
        name: card.dataset.name,
        genre: card.dataset.genre,
        year: card.dataset.year,
        director: card.dataset.director,
        description: card.dataset.description,
        image: card.querySelector(".movie-poster img").src
    };
}

function updateFavoriteButtons() {
    document.querySelectorAll(".favorite").forEach(button => {
        const card = button.closest(".movie-card");

        if (!card) return;

        if (favorites.has(card.dataset.id)) {
            button.textContent = "♥";
            button.classList.add("active");
        } else {
            button.textContent = "♡";
            button.classList.remove("active");
        }
    });
}

function renderFavorites() {
    favoriteList.innerHTML = "";

    const favoriteMovies = movieCards.filter(card =>
        favorites.has(card.dataset.id)
    );

    if (favoriteMovies.length === 0) {
        favoriteList.innerHTML =
            "<p>Әзірге таңдаулы фильмдер жоқ.</p>";
        return;
    }

    favoriteMovies.forEach(card => {
        favoriteList.appendChild(card.cloneNode(true));
    });

    updateFavoriteButtons();
}

function filterMovies() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreFilter.value;

    let visibleCount = 0;

    movieCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const genre = card.dataset.genre;

        const matchesSearch = name.includes(searchText);
        const matchesGenre =
            selectedGenre === "all" || genre === selectedGenre;

        card.hidden = !(matchesSearch && matchesGenre);

        if (!card.hidden) {
            visibleCount++;
        }
    });

    resultsCount.textContent =
        `Табылған фильмдер: ${visibleCount}`;

    noResults.hidden = visibleCount !== 0;
}

function showMovieDetails(card) {
    const movie = getMovieData(card);
    const trailerLink = trailerLinks[movie.id];

    modalContent.innerHTML = `
        <div class="modal-movie">
            <img src="${movie.image}" alt="${movie.name}">

            <div class="modal-info">
                <span class="movie-genre">${movie.genre}</span>

                <h2>${movie.name}</h2>

                <p><strong>Шыққан жылы:</strong> ${movie.year}</p>

                <p><strong>Режиссері:</strong> ${movie.director}</p>

                <p>${movie.description}</p>

                <a
                    href="${trailerLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="trailer-button"
                >
                    ▶ Трейлерді көру
                </a>

                <button
                    class="modal-favorite"
                    data-id="${movie.id}"
                >
                    ${favorites.has(movie.id)
                        ? "♥ Таңдаулылардан алып тастау"
                        : "♡ Таңдаулыларға қосу"}
                </button>
            </div>
        </div>
    `;

    movieModal.showModal();
}

function toggleFavorite(id) {
    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }

    saveFavorites();
    updateFavoriteButtons();
    renderFavorites();
}

function recommendMovie() {
    const selectedGenre = recommendGenre.value;

    const availableMovies = movieCards.filter(card => {
        return selectedGenre === "all" ||
            card.dataset.genre === selectedGenre;
    });

    if (availableMovies.length === 0) {
        recommendResult.textContent =
            "Бұл жанрда фильм табылмады.";
        return;
    }

    const randomIndex = Math.floor(
        Math.random() * availableMovies.length
    );

    const movie = getMovieData(availableMovies[randomIndex]);

    recommendResult.innerHTML = `
        <div class="recommend-card">
            <img src="${movie.image}" alt="${movie.name}">
            <h3>${movie.name}</h3>
            <p>${movie.year} · ${movie.genre}</p>

            <button
                class="recommend-details"
                data-id="${movie.id}"
            >
                Толығырақ
            </button>
        </div>
    `;
}

searchInput.addEventListener("input", filterMovies);
genreFilter.addEventListener("change", filterMovies);
recommendButton.addEventListener("click", recommendMovie);

movieGrid.addEventListener("click", event => {
    const card = event.target.closest(".movie-card");

    if (!card) return;

    if (event.target.closest(".favorite")) {
        toggleFavorite(card.dataset.id);
        return;
    }

    if (
        event.target.closest(".details-button") ||
        event.target.closest(".movie-poster")
    ) {
        showMovieDetails(card);
    }
});

favoriteList.addEventListener("click", event => {
    const card = event.target.closest(".movie-card");

    if (!card) return;

    if (event.target.closest(".favorite")) {
        toggleFavorite(card.dataset.id);
        return;
    }

    if (
        event.target.closest(".details-button") ||
        event.target.closest(".movie-poster")
    ) {
        showMovieDetails(card);
    }
});

recommendResult.addEventListener("click", event => {
    const button = event.target.closest(".recommend-details");

    if (!button) return;

    const card = movieCards.find(
        item => item.dataset.id === button.dataset.id
    );

    if (card) {
        showMovieDetails(card);
    }
});

modalContent.addEventListener("click", event => {
    const button = event.target.closest(".modal-favorite");

    if (!button) return;

    toggleFavorite(button.dataset.id);

    button.textContent = favorites.has(button.dataset.id)
        ? "♥ Таңдаулылардан алып тастау"
        : "♡ Таңдаулыларға қосу";
});

closeModal.addEventListener("click", () => {
    movieModal.close();
});

movieModal.addEventListener("click", event => {
    if (event.target === movieModal) {
        movieModal.close();
    }
});

updateFavoriteButtons();
renderFavorites();
filterMovies();