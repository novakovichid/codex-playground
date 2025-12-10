(() => {
  const memoryStore = {};
  const STORAGE_KEYS = {
    profile: 'mappu_profile',
    maps: 'mappu_maps'
  };

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStore[key] || null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      memoryStore[key] = value;
    }
  }

  const dom = {
    profileForm: document.getElementById('profileForm'),
    profileFullName: document.getElementById('profileFullName'),
    profileEmailInput: document.getElementById('profileEmailInput'),
    profileHeadline: document.getElementById('profileHeadline'),
    profileAvatarInput: document.getElementById('profileAvatarInput'),
    profileAvatar: document.getElementById('profileAvatar'),
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail'),
    resetProfile: document.getElementById('resetProfile'),
    openProfile: document.getElementById('openProfile'),

    mapForm: document.getElementById('mapForm'),
    mapTitle: document.getElementById('mapTitle'),
    mapDescription: document.getElementById('mapDescription'),
    mapTags: document.getElementById('mapTags'),
    mapVisibility: document.getElementById('mapVisibility'),
    mapList: document.getElementById('mapList'),
    publishMap: document.getElementById('publishMap'),
    deleteMap: document.getElementById('deleteMap'),
    duplicateMap: document.getElementById('duplicateMap'),
    searchInput: document.getElementById('searchInput'),
    publicOnly: document.getElementById('publicOnly'),

    nodeForm: document.getElementById('nodeForm'),
    nodeLabel: document.getElementById('nodeLabel'),
    nodeTags: document.getElementById('nodeTags'),
    nodeColor: document.getElementById('nodeColor'),
    centerNodes: document.getElementById('centerNodes'),

    edgeForm: document.getElementById('edgeForm'),
    edgeFrom: document.getElementById('edgeFrom'),
    edgeTo: document.getElementById('edgeTo'),
    edgeLabel: document.getElementById('edgeLabel'),

    importForm: document.getElementById('importForm'),
    importInput: document.getElementById('importInput'),

    shareOutput: document.getElementById('shareOutput'),
    copyShare: document.getElementById('copyShare'),
    exportMap: document.getElementById('exportMap'),

    canvas: document.getElementById('canvas'),
    edgeLayer: document.getElementById('edgeLayer'),
    nodeLayer: document.getElementById('nodeLayer'),
    canvasHint: document.getElementById('canvasHint'),

    editorTitle: document.getElementById('editorTitle'),
    editorSubtitle: document.getElementById('editorSubtitle'),
    mapStatus: document.getElementById('mapStatus'),
    shareBox: document.getElementById('shareOutput')
  };

  const state = {
    profile: loadProfile(),
    maps: loadMaps(),
    currentMapId: null
  };

  const utils = {
    parseTags(str) {
      return str
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith('#') ? t : `#${t}`));
    },
    formatDate(ts) {
      return new Date(ts).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
    },
    randomId(prefix) {
      return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
    },
    getShareLink(map) {
      const payload = btoa(encodeURIComponent(JSON.stringify(map)));
      const url = new URL(window.location.href);
      url.hash = `share=${payload}`;
      return url.toString();
    },
    safeJSON(str) {
      try {
        return JSON.parse(str);
      } catch (e) {
        return null;
      }
    },
    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
  };

  function loadProfile() {
    const raw = readStorage(STORAGE_KEYS.profile);
    if (raw) {
      return utils.safeJSON(raw) || defaultProfile();
    }
    return defaultProfile();
  }

  function defaultProfile() {
    return {
      fullName: 'Анонимный картограф',
      email: '',
      headline: 'Готовлюсь к экспедиции',
      avatar: '🧭'
    };
  }

  function saveProfile(profile) {
    writeStorage(STORAGE_KEYS.profile, JSON.stringify(profile));
  }

  function loadMaps() {
    const raw = readStorage(STORAGE_KEYS.maps);
    if (raw) {
      const parsed = utils.safeJSON(raw);
      if (parsed && Array.isArray(parsed)) return parsed;
    }
    const starter = createStarterMaps();
    writeStorage(STORAGE_KEYS.maps, JSON.stringify(starter));
    return starter;
  }

  function persistMaps() {
    writeStorage(STORAGE_KEYS.maps, JSON.stringify(state.maps));
  }

  function createStarterMaps() {
    const mapId = utils.randomId('map');
    const ideaId = utils.randomId('node');
    const researchId = utils.randomId('node');
    const prototypeId = utils.randomId('node');
    return [
      {
        id: mapId,
        title: 'Демонстрационная карта',
        description: 'Найдите, как знания соединяются между собой',
        tags: ['#demo', '#mappu', '#старт'],
        visibility: 'public',
        nodes: [
          { id: ideaId, label: 'Идея', x: 180, y: 120, color: '#2563eb', tags: ['#старт'] },
          { id: researchId, label: 'Исследование', x: 420, y: 200, color: '#22c55e', tags: ['#ресурсы'] },
          { id: prototypeId, label: 'Прототип', x: 260, y: 340, color: '#a855f7', tags: ['#mvp'] }
        ],
        edges: [
          { id: utils.randomId('edge'), from: ideaId, to: researchId, label: 'Требует данных' },
          { id: utils.randomId('edge'), from: researchId, to: prototypeId, label: 'Основано на выводах' }
        ],
        updatedAt: Date.now(),
        publishedAt: null,
        shareLink: ''
      }
    ];
  }

  function syncProfileForm() {
    dom.profileFullName.value = state.profile.fullName || '';
    dom.profileEmailInput.value = state.profile.email || '';
    dom.profileHeadline.value = state.profile.headline || '';
    dom.profileAvatarInput.value = state.profile.avatar || '';
    dom.profileAvatar.textContent = state.profile.avatar || '👤';
    dom.profileName.textContent = state.profile.fullName || 'Незнакомец';
    dom.profileEmail.textContent = state.profile.email || 'Email не указан';
  }

  function handleProfileSubmit(event) {
    event.preventDefault();
    state.profile = {
      fullName: dom.profileFullName.value.trim() || 'Картограф',
      email: dom.profileEmailInput.value.trim(),
      headline: dom.profileHeadline.value.trim(),
      avatar: dom.profileAvatarInput.value.trim() || '🧭'
    };
    saveProfile(state.profile);
    syncProfileForm();
  }

  function resetProfile() {
    state.profile = defaultProfile();
    saveProfile(state.profile);
    syncProfileForm();
  }

  function renderMapList() {
    dom.mapList.innerHTML = '';
    const query = dom.searchInput.value.trim().toLowerCase();
    const onlyPublic = dom.publicOnly.checked;
    const matches = state.maps.filter((m) => {
      const textMatch = m.title.toLowerCase().includes(query) ||
        m.tags.some((t) => t.toLowerCase().includes(query));
      const visibilityMatch = onlyPublic ? m.visibility === 'public' : true;
      return textMatch && visibilityMatch;
    });

    if (!matches.length) {
      dom.mapList.innerHTML = '<p class="muted">Нет карт по фильтру</p>';
      return;
    }

    matches
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .forEach((map) => {
        const card = document.createElement('div');
        card.className = 'map-card';
        const meta = document.createElement('div');
        meta.className = 'meta';
        const title = document.createElement('h3');
        title.textContent = map.title;
        const desc = document.createElement('p');
        desc.textContent = map.description || 'Без описания';
        const tagsWrap = document.createElement('div');
        tagsWrap.className = 'tags';
        map.tags.forEach((tag) => {
          const tagEl = document.createElement('span');
          tagEl.className = 'tag';
          tagEl.textContent = tag;
          tagsWrap.append(tagEl);
        });
        const metaLine = document.createElement('small');
        metaLine.className = 'muted';
        metaLine.textContent = `${map.visibility === 'public' ? 'Публичная' : 'Приватная'} · обновлена ${utils.formatDate(map.updatedAt)}`;
        meta.append(title, desc, tagsWrap, metaLine);
        const actions = document.createElement('div');
        actions.className = 'actions';
        const openBtn = document.createElement('button');
        openBtn.className = 'btn primary';
        openBtn.textContent = 'Открыть';
        openBtn.onclick = () => loadMap(map.id);
        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn ghost';
        exportBtn.textContent = 'Экспорт';
        exportBtn.onclick = () => exportMapJSON(map);
        actions.append(openBtn, exportBtn);
        card.append(meta, actions);
        dom.mapList.append(card);
      });
  }

  function loadMap(mapId) {
    const map = state.maps.find((m) => m.id === mapId);
    if (!map) return;
    state.currentMapId = mapId;
    dom.mapTitle.value = map.title;
    dom.mapDescription.value = map.description || '';
    dom.mapTags.value = map.tags.join(', ');
    dom.mapVisibility.value = map.visibility;
    dom.mapStatus.textContent = `${map.visibility === 'public' ? 'Публичная' : 'Приватная'} · обновлена ${utils.formatDate(map.updatedAt)}`;
    dom.editorTitle.textContent = map.title;
    dom.editorSubtitle.textContent = map.description || 'Редактируйте узлы и связи';
    dom.shareOutput.value = map.shareLink || '';
    renderNodes();
    renderEdgeSelectors();
  }

  function getCurrentMap() {
    return state.maps.find((m) => m.id === state.currentMapId) || null;
  }

  function handleMapSubmit(event) {
    event.preventDefault();
    const title = dom.mapTitle.value.trim() || 'Без названия';
    const description = dom.mapDescription.value.trim();
    const tags = utils.parseTags(dom.mapTags.value);
    const visibility = dom.mapVisibility.value;

    if (!state.currentMapId) {
      const newMap = {
        id: utils.randomId('map'),
        title,
        description,
        tags,
        visibility,
        nodes: [],
        edges: [],
        updatedAt: Date.now(),
        publishedAt: null,
        shareLink: ''
      };
      state.maps.push(newMap);
      state.currentMapId = newMap.id;
    } else {
      const map = getCurrentMap();
      map.title = title;
      map.description = description;
      map.tags = tags;
      map.visibility = visibility;
      map.updatedAt = Date.now();
    }

    persistMaps();
    renderMapList();
    loadMap(state.currentMapId);
  }

  function addNode(event) {
    event.preventDefault();
    const map = ensureMap();
    const rect = dom.canvas.getBoundingClientRect();
    const x = rect.width / 2 + (Math.random() * 80 - 40);
    const y = rect.height / 2 + (Math.random() * 80 - 40);
    map.nodes.push({
      id: utils.randomId('node'),
      label: dom.nodeLabel.value.trim() || 'Узел',
      tags: utils.parseTags(dom.nodeTags.value),
      color: dom.nodeColor.value,
      x,
      y
    });
    map.updatedAt = Date.now();
    dom.nodeLabel.value = '';
    dom.nodeTags.value = '';
    persistMaps();
    renderNodes();
    renderEdgeSelectors();
    renderMapList();
    loadMap(map.id);
  }

  function ensureMap() {
    if (!state.currentMapId) {
      dom.mapTitle.value = dom.mapTitle.value || 'Новая карта';
      handleMapSubmit(new Event('submit'));
    }
    return getCurrentMap();
  }

  function addEdge(event) {
    event.preventDefault();
    const map = getCurrentMap();
    if (!map) return;
    const from = dom.edgeFrom.value;
    const to = dom.edgeTo.value;
    if (from === to || !from || !to) return;
    map.edges.push({ id: utils.randomId('edge'), from, to, label: dom.edgeLabel.value.trim() });
    map.updatedAt = Date.now();
    dom.edgeLabel.value = '';
    persistMaps();
    renderNodes();
    renderMapList();
    loadMap(map.id);
  }

  function renderEdgeSelectors() {
    const map = getCurrentMap();
    const nodes = map ? map.nodes : [];
    const options = nodes.map((n) => `<option value="${n.id}">${n.label}</option>`).join('');
    dom.edgeFrom.innerHTML = options;
    dom.edgeTo.innerHTML = options;
  }

  function renderNodes() {
    dom.nodeLayer.innerHTML = '';
    const map = getCurrentMap();
    dom.canvasHint.style.display = map && map.nodes.length ? 'none' : 'block';
    if (!map) return;

    map.nodes.forEach((node) => {
      const el = document.createElement('div');
      el.className = 'node';
      el.style.background = node.color || '#2563eb';
      el.style.left = `${node.x}px`;
      el.style.top = `${node.y}px`;
      el.dataset.id = node.id;
      const title = document.createElement('h4');
      title.textContent = node.label;
      const hint = document.createElement('small');
      hint.textContent = node.tags.join(' ');
      const tagsWrap = document.createElement('div');
      tagsWrap.className = 'node-tags';
      node.tags.forEach((tag) => {
        const tagEl = document.createElement('span');
        tagEl.className = 'node-tag';
        tagEl.textContent = tag;
        tagsWrap.append(tagEl);
      });
      el.append(title, hint, tagsWrap);
      makeDraggable(el, node);
      dom.nodeLayer.append(el);
    });
    redrawEdges(map);
  }

  function redrawEdges(map) {
    dom.edgeLayer.innerHTML = '';
    renderEdges(map);
  }

  function renderEdges(map) {
    map.edges.forEach((edge) => {
      const from = map.nodes.find((n) => n.id === edge.from);
      const to = map.nodes.find((n) => n.id === edge.to);
      if (!from || !to) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const { x1, y1, x2, y2 } = getEdgePositions(from, to);
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', 'rgba(226, 232, 240, 0.6)');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('marker-end', 'url(#arrowhead)');

      text.setAttribute('x', (x1 + x2) / 2);
      text.setAttribute('y', (y1 + y2) / 2 - 4);
      text.setAttribute('fill', '#cbd5f5');
      text.setAttribute('font-size', '12');
      text.setAttribute('text-anchor', 'middle');
      text.textContent = edge.label || '';

      dom.edgeLayer.append(line, text);
    });
    ensureArrowHead();
  }

  function ensureArrowHead() {
    if (dom.edgeLayer.querySelector('marker#arrowhead')) return;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#cbd5f5');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    dom.edgeLayer.prepend(defs);
  }

  function getEdgePositions(from, to) {
    const startX = from.x + 80;
    const startY = from.y + 30;
    const endX = to.x + 80;
    const endY = to.y + 30;
    return { x1: startX, y1: startY, x2: endX, y2: endY };
  }

  function makeDraggable(element, node) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.addEventListener('pointerdown', (e) => {
      isDragging = true;
      offsetX = e.clientX - node.x;
      offsetY = e.clientY - node.y;
      element.setPointerCapture(e.pointerId);
    });

    element.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const rect = dom.canvas.getBoundingClientRect();
      node.x = Math.min(rect.width - 50, Math.max(-10, e.clientX - offsetX));
      node.y = Math.min(rect.height - 50, Math.max(-10, e.clientY - offsetY));
      element.style.left = `${node.x}px`;
      element.style.top = `${node.y}px`;
      const map = getCurrentMap();
      if (map) redrawEdges(map);
    });

    element.addEventListener('pointerup', (e) => {
      isDragging = false;
      element.releasePointerCapture(e.pointerId);
      const map = getCurrentMap();
      if (map) {
        map.updatedAt = Date.now();
        persistMaps();
        renderMapList();
      }
    });
  }

  function centerNodes() {
    const map = getCurrentMap();
    if (!map || !map.nodes.length) return;
    const rect = dom.canvas.getBoundingClientRect();
    const radius = Math.min(rect.width, rect.height) / 2.6;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    map.nodes.forEach((node, idx) => {
      const angle = (idx / map.nodes.length) * Math.PI * 2;
      node.x = cx + Math.cos(angle) * radius - 80;
      node.y = cy + Math.sin(angle) * radius - 30;
    });
    map.updatedAt = Date.now();
    persistMaps();
    renderNodes();
    renderMapList();
  }

  function publishMap() {
    const map = getCurrentMap();
    if (!map) return;
    map.publishedAt = Date.now();
    map.shareLink = utils.getShareLink(map);
    map.visibility = 'public';
    map.updatedAt = Date.now();
    dom.mapVisibility.value = 'public';
    dom.shareOutput.value = map.shareLink;
    persistMaps();
    renderMapList();
    dom.mapStatus.textContent = `Публичная · опубликована ${utils.formatDate(map.publishedAt)}`;
  }

  function copyShare() {
    if (!dom.shareOutput.value) return;
    navigator.clipboard.writeText(dom.shareOutput.value).catch(() => {
      dom.shareOutput.select();
      document.execCommand('copy');
    });
  }

  function exportMapJSON(map) {
    const payload = JSON.stringify(map, null, 2);
    dom.shareOutput.value = payload;
    dom.shareOutput.select();
    try {
      navigator.clipboard.writeText(payload);
    } catch (e) {
      document.execCommand('copy');
    }
  }

  function deleteMap() {
    if (!state.currentMapId) return;
    state.maps = state.maps.filter((m) => m.id !== state.currentMapId);
    state.currentMapId = state.maps[0]?.id || null;
    persistMaps();
    renderMapList();
    if (state.currentMapId) {
      loadMap(state.currentMapId);
    } else {
      dom.nodeLayer.innerHTML = '';
      dom.edgeLayer.innerHTML = '';
      dom.editorTitle.textContent = 'Редактор карты';
      dom.editorSubtitle.textContent = 'Добавляйте узлы, перемещайте их и связывайте ребрами.';
      dom.mapStatus.textContent = 'Нет активной карты';
      dom.shareOutput.value = '';
    }
  }

  function duplicateMap() {
    const map = getCurrentMap();
    if (!map) return;
    const clone = utils.clone(map);
    clone.id = utils.randomId('map');
    clone.title = `${map.title} (копия)`;
    clone.publishedAt = null;
    clone.shareLink = '';
    clone.updatedAt = Date.now();
    state.maps.push(clone);
    state.currentMapId = clone.id;
    persistMaps();
    renderMapList();
    loadMap(clone.id);
  }

  function importMap(event) {
    event.preventDefault();
    const raw = dom.importInput.value.trim();
    if (!raw) return;
    let json = null;
    if (raw.includes('share=')) {
      const encoded = raw.split('share=')[1];
      try {
        json = JSON.parse(decodeURIComponent(atob(encoded)));
      } catch (e) {
        json = null;
      }
    } else {
      json = utils.safeJSON(raw);
    }
    if (!json || !json.title) return;
    const imported = {
      ...json,
      id: utils.randomId('map'),
      updatedAt: Date.now(),
      publishedAt: null,
      shareLink: ''
    };
    state.maps.push(imported);
    state.currentMapId = imported.id;
    persistMaps();
    dom.importInput.value = '';
    renderMapList();
    loadMap(imported.id);
  }

  function handleShareLinkOnLoad() {
    if (!window.location.hash.startsWith('#share=')) return;
    const encoded = window.location.hash.replace('#share=', '');
    try {
      const data = JSON.parse(decodeURIComponent(atob(encoded)));
      if (data && data.title) {
        const imported = {
          ...data,
          id: utils.randomId('map'),
          visibility: 'public',
          updatedAt: Date.now(),
          publishedAt: null,
          shareLink: ''
        };
        state.maps.push(imported);
        state.currentMapId = imported.id;
        persistMaps();
        renderMapList();
        loadMap(imported.id);
      }
    } catch (e) {
      console.warn('Не удалось импортировать карту из ссылки');
    }
  }

  function handleCanvasClick(e) {
    const map = getCurrentMap();
    if (!map) return;
    if (e.target.closest('.node')) return;
    if (!dom.canvas.contains(e.target)) return;
    const rect = dom.canvas.getBoundingClientRect();
    map.nodes.push({
      id: utils.randomId('node'),
      label: 'Новый узел',
      tags: [],
      color: '#2563eb',
      x: e.clientX - rect.left - 80,
      y: e.clientY - rect.top - 30
    });
    map.updatedAt = Date.now();
    persistMaps();
    renderNodes();
    renderEdgeSelectors();
    renderMapList();
  }

  function buildSubscriptions() {
    dom.profileForm.addEventListener('submit', handleProfileSubmit);
    dom.resetProfile.addEventListener('click', resetProfile);
    dom.openProfile.addEventListener('click', () => {
      document.getElementById('profilePanel').scrollIntoView({ behavior: 'smooth' });
    });

    dom.mapForm.addEventListener('submit', handleMapSubmit);
    dom.searchInput.addEventListener('input', renderMapList);
    dom.publicOnly.addEventListener('change', renderMapList);
    dom.publishMap.addEventListener('click', publishMap);
    dom.deleteMap.addEventListener('click', deleteMap);
    dom.duplicateMap.addEventListener('click', duplicateMap);

    dom.nodeForm.addEventListener('submit', addNode);
    dom.edgeForm.addEventListener('submit', addEdge);
    dom.centerNodes.addEventListener('click', centerNodes);
    dom.canvas.addEventListener('pointerdown', handleCanvasClick);

    dom.importForm.addEventListener('submit', importMap);
    dom.copyShare.addEventListener('click', copyShare);
    dom.exportMap.addEventListener('click', () => {
      const map = getCurrentMap();
      if (map) exportMapJSON(map);
    });
  }

  function bootstrap() {
    syncProfileForm();
    renderMapList();
    if (state.maps[0]) {
      loadMap(state.maps[0].id);
    }
    handleShareLinkOnLoad();
  }

  buildSubscriptions();
  bootstrap();
})();
