const menuBtn = document.getElementById('menuBtn');

const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));

document.querySelectorAll('.sidebar a').forEach(a => {

  a.addEventListener('click', () => sidebar.classList.remove('open'));

});

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

