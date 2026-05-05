const GAME_ASSETS = [
    'https://static.wikia.nocookie.net/mario/images/1/13/SuperStar_-_Super_Mario_Party.png',
    'https://static.wikia.nocookie.net/sonic/images/6/6f/Ring_Sonic_Generations.png',
    'https://static.wikia.nocookie.net/pacman/images/e/e4/Blinky_2.png',
    'https://static.wikia.nocookie.net/pokemon/images/c/ca/Pok%C3%A9_Ball_Sprite.png',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/15/Grass_Block_JE4.png',
    'https://static.wikia.nocookie.net/zelda/images/d/df/Triforce_ALBW.png',
    'https://static.wikia.nocookie.net/v__/images/a/a2/Companion_Cube-Portal.png',
    'https://static.wikia.nocookie.net/mario/images/9/92/Super_Mushroom_-_Mario_Party_10.png',
    'https://static.wikia.nocookie.net/space-invaders/images/0/0e/Invader_Alien.png',
    'https://static.wikia.nocookie.net/pikmin/images/4/4d/Pikmin_1_Red_Pikmin.png'
];

document.addEventListener('DOMContentLoaded', () => {
    generateBgSymbols();
    
    // Path detection - handle Netlify and various URL structures
    const path = window.location.pathname.toLowerCase();
    const isHome = path === '/' || path.endsWith('index.html') || path === '' || path.endsWith('/');

    if (isHome) {
        initHome();
    } else if (path.includes('archive.html')) {
        initArchive();
    } else if (path.includes('game.html')) {
        initGame();
    }
});

function generateBgSymbols() {
    const bg = document.getElementById('bg-symbols');
    if (!bg) return;
    
    // More icons for full coverage
    const iconCount = window.innerWidth < 768 ? 20 : 40; 
    
    for (let i = 0; i < iconCount; i++) {
        const img = document.createElement('img');
        img.src = GAME_ASSETS[Math.floor(Math.random() * GAME_ASSETS.length)];
        img.referrerPolicy = 'no-referrer';
        
        // Random positioning across entire viewport
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.random() * (160 - 70) + 70; // 70px to 160px (MUCH BIGGER)
        const rotation = Math.random() * 360;
        const opacity = Math.random() * (0.07 - 0.02) + 0.02; 
        
        img.style.position = 'absolute';
        img.style.top = `${top}%`;
        img.style.left = `${left}%`;
        img.style.width = `${size}px`;
        img.style.height = 'auto';
        img.style.transform = `rotate(${rotation}deg)`;
        img.style.opacity = opacity;
        img.style.pointerEvents = 'none';
        img.style.filter = 'drop-shadow(0 0 20px rgba(255,255,255,0.05)) grayscale(0.5)';
        
        // Add slow space-swim animation
        const duration = 40 + Math.random() * 50; // Much slower: 40s to 90s
        img.style.animation = `spaceSwim ${duration}s ease-in-out infinite`;
        img.style.animationDelay = `-${Math.random() * duration}s`;
        
        bg.appendChild(img);
    }
}

async function getGames() {
    const res = await fetch('/games.json');
    return await res.json();
}

// HOME PAGE
async function initHome() {
    const games = await getGames();
    const featuredList = document.getElementById('featured-list');
    
    // Show first 3 for featured
    games.slice(0, 3).forEach(game => {
        featuredList.appendChild(createGameCard(game));
    });

    const oracleForm = document.getElementById('oracle-form');
    oracleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('oracle-input');
        const responseBox = document.getElementById('oracle-response');
        const query = input.value;

        if (!query) return;

        responseBox.style.display = 'block';
        responseBox.innerHTML = '<p class="loading-text">oracle is thinking...</p>';

        try {
            const res = await fetch('/api/oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, games })
            });
            const data = await res.json();
            
            responseBox.innerHTML = `
                <h3 style="color: var(--accent); margin-bottom: 1rem;">The Oracle suggests: ${data.title}</h3>
                <p>${data.reason}</p>
                <a href="/game.html?id=${games.find(g => g.title === data.title)?.id}" style="display: block; margin-top: 1.5rem; text-decoration: underline; font-size: 0.8rem;">Explore the vibe →</a>
            `;
        } catch (err) {
            responseBox.innerHTML = '<p>The Oracle is momentarily obscured. Try describing your feeling again.</p>';
        }
    });

    // Chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const input = document.getElementById('oracle-input');
            input.value = chip.textContent;
            oracleForm.dispatchEvent(new Event('submit'));
        });
    });
}

// ARCHIVE PAGE
async function initArchive() {
    const games = await getGames();
    const grid = document.getElementById('archive-grid');
    const filterBar = document.getElementById('filter-bar');
    
    // Get unique moods
    const moods = ['All', ...new Set(games.flatMap(g => g.moods))];
    
    moods.forEach(mood => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${mood === 'All' ? 'active' : ''}`;
        btn.textContent = mood;
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid(mood === 'All' ? games : games.filter(g => g.moods.includes(mood)));
        };
        filterBar.appendChild(btn);
    });

    function renderGrid(list) {
        grid.innerHTML = '';
        list.forEach(game => grid.appendChild(createGameCard(game)));
    }

    renderGrid(games);
}

// GAME PAGE
async function initGame() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const games = await getGames();
    const game = games.find(g => g.id === id);

    if (!game) {
        window.location.href = '/archive.html';
        return;
    }

    document.getElementById('g-title').textContent = game.title;
    document.getElementById('g-vibes').textContent = game.vibes;
    document.getElementById('g-story').innerHTML = game.story.split('\n').map(p => `<p>${p}</p>`).join('<br>');
    document.getElementById('g-why').textContent = game.whyArchived;
    document.getElementById('g-tags').textContent = game.tags.join(' • ');
    document.getElementById('g-moods').textContent = game.moods.join(' / ');
    document.getElementById('g-session').textContent = `${game.session} session`;
    document.getElementById('g-iframe').src = game.iframeUrl;
    document.getElementById('g-steam').href = game.steamUrl;

    // How to Play list
    const howList = document.getElementById('g-how');
    game.howToPlay.split('. ').forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        howList.appendChild(li);
    });

    // Related
    const related = games.filter(g => g.id !== game.id).slice(0, 2);
    const relGrid = document.getElementById('related-grid');
    related.forEach(r => relGrid.appendChild(createGameCard(r)));
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="session-badge">${game.session} session</div>
        <h3><a href="/game.html?id=${game.id}">${game.title}</a></h3>
        <p class="game-vibe">${game.vibes}</p>
        <div class="mood-tags">
            ${game.moods.map(m => `<span class="mood-tag">${m}</span>`).join('')}
        </div>
    `;
    card.onclick = () => window.location.href = `/game.html?id=${game.id}`;
    return card;
}
