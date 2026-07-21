// ATENÇÃO: Troque pelo link gerado pelo seu Cloudflare Worker
const WORKER_URL = "https://mtz-player.joaopedro2012fl.workers.dev"; 

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const songsList = document.getElementById('songs-list');
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');

// Listener para buscar ao clicar no botão ou apertar Enter
searchBtn.addEventListener('click', searchSongs);
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchSongs(); });

// Controle manual de Play/Pause na barra de baixo
playPauseBtn.addEventListener('click', () => {
    if (!audioPlayer.src) return;
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = `<span class="material-symbols-rounded">pause</span>`;
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = `<span class="material-symbols-rounded">play_arrow</span>`;
    }
});

async function searchSongs() {
    const query = searchInput.value.trim();
    if (!query) return;

    songsList.innerHTML = `
        <div class="empty-state">
            <p>Procurando no Mtz Player...</p>
        </div>
    `;

    try {
        const res = await fetch(`${WORKER_URL}/api/search?q=${encodeURIComponent(query)}`);
        const songs = await res.json();

        songsList.innerHTML = "";

        if (songs.length === 0) {
            songsList.innerHTML = `
                <div class="empty-state">
                    <span class="material-symbols-rounded">sentiment_dissatisfied</span>
                    <p>Nenhuma música encontrada.</p>
                </div>
            `;
            return;
        }

        songs.forEach(song => {
            const card = document.createElement('div');
            card.className = 'song-card';
            
            // O próprio card vira o botão de clique para tocar a música
            card.onclick = () => playSong(song.id, song.title, song.uploader, song.thumbnail);
            
            card.innerHTML = `
                <img src="${song.thumbnail}" alt="Capa" class="song-thumb">
                <div class="song-meta">
                    <p class="song-title">${song.title}</p>
                    <p class="song-artist">${song.uploader}</p>
                </div>
                <button class="card-play-btn">
                    <span class="material-symbols-rounded">play_circle</span>
                </button>
            `;
            songsList.appendChild(card);
        });
    } catch (err) {
        songsList.innerHTML = `
            <div class="empty-state">
                <p>Erro de conexão com o Worker da Cloudflare.</p>
            </div>
        `;
    }
}

async function playSong(id, title, artist, thumbnail) {
    // Atualiza o player visual imediatamente com estado de carregamento
    document.getElementById('current-title').innerText = "Carregando...";
    document.getElementById('current-artist').innerText = artist;
    document.getElementById('player-thumb').src = thumbnail;

    try {
        const res = await fetch(`${WORKER_URL}/api/stream?id=${id}`);
        const data = await res.json();

        audioPlayer.src = data.url;
        audioPlayer.play();
        
        // Atualiza os textos e botão de controle para "Pause"
        document.getElementById('current-title').innerText = title;
        playPauseBtn.innerHTML = `<span class="material-symbols-rounded">pause</span>`;

        // Ativa controles do sistema operacional/tela de bloqueio
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: artist,
                artwork: [{ src: thumbnail }]
            });
        }
    } catch (err) {
        document.getElementById('current-title').innerText = "Erro ao reproduzir";
    }
}
