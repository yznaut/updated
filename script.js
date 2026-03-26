let movies = [];
let currentTab = 'Watching';
let currentUser = "";

// --- AUTH LOGIC ---
const toggleAuth = document.getElementById('toggle-auth');
let isSignUp = false;

toggleAuth.onclick = (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    document.getElementById('auth-title').innerText = isSignUp ? "Sign Up" : "Sign In";
    document.getElementById('auth-submit-btn').innerText = isSignUp ? "Register" : "Login";
};

document.getElementById('auth-submit-btn').onclick = () => {
    const user = document.getElementById('auth-username').value;
    if(user) {
        currentUser = user;
        document.getElementById('display-user').innerText = user;
        document.getElementById('profile-name').innerText = user;
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        renderMovies();
    }
};

function logout() { location.reload(); }

// --- PAGE NAVIGATION ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + pageId).style.display = 'block';
}

// --- MOVIE LOGIC ---
function openModal() { document.getElementById('movie-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('movie-modal').style.display = 'none'; }

function saveMovie() {
    const title = document.getElementById('inp-title').value;
    const genre = document.getElementById('inp-genre').value;
    const date = document.getElementById('inp-date').value;

    if(title) {
        movies.push({ title, genre, date, status: 'Watching', rating: 0 });
        closeModal();
        renderMovies();
    }
}

function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-watching').classList.toggle('active', tab === 'Watching');
    document.getElementById('tab-watched').classList.toggle('active', tab === 'Watched');
    renderMovies();
}

function renderMovies() {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = '';
    const list = movies.filter(m => m.status === currentTab);

    list.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <h4>${movie.title}</h4>
            <p>${movie.genre}</p>
            <small>Added: ${movie.date}</small>
            <div style="margin-top:15px">
                ${movie.status === 'Watching' ? 
                    `<button onclick="finishMovie('${movie.title}')">Finish</button>` : 
                    `<span>Rating: ★★☆☆☆</span>`}
                <button onclick="deleteMovie('${movie.title}')" style="color:red">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function finishMovie(title) {
    const m = movies.find(x => x.title === title);
    if(m) m.status = 'Watched';
    renderMovies();
}

function deleteMovie(title) {
    movies = movies.filter(x => x.title !== title);
    renderMovies();
}
