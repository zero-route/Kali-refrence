let activeTag  = 'all';
let activeQuery = '';     

document.addEventListener('DOMContentLoaded', () => {
  injectTagFilterBar();
  updateStats();
});

/* ============================================================
   1. STAT NUMBERS — Hitung otomatis dari DOM (DINAMIS)
   ============================================================ */
function updateStats() {
  const categories = document.querySelectorAll('.category');
  let totalToolsGlobal = 0;

  // Hitung tools per kategori dan update badge (cat-count)
  categories.forEach(cat => {
    const toolsInCategory = cat.querySelectorAll('.tool-card').length;
    const countBadge = cat.querySelector('.cat-count');
    
    if (countBadge) {
      countBadge.textContent = toolsInCategory;
    }
    
    totalToolsGlobal += toolsInCategory;
  });

  // Update Global Stats di Header Atas
  const totalCats = categories.length;
  document.querySelectorAll('.stat').forEach(stat => {
    const labelEl = stat.querySelector('.stat-label');
    const numEl   = stat.querySelector('.stat-num');
    
    if (labelEl && numEl) {
      const label = labelEl.textContent.trim().toLowerCase();
      if (label === 'tools')     numEl.textContent = totalToolsGlobal;
      if (label === 'kategori')  numEl.textContent = totalCats;
    }
  });
}

/* ============================================================
   2. TAG FILTER BAR — inject ke dalam .search-bar
   ============================================================ */
function injectTagFilterBar() {
  const tags = [
    { key: 'all',       label: 'Semua' },
    { key: 'offensive', label: 'Offensive' },
    { key: 'defensive', label: 'Defensive' },
    { key: 'active',    label: 'Active' },
    { key: 'passive',   label: 'Passive' },
    { key: 'analysis',  label: 'Analysis' },
  ];

  const bar = document.createElement('div');
  bar.className = 'tag-filter-bar';
  bar.innerHTML = `<span class="tag-filter-label">Filter:</span>` +
    tags.map(t =>
      `<button class="tag-btn${t.key === 'all' ? ' active' : ''}"
               data-tag="${t.key}"
               onclick="setTagFilter('${t.key}')">${t.label}</button>`
    ).join('');

  const searchWrap = document.querySelector('.search-wrap');
  if (searchWrap && searchWrap.parentNode) {
    searchWrap.parentNode.insertBefore(bar, searchWrap.nextSibling);
  }
}

/* ============================================================
   3. SET TAG FILTER
   ============================================================ */
function setTagFilter(tag) {
  activeTag = tag;

  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tag === tag);
  });

  applyFilters();
}

/* ============================================================
   4. SEARCH
   ============================================================ */
function filterTools(query) {
  activeQuery = query.toLowerCase().trim();
  applyFilters();
}

/* ============================================================
   5. CORE FILTER — gabungkan search + tag
   ============================================================ */
function applyFilters() {
  const cards      = document.querySelectorAll('.tool-card');
  const categories = document.querySelectorAll('.category');

  cards.forEach(card => {
    const matchSearch = matchesSearch(card);
    const matchTag    = matchesTag(card);
    card.style.display = (matchSearch && matchTag) ? '' : 'none';
  });

  categories.forEach(cat => {
    const visible = [...cat.querySelectorAll('.tool-card')]
      .some(c => c.style.display !== 'none');
    cat.style.display = visible ? '' : 'none';

    if (visible && (activeQuery || activeTag !== 'all')) {
      const grid   = cat.querySelector('.tools-grid');
      const toggle = cat.querySelector('.cat-toggle');
      if (grid) grid.classList.remove('hidden');
      if (toggle) toggle.classList.add('open');
    }
  });
}

function matchesSearch(card) {
  if (!activeQuery) return true;
  const nameEl = card.querySelector('.tool-name');
  const descEl = card.querySelector('.tool-desc');
  const name = nameEl ? nameEl.textContent.toLowerCase() : '';
  const desc = descEl ? descEl.textContent.toLowerCase() : '';
  return name.includes(activeQuery) || desc.includes(activeQuery);
}

function matchesTag(card) {
  if (activeTag === 'all') return true;
  return card.querySelector(`.tool-tag.tag-${activeTag}`) !== null;
}

function toggleCat(header) {
  const grid   = header.nextElementSibling;
  const toggle = header.querySelector('.cat-toggle');
  if (grid) grid.classList.toggle('hidden');
  if (toggle) toggle.classList.toggle('open');
}
 // === BACK TO TOP (draggable) ===
const btn = document.getElementById('backToTop');
let isDragging = false, startX, startY, startLeft, startBottom;

window.addEventListener('scroll', () => {
  btn.classList.toggle('visible', window.scrollY > 300);
});

btn.addEventListener('click', () => {
  if (!isDragging) window.scrollTo({ top: 0, behavior: 'smooth' });
});

btn.addEventListener('mousedown', e => {
  isDragging = false;
  startX = e.clientX;
  startY = e.clientY;
  const rect = btn.getBoundingClientRect();
  startLeft = rect.left;
  startBottom = window.innerHeight - rect.bottom;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', onDrop);
  e.preventDefault();
});

function onDrag(e) {
  const dx = Math.abs(e.clientX - startX);
  const dy = Math.abs(e.clientY - startY);
  if (dx > 5 || dy > 5) isDragging = true;

  if (isDragging) {
    const newLeft = startLeft + (e.clientX - startX);
    const newBottom = startBottom - (e.clientY - startY);
    btn.style.left   = Math.max(0, Math.min(newLeft, window.innerWidth - 56)) + 'px';
    btn.style.bottom = Math.max(0, Math.min(newBottom, window.innerHeight - 56)) + 'px';
    btn.style.right  = 'auto';
  }
}

function onDrop() {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', onDrop);
  setTimeout(() => isDragging = false, 10);
}
