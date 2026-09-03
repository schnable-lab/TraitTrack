/* ─── Mobile menu ─────────────────────────────────────────────────────────── */
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function openMenu() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.textContent = 'Close';
}

function closeMenu() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.textContent = 'Menu';
}

menuBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeMenu() : openMenu();
});

// Tap the backdrop to close
overlay.addEventListener('click', closeMenu);

// Nav link click — only close menu on mobile
document.querySelectorAll('.sidebar a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 760) closeMenu();
  });
});

/* ─── Search ──────────────────────────────────────────────────────────────── */
const search = document.getElementById('searchInput');
const sections = [...document.querySelectorAll('main section')];

search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  let matches = 0;

  sections.forEach(s => {
    const match = !q || s.innerText.toLowerCase().includes(q);
    s.style.display = match ? '' : 'none';
    if (match) matches++;
  });

  document.getElementById('noResults').style.display =
    matches ? 'none' : 'block';
});

/* ─── Scrollspy — highlight active nav link ───────────────────────────────── */
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    });
  },
  { rootMargin: '-20% 0px -70% 0px' }
);

sections.forEach(s => observer.observe(s));
