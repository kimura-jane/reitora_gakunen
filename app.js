(() => {
  const data = window.REITORA_DATA;
  const years = (() => {
    const arr = [];
    for (let y = 59; y <= 99; y++) arr.push(String(y));
    arr.push("00");
    return arr;
  })();

  const $list = document.getElementById('list');
  const $search = document.getElementById('search');
  const $hit = document.getElementById('hitCount');
  const $sort = document.getElementById('sortBtn');
  const $theme = document.getElementById('themeBtn');
  const $yearBtn = document.getElementById('yearBtn');
  const $dlg = document.getElementById('yearDialog');
  const $yearSearch = document.getElementById('yearSearch');
  const $yearList = document.getElementById('yearList');

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

  // Render helpers
  const makeOrder = () => {
    const base = years.slice();
    base.sort((a,b) => {
      const aa = a === '00' ? 100 : parseInt(a,10);
      const bb = b === '00' ? 100 : parseInt(b,10);
      return desc ? bb - aa : aa - bb;
    });
    return base;
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

  const renderYearDialog = (order, q = '') => {
    const query = q.trim();
    $yearList.innerHTML = '';
    order.forEach(y => {
      if (query && !y.includes(query)) return;
      const item = document.createElement('div');
      item.className = 'year-item';
      item.setAttribute('role','option');
      item.dataset.y = y;

      const label = document.createElement('span');
      label.className = 'year-item__label';
      label.textContent = `${y}年`;

      const cnt = document.createElement('span');
      const names = (data[y] || []);
      cnt.className = 'year-item__count';
      cnt.textContent = names.length ? `${names.length}名` : '—';

      item.append(label, cnt);
      $yearList.appendChild(item);
    });
  };

  // Initial render
  renderList(makeOrder());
  renderYearDialog(makeOrder());

  // Search in list
  $search.addEventListener('input', (e) => {
    renderList(makeOrder(), e.target.value);
  });

  // Sort
  $sort.addEventListener('click', () => {
    desc = !desc;
    $sort.textContent = desc ? '降順' : '昇順';
    renderList(makeOrder(), $search.value);
    renderYearDialog(makeOrder(), $yearSearch.value);
  });

  // Dialog open
  $yearBtn.addEventListener('click', () => {
    renderYearDialog(makeOrder(), '');
    $yearSearch.value = '';
    if (typeof $dlg.showModal === 'function') $dlg.showModal();
    else $dlg.setAttribute('open','open');
  });

  // Dialog search
  $yearSearch.addEventListener('input', (e) => {
    renderYearDialog(makeOrder(), e.target.value.replace(/[^0-9]/g,''));
  });

  // Select year
  $yearList.addEventListener('click', (e) => {
    const item = e.target.closest('.year-item');
    if (!item) return;
    const y = item.dataset.y;
    const t = document.getElementById(`y${y}`);
    if (t) {
      t.scrollIntoView({ behavior: 'smooth', block: 'center' });
      t.classList.add('highlight');
      setTimeout(() => t.classList.remove('highlight'), 1200);
    }
    if (typeof $dlg.close === 'function') $dlg.close();
    else $dlg.removeAttribute('open');
  });
})();
