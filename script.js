let movies = [];
let users = JSON.parse(localStorage.getItem('mwm_users')) || [];
let currentTab = 'Watching';
let movieToFinish = null;
let isSignUpMode = false;

// --- AUTH LOGIC ---
function togglePass(id) {
    const el = document.getElementById(id);
    el.type = el.type === "password" ? "text" : "password";
}

document.getElementById('toggle-auth').onclick = (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-title').innerText = isSignUpMode ? "Sign Up" : "Sign In";
    document.getElementById('auth-submit-btn').innerText = isSignUpMode ? "Register" : "Login";
    document.getElementById('register-only-fields').style.display = isSignUpMode ? "block" : "none";
    document.getElementById('auth-toggle-text').innerHTML = isSignUpMode ? 
        `Already have an account? <a href="#" id="toggle-auth">Sign In</a>` : 
        `Don't have an account? <a href="#" id="toggle-auth">Sign Up</a>`;
    // Re-bind click for dynamic link
    document.getElementById('toggle-auth').onclick = (ev) => { location.reload(); };
};

document.getElementById('auth-submit-btn').onclick = () => {
    const user = document.getElementById('auth-username').value;
    const pass = document.getElementById('auth-password').value;
    const confirm = document.getElementById('auth-confirm-password').value;

    if (isSignUpMode) {
        const hasSymbol = /[!@#$%^&*]/.test(pass);
        const hasNumber = /\d/.test(pass);
        if (pass.length < 8 || !hasSymbol || !hasNumber) {
            return alert("Password must be 8+ characters and contain a number and symbol (!@#$%)");
        }
        if (pass !== confirm) return alert("Passwords do not match!");
        if (users.find(u => u.user === user)) return alert("User already exists!");

        users.push({ user, pass });
        localStorage.setItem('mwm_users', JSON.stringify(users));
        alert("Sign up successful! Please log in.");
        location.reload();
    } else {
        const valid = users.find(u => u.user === user && u.pass === pass);
        if (valid) {
            document.getElementById('auth-overlay').style.display = 'none';
            document.getElementById('main-app').style.display = 'flex';
            document.getElementById('display-user').innerText = user;
            document.getElementById('profile-name').innerText = user;
            renderMovies();
        } else {
            alert("Invalid credentials. Please Sign Up first.");
        }
    }
};

// --- APP LOGIC ---
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById('page-' + id).style.display = 'block';
    document.getElementById('nav-' + id).classList.add('active');
}

function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-watching').classList.toggle('active', tab === 'Watching');
    document.getElementById('tab-watched').classList.toggle('active', tab === 'Watched');
    document.getElementById('add-btn-main').style.display = (tab === 'Watching') ? 'block' : 'none';
    renderMovies();
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function saveMovie() {
    const title = document.getElementById('inp-title').value;
    const genre = document.getElementById('inp-genre').value;
    const date = document.getElementById('inp-date').value;
    if (title) {
        movies.push({ title, genre, date, status: 'Watching', rating: '', comment: '' });
        closeModal('movie-modal');
        renderMovies();
    }
}

function openFinishModal(title) {
    movieToFinish = title;
    openModal('rate-modal');
}

document.getElementById('confirm-finish-btn').onclick = () => {
    const rating = document.getElementById('inp-rating').value;
    const comment = document.getElementById('inp-comment').value;
    const m = movies.find(x => x.title === movieToFinish);
    if (m) {
        m.status = 'Watched';
        m.rating = "★".repeat(rating);
        m.comment = comment;
    }
    closeModal('rate-modal');
    renderMovies();
};

function deleteMovie(title) {
    movies = movies.filter(x => x.title !== title);
    renderMovies();
}

function renderMovies() {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = '';
    const filtered = movies.filter(m => m.status === currentTab);

    filtered.forEach(m => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <h4>${m.title}</h4>
            <p><strong>Genre:</strong> ${m.genre}</p>
            <p><strong>Added:</strong> ${m.date}</p>
            ${m.status === 'Watched' ? `<p><strong>Rating:</strong> ${m.rating}</p><p><strong>Comment:</strong> ${m.comment}</p>` : ''}
            <div style="margin-top:15px; display:flex; gap:10px;">
                ${m.status === 'Watching' ? `<button onclick="openFinishModal('${m.title}')" class="primary-btn" style="padding:5px 15px;">Finish</button>` : ''}
                <button onclick="deleteMovie('${m.title}')" class="cancel-btn" style="color:red; border-color:red; padding:5px 15px;">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function logout() { location.reload(); }
