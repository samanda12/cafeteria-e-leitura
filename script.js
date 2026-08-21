const appData = window.appData || { books: [], communityPosts: [], radioTrack: { title: 'Piano & Chuva', status: 'pronto para começar' } };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function renderBookCards(filter = 'todos') {
  const container = $('#bookGrid');
  if (!container) return;

  const items = appData.books.filter((book) => filter === 'todos' || book.category === filter);

  container.innerHTML = items.map((book) => `
    <article class="book-card" data-category="${book.category}">
      <div class="book-cover ${book.accent}">
        <span>${book.label}</span>
        <strong>${book.title.replace(/ /g, '<br>')}</strong>
        <small>coleção aberta</small>
      </div>
      <div class="book-info">
        <h3>${book.title}</h3>
        <p>${book.genre}</p>
        <button class="read-btn">Ler gratuitamente</button>
      </div>
    </article>
  `).join('');
}

function renderCommunityPosts() {
  const container = $('.community-posts');
  if (!container || !appData.communityPosts.length) return;

  container.innerHTML = appData.communityPosts.map((post) => `
    <article class="post">
      <div class="avatar">${post.author.charAt(0)}</div>
      <div>
        <strong>${post.author}</strong>
        <small>${post.time} · ${post.group}</small>
      </div>
      <p>${post.text}</p>
      <div class="post-actions">♡ 24 &nbsp; · &nbsp; 💬 13</div>
    </article>
  `).join('');
}

function initMenu() {
  const menuToggle = $('.menu-toggle');
  const nav = $('.main-nav');

  menuToggle?.addEventListener('click', () => {
    nav?.classList.toggle('open');
    nav?.classList.toggle('mobile-open');
  });

  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      nav?.classList.remove('mobile-open');
    });
  });
}

function initFilters() {
  const genreButtons = $$('.genre');

  genreButtons.forEach((button) => {
    button.addEventListener('click', () => {
      genreButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      renderBookCards(button.dataset.filter || 'todos');
      bindReadButtons();
    });
  });
}

function initSearch() {
  const searchModal = $('#searchModal');
  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');
  const searchBtn = $('#searchBtn');
  const closeSearch = $('#closeSearch');

  function closeModal() {
    searchModal?.classList.remove('open');
    searchModal?.setAttribute('aria-hidden', 'true');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  searchBtn?.addEventListener('click', () => {
    searchModal?.classList.add('open');
    searchModal?.setAttribute('aria-hidden', 'false');
    searchInput?.focus();
  });

  closeSearch?.addEventListener('click', closeModal);
  searchModal?.addEventListener('click', (event) => {
    if (event.target === searchModal) closeModal();
  });

  searchInput?.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();
    if (!term) {
      searchResults.innerHTML = '';
      return;
    }

    const results = appData.books.filter((book) => {
      const text = `${book.title} ${book.genre} ${book.category}`.toLowerCase();
      return text.includes(term);
    });

    searchResults.innerHTML = results.length
      ? results.slice(0, 5).map((book) => `
        <div class="search-result">
          <strong>${book.title}</strong>
          <small>${book.genre}</small>
        </div>
      `).join('')
      : '<p style="margin-top:20px;color:#77685d">Nenhuma história encontrada ainda.</p>';
  });
}

function initPlayer() {
  const playBtn = $('#playBtn');
  const trackStatus = $('#trackStatus');
  const trackName = $('#trackName');
  const progress = $('#progress');
  let playing = false;
  let intervalId = null;

  if (trackName && appData.radioTrack.title) {
    trackName.textContent = appData.radioTrack.title;
  }

  if (trackStatus && appData.radioTrack.status) {
    trackStatus.textContent = appData.radioTrack.status;
  }

  playBtn?.addEventListener('click', () => {
    playing = !playing;
    playBtn.textContent = playing ? '⏸' : '▶';
    trackStatus.textContent = playing ? 'tocando' : 'pausado';

    clearInterval(intervalId);

    if (playing) {
      let width = 0;
      intervalId = setInterval(() => {
        width += 6;
        if (progress) progress.style.width = `${Math.min(width, 100)}%`;
        if (width >= 100) {
          clearInterval(intervalId);
          playing = false;
          playBtn.textContent = '▶';
          trackStatus.textContent = 'faixa concluída';
        }
      }, 200);
    }
  });
}

function bindReadButtons() {
  document.querySelectorAll('.read-btn').forEach((button) => {
    button.addEventListener('click', () => {
      alert('A área de leitura está preparada. O próximo passo é conectar os livros em domínio público/licenciados.');
    });
  });
}

function initScrollLinks() {
  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(button.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBookCards();
  renderCommunityPosts();
  initMenu();
  initFilters();
  initSearch();
  initPlayer();
  initScrollLinks();
  bindReadButtons();
});
