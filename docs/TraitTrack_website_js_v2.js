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

/* ─── Search with keyword highlighting ────────────────────────────────────── */
const search = document.getElementById('searchInput');
const sections = [...document.querySelectorAll('main section')];

// Cache deep clones so we can restore original HTML after each search
const sectionClones = sections.map(s => s.cloneNode(true));

function restoreSection(idx) {
    const s = sections[idx];
    const clone = sectionClones[idx].cloneNode(true);
    while (s.firstChild) s.removeChild(s.firstChild);
    while (clone.firstChild) s.appendChild(clone.firstChild);
}

function highlightTextNodes(el, q) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) {
          const tag = n.parentElement ? n.parentElement.tagName : '';
          if (['SCRIPT', 'STYLE', 'MARK'].includes(tag)) continue;
          if (n.textContent.toLowerCase().includes(q)) textNodes.push(n);
    }
    for (const node of textNodes) {
          const text = node.textContent;
          const lower = text.toLowerCase();
          const frag = document.createDocumentFragment();
          let lastIdx = 0;
          let idx = lower.indexOf(q);
          while (idx !== -1) {
                  frag.appendChild(document.createTextNode(text.slice(lastIdx, idx)));
                  const mark = document.createElement('mark');
                  mark.className = 'search-mark';
                  mark.textContent = text.slice(idx, idx + q.length);
                  frag.appendChild(mark);
                  lastIdx = idx + q.length;
                  idx = lower.indexOf(q, lastIdx);
          }
          frag.appendChild(document.createTextNode(text.slice(lastIdx)));
          node.parentNode.replaceChild(frag, node);
    }
}

search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let matches = 0;

                          sections.forEach((s, i) => {
                                restoreSection(i);

                                               if (!q) {
                                                       s.classList.remove('search-dim');
                                                       return;
                                               }

                                               const hasMatch = s.textContent.toLowerCase().includes(q);
                                if (hasMatch) {
                                        matches++;
                                        s.classList.remove('search-dim');
                                        highlightTextNodes(s, q);
                                } else {
                                        s.classList.add('search-dim');
                                }
                          });

                          document.getElementById('noResults').style.display =
                                (!q || matches) ? 'none' : 'block';
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
