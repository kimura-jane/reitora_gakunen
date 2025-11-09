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

  // 初期は昇順
  let desc = false;

  // 初期テーマはライト
  const restoreTheme = () => {
    const t = localStorage.getItem('theme') || 'light';
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

  const makeOrder = () => {
    const base = years.slice();
    base.sort((a,b) => {
      const aa = a === '00' ? 100 : parseInt(a,10);
      const bb = b === '00' ? 100 : parseInt(b,10);
      return desc ? bb - aa : aa - bb;
    });
    return base;
  };

  // 検索中はヒットのある年代だけ描画
  const renderList = (order, q = '') => {
    const query = q.trim();
    let totalNames = 0;
    let matchedYears = 0;

    $list.innerHTML = '';
    order.forEach(y => {
      const names = (data[y] || []);
      const filtered = query ? names.filter(n => n.includes(query)) : names;

      // クエリありでヒット0ならその年は表示しない
      if (query && filtered.length === 0) return;

      matchedYears += query ? 1 : 1; // 行は表示されるので+1
      totalNames += query ? filtered.length : names.length;

      const row = document.createElement('section');
      row.className = 'row';
      row.id = `y${y}`;

      const yearEl = document.createElement('div');
      yearEl.className = 'row__year';
      yearEl.textContent = `${y}年`;

      const chips = document.createElement('div');
      chips.className = 'row__chips';

      if (query) {
        // 検索時はヒット名のみ表示
        filtered.forEach(n => {
          const span = document.createElement('span');
          span.className = 'chip';
          span.textContent = n;
          chips.appendChild(span);
        });
      } else {
        // 通常時は全件。0件は「未登録」
        if (names.length) {
          names.forEach(n => {
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
      }

      const countEl = document.createElement('div');
      countEl.className = 'row__count';
      const countNum = query ? filtered.length : names.length;
      countEl.textContent = countNum ? `${countNum}名` : '—';

      row.append(yearEl, chips, countEl);
      $list.appendChild(row);
    });

    // ヒット表示（名/年）
    $hit.textContent = query ? `ヒット: ${totalNames}名 / ${$list.children.length}年` : '';
  };

  // 年選択モーダルは従来どおり（数字のみ検索）
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

  // 初期描画
  $sort.textContent = '昇順';
  renderList(makeOrder());
  renderYearDialog(makeOrder());

  // 検索
  $search.addEventListener('input', (e) => {
    renderList(makeOrder(), e.target.value);
  });

  // ソート切替
  $sort.addEventListener('click', () => {
    desc = !desc;
    $sort.textContent = desc ? '降順' : '昇順';
    renderList(makeOrder(), $search.value);
    renderYearDialog(makeOrder(), $yearSearch.value);
  });

  // モーダル起動
  $yearBtn.addEventListener('click', () => {
    renderYearDialog(makeOrder(), '');
    $yearSearch.value = '';
    if (typeof $dlg.showModal === 'function') $dlg.showModal();
    else $dlg.setAttribute('open','open');
  });

  // モーダル内検索（数字だけ許可）
  $yearSearch.addEventListener('input', (e) => {
    renderYearDialog(makeOrder(), e.target.value.replace(/[^0-9]/g,''));
  });

  // 年選択 → スクロール
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
