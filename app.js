(() => {
  const data = window.REITORA_DATA;
  const years = (() => {
    // 59..99, then 00
    const arr = [];
    for (let y = 59; y <= 99; y++) arr.push(String(y));
    arr.push("00");
    return arr;
  })();

  const $grid = document.getElementById('grid');
  const $yearNav = document.getElementById('yearNav');
  const $search = document.getElementById('search');
  const $hit = document.getElementById('hitCount');
  const $sort = document.getElementById('sortBtn');
  const $theme = document.getElementById('themeBtn');

  let desc = true;

  // Theme
  const restoreTheme = () => {
    const t = localStorage.getItem('theme') || 'dark';
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
  };
  restoreTheme();
  $theme.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });

  // Render
  const renderNav = (order) => {
    $yearNav.innerHTML = '';
    order.forEach(y => {
      const a = document.createElement('a');
      a.href = `#y${y}`;
      a.className = 'year-pill';
      a.textContent = y + '年';
      $yearNav.appendChild(a);
    });
  };

  const renderGrid = (order, q = '') => {
    const query = q.trim();
    let total = 0;
    $grid.innerHTML = '';
    order.forEach(y => {
      const names = (data[y] || []);
      const filtered = query ? names.filter(n => n.includes(query)) : names;
      total += filtered.length;
      const card = document.createElement('section');
      card.className = 'card';
      card.id = `y${y}`;

      const head = document.createElement('div');
      head.className = 'card__head';

      const yearEl = document.createElement('div');
      yearEl.className = 'card__year';
      yearEl.textContent = `${y}年`;

      const countEl = document.createElement('div');
      countEl.className = 'card__count';
      countEl.textContent = filtered.length ? `${filtered.length}名` : '—';

      head.append(yearEl, countEl);

      const chips = document.createElement('div');
      chips.className = 'card__chips';
      if (filtered.length) {
        filtered.forEach(n => {
          const span = document.createElement('span');
          span.className = 'chip';
          span.textContent = n;
          chips.appendChild(span);
        });
      } else {
        const span = document.createElement('span');
        span.className = 'chip';
        span.textContent = '未登録';
        chips.appendChild(span);
      }

      card.append(head, chips);
      $grid.appendChild(card);
    });
    $hit.textContent = query ? `ヒット: ${total}名` : '';
  };

  const order = () => {
    const base = years.slice();
    base.sort((a,b) => {
      const aa = a === '00' ? 100 : parseInt(a,10);
      const bb = b === '00' ? 100 : parseInt(b,10);
      return desc ? bb - aa : aa - bb;
    });
    return base;
  };

  renderNav(order());
  renderGrid(order());

  $search.addEventListener('input', (e) => {
    renderGrid(order(), e.target.value);
  });

  $sort.addEventListener('click', () => {
    desc = !desc;
    $sort.textContent = desc ? '降順' : '昇順';
    renderNav(order());
    renderGrid(order(), $search.value);
  });
})();
