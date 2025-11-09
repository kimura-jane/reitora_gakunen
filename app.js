(() => {
  const data = window.REITORA_DATA;
  const years = (() => {
    const arr = [];
    for (let y = 59; y <= 99; y++) arr.push(String(y));
    arr.push("00");
    return arr;
  })();

  const $list = document.getElementById('list');
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

  const renderList = (order, q = '') => {
    const query = q.trim();
    let total = 0;
    $list.innerHTML = '';
    order.forEach(y => {
      const names = (data[y] || []);
      const filtered = query ? names.filter(n => n.includes(query)) : names;
      total += filtered.length;

      const row = document.createElement('section');
      row.className = 'row';
      row.id = `y${y}`;

      const yearEl = document.createElement('div');
      yearEl.className = 'row__year';
      yearEl.textContent = `${y}年`;

      const chips = document.createElement('div');
      chips.className = 'row__chips';
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

      const countEl = document.createElement('div');
      countEl.className = 'row__count';
      countEl.textContent = filtered.length ? `${filtered.length}名` : '—';

      row.append(yearEl, chips, countEl);
      $list.appendChild(row);
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
  renderList(order());

  $search.addEventListener('input', (e) => {
    renderList(order(), e.target.value);
  });

  $sort.addEventListener('click', () => {
    desc = !desc;
    $sort.textContent = desc ? '降順' : '昇順';
    renderNav(order());
    renderList(order(), $search.value);
  });
})();
