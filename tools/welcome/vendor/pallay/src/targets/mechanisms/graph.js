(function () {
  document.querySelectorAll('time[data-unix]').forEach(function (time) { var unix = Number(time.getAttribute('data-unix')); if (unix > 0) time.textContent = new Date(unix * 1000).toLocaleString('en-GB', {hour12:false}); });
  var tableFilter = document.querySelector('[data-filter-table]');
  if (tableFilter) {
    tableFilter.addEventListener('input', function () {
      var query = tableFilter.value.trim().toLowerCase();
      document.querySelectorAll('[data-table] tbody tr').forEach(function (row) { row.hidden = query !== '' && row.textContent.toLowerCase().indexOf(query) < 0; });
    });
  }
  var config = window.PallayDocument.plan.graphs[0];
  if (!config) return;
  var dataNode = document.getElementById(config.dataId);
  if (!dataNode) return;
  var data = JSON.parse(dataNode.textContent);
  var nodes = data.nodes, plan = data.plan, groups = plan.groups, run = data.run;
  var outcomes = run ? run.outcomes : {};
  var viewing = '';
  var runViewRevision = 0;
  var NW = config.nodeWidth, NH = config.nodeHeight, GAP_X = 32, GAP_Y = 18, PAD = config.groupPadding, HEAD = config.groupHeader, STATUSES = Object.keys(data.states);
  var LABELS = Object.fromEntries(STATUSES.map(function(key){return [key,data.states[key].label];}));
  var canvas = document.querySelector('.canvas'), svg = canvas.querySelector('svg'), viewport = svg.querySelector('#viewport');
  var drawer = document.querySelector('.drawer'), listBody = document.querySelector('[data-list-body]');
  var nodeIds = Object.keys(nodes);

  // ---- Derived structure ----
  function outcomeOf(id) { return data.states[outcomes[id]] ? outcomes[id] : 'none'; }
  function ancestors(group) { var out = []; var hops = 0; while (group && groups[group] && hops < 64) { out.push(group); group = groups[group].parent; hops++; } return out; }
  var membersOf = {};
  Object.keys(groups).forEach(function (g) { membersOf[g] = []; });
  nodeIds.forEach(function (id) { ancestors(nodes[id].group).forEach(function (g) { membersOf[g].push(id); }); });
  var parentsOf = {}, childrenOf = {};
  nodeIds.forEach(function (id) { parentsOf[id] = []; childrenOf[id] = []; });
  plan.edges.forEach(function (edge) { if (childrenOf[edge[0]] && parentsOf[edge[1]]) { childrenOf[edge[0]].push(edge[1]); parentsOf[edge[1]].push(edge[0]); } });
  function reach(start, next, depth) {
    var seen = {}; var frontier = [start]; var level = 0;
    while (frontier.length && (depth === 0 || level < depth)) {
      var following = [];
      frontier.forEach(function (id) { (next[id] || []).forEach(function (other) { if (!seen[other]) { seen[other] = true; following.push(other); } }); });
      frontier = following; level++;
    }
    return seen;
  }

  // ---- State ----
  var state = { view: 'graph', expanded: {}, focus: null, focusSet: null, query: '', matchesOnly: false, hidden: {}, selected: null };
  var bigGraph = nodeIds.length > 40;
  var hasChildGroups = {};
  Object.keys(groups).forEach(function (g) { if (groups[g].parent) hasChildGroups[groups[g].parent] = true; });
  Object.keys(groups).forEach(function (g) { state.expanded[g] = !bigGraph || !!hasChildGroups[g]; });
  function visibleNode(id) {
    if (state.hidden[outcomeOf(id)]) return false;
    if (state.focusSet && !state.focusSet[id]) return false;
    if (state.matchesOnly && state.query !== '' && !matches(id)) return false;
    return true;
  }
  var haystack = {};
  nodeIds.forEach(function (id) { var n = nodes[id]; haystack[id] = (id + ' ' + n.operator + ' ' + n.kind + ' ' + (n.group || '') + ' ' + LABELS[outcomeOf(id)]).toLowerCase(); });
  function matches(id) { return state.query !== '' && state.query.split(/\s+/).every(function (word) { return haystack[id].indexOf(word) >= 0; }); }
  function matchingIds() { return state.query === '' ? [] : nodeIds.filter(matches); }
  function applyFocus() {
    if (!state.focus) { state.focusSet = null; return; }
    var f = state.focus, set = {};
    set[f.node] = true;
    if (f.direction === 'upstream' || f.direction === 'both') Object.keys(reach(f.node, parentsOf, f.depth)).forEach(function (id) { set[id] = true; });
    if (f.direction === 'downstream' || f.direction === 'both') Object.keys(reach(f.node, childrenOf, f.depth)).forEach(function (id) { set[id] = true; });
    state.focusSet = set;
    Object.keys(set).forEach(function (id) { ancestors(nodes[id].group).forEach(function (g) { state.expanded[g] = true; }); });
  }
  function groupOpen(g) { return ancestors(g).every(function (a) { return state.expanded[a]; }); }
  function representative(id) {
    if (!visibleNode(id)) return null;
    var chain = ancestors(nodes[id].group);
    for (var i = chain.length - 1; i >= 0; i--) { if (!state.expanded[chain[i]]) return 'group:' + chain[i]; }
    return id;
  }
  function counts(ids) { var out = {}; STATUSES.forEach(function (s) { out[s] = 0; }); ids.forEach(function (id) { out[outcomeOf(id)]++; }); return out; }
  function visibleMembers(g) { return membersOf[g].filter(visibleNode); }

  // ---- Measuring: sizes from the plan, for what is visible and expanded ----
  var compact = {};
  function measure(container) {
    var columns = (plan.containers[container] || []).map(function (column) {
      return column.filter(function (item) {
        if (item.indexOf('group:') === 0) return visibleMembers(item.slice(6)).length > 0;
        return visibleNode(item);
      });
    }).filter(function (column) { return column.length > 0; });
    var boxes = {}, colWidths = [], colHeights = [];
    columns.forEach(function (column, c) {
      var width = 0, height = 0, crowded = column.length > 14;
      column.forEach(function (item, i) {
        var box;
        if (item.indexOf('group:') === 0 && state.expanded[item.slice(6)]) { var inner = measure(item.slice(6)); box = { w: Math.max(config.groupMinWidth, inner.w + 2 * PAD), h: inner.h + 2 * PAD + HEAD, inner: inner }; }
        else { box = crowded ? { w: 168, h: 30 } : { w: NW, h: NH }; compact[item] = crowded; }
        boxes[item] = box; width = Math.max(width, box.w); height += box.h + (i > 0 ? (compact[item] ? 6 : GAP_Y) : 0);
      });
      colWidths.push(width); colHeights.push(height);
    });
    var total = Math.max.apply(null, colHeights.concat([0]));
    var x = 0, places = {};
    columns.forEach(function (column, c) {
      var y = (total - colHeights[c]) / 2;
      column.forEach(function (item) { var box = boxes[item]; places[item] = { x: x, y: y, w: box.w, h: box.h, inner: box.inner }; y += box.h + (compact[item] ? 6 : GAP_Y); });
      x += colWidths[c] + GAP_X;
    });
    return { w: Math.max(0, x - GAP_X), h: total, places: places };
  }
  var positions = {};
  function place(layout, ox, oy) {
    Object.keys(layout.places).forEach(function (item) {
      var p = layout.places[item];
      positions[item] = { x: ox + p.x, y: oy + p.y, w: p.w, h: p.h };
      if (p.inner) place(p.inner, ox + p.x + (p.w - p.inner.w) / 2, oy + p.y + PAD + HEAD);
    });
  }

  // ---- Drawing ----
  function esc(text) { return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function clip(text, limit) { return text.length <= limit ? text : text.slice(0, limit - 1) + '…'; }
  function taskName(id) { var parts=id.split('.'); return parts.length>1 && groups[parts[0]] ? parts.slice(1).join('.') : id; }
  function shortName(id, group) { return group && id.indexOf(group + '.') === 0 ? id.slice(group.length + 1) : id; }
  function glyph(node) { if (node.kind === 'native') return 'G'; if (node.kind === 'lambda') return 'λ'; if (node.kind === 'expression') return node.skip_kind === 'short_circuit' ? '⏻' : '⑂'; if (node.kind === 'dbt') return 'dbt'; if (node.kind === 'no_op') return '○'; return '•'; }
  function bar(ids, x, y, w) {
    var c = counts(ids), total = ids.length || 1, out = '<g class="bar">', at = x;
    STATUSES.forEach(function (s) { if (!c[s]) return; var width = w * c[s] / total; out += '<rect class="' + s + '" x="' + at + '" y="' + y + '" width="' + width + '" height="4" rx="2"/>'; at += width; });
    return out + '</g>';
  }
  function curve(a, b) {
    var x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2, reach = Math.max(36, (x2 - x1) / 2);
    return 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + reach) + ' ' + y1 + ', ' + (x2 - reach) + ' ' + y2 + ', ' + x2 + ' ' + y2;
  }
  var extent = { w: 0, h: 0 };
  function draw() {
    positions = {}; compact = {};
    var layout = measure('');
    place(layout, 0, 0);
    extent = { w: layout.w, h: layout.h };
    var out = '';
    // Expanded groups first (background), deepest last so inner boxes draw over outer ones.
    var expandedGroups = Object.keys(groups).filter(function (g) { return positions['group:' + g] && state.expanded[g]; }).sort(function (a, b) { return ancestors(a).length - ancestors(b).length; });
    expandedGroups.forEach(function (g) {
      var p = positions['group:' + g], members = visibleMembers(g), c = counts(members);
      out += '<g class="group expanded" data-group="' + esc(g) + '"><rect class="box" x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" rx="12"/>';
      out += '<text class="chev" x="' + (p.x + 12) + '" y="' + (p.y + 17) + '">▾</text><text class="label" x="' + (p.x + 26) + '" y="' + (p.y + 17) + '">' + esc(clip(g, 40)) + '</text>';
      var summary = members.length + ' steps' + (c.failed ? ' · ' + c.failed + ' failed' : '') + (c.skipped ? ' · ' + c.skipped + ' skipped' : '');
      if (clip(g, 40).length * 7.2 + summary.length * 6 + 50 < p.w) out += '<text class="counts" x="' + (p.x + p.w - 10) + '" y="' + (p.y + 17) + '" text-anchor="end">' + esc(summary) + '</text>';
      out += '</g>';
    });
    // Edges between visible representatives, deduplicated.
    var seen = {}, edges = '';
    plan.edges.forEach(function (edge) {
      var a = representative(edge[0]), b = representative(edge[1]);
      if (!a || !b || a === b) return;
      var key = a + '→' + b; if (seen[key]) return; seen[key] = true;
      var pa = positions[a], pb = positions[b]; if (!pa || !pb) return;
      var cls = 'edge'; if (b.indexOf('group:') < 0 && outcomeOf(b) === 'skipped') cls += ' edge-skipped';
      if (state.focusSet && a.indexOf('group:') < 0 && b.indexOf('group:') < 0) cls += ' edge-focus';
      edges += '<path class="' + cls + '" d="' + curve(pa, pb) + '" marker-end="url(#arrow)"/>';
    });
    out += edges;
    // Collapsed groups as cards.
    Object.keys(groups).forEach(function (g) {
      var p = positions['group:' + g]; if (!p || state.expanded[g]) return;
      var members = visibleMembers(g), c = counts(members);
      var sub = members.length + ' steps' + (c.failed ? ', ' + c.failed + ' failed' : '') + (c.skipped ? ', ' + c.skipped + ' skipped' : '');
      out += '<g class="group collapsed' + (compact['group:' + g] ? ' compact' : '') + '" data-group="' + esc(g) + '" tabindex="0" role="button" aria-label="' + esc(g) + ', ' + esc(sub) + '"><rect class="card" x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" rx="' + (compact['group:' + g] ? 7 : 10) + '"/>';
      if (compact['group:' + g]) {
        out += '<text class="chev" x="' + (p.x + 9) + '" y="' + (p.y + 20) + '">▸</text><text class="title" x="' + (p.x + 22) + '" y="' + (p.y + 19) + '">' + esc(clip(shortName(g, groups[g].parent), 18)) + '</text>' + bar(members, p.x + p.w - 46, p.y + 13, 36) + '<title>' + esc(g) + ': ' + esc(sub) + '</title></g>';
      } else {
        out += '<text class="chev" x="' + (p.x + 12) + '" y="' + (p.y + 23) + '">▸</text><text class="title" x="' + (p.x + 26) + '" y="' + (p.y + 22) + '">' + esc(clip(shortName(g, groups[g].parent), 24)) + '</text><text class="subtitle" x="' + (p.x + 26) + '" y="' + (p.y + 38) + '">' + esc(sub) + '</text>';
        out += bar(members, p.x + 26, p.y + 44, p.w - 38) + '</g>';
      }
    });
    // Nodes.
    nodeIds.forEach(function (id) {
      var p = positions[id]; if (!p) return;
      var node = nodes[id], status = outcomeOf(id), cls = 'node kind-' + node.kind + ' status-' + status;
      if (state.selected === id) cls += ' selected';
      if (state.query !== '') cls += matches(id) ? ' hit' : ' dim';
      out += '<g class="' + esc(cls) + '" data-node="' + esc(id) + '" tabindex="0" role="button" aria-pressed="' + String(state.selected === id) + '" aria-label="' + esc(id) + ', ' + esc(LABELS[status]) + '">';
      var symbol = (data.states[status] || data.states.none).glyph;
      if (compact[id]) {
        out += '<rect class="card" x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" rx="4"/>';
        out += '<text class="title" x="' + (p.x + 9) + '" y="' + (p.y + 19) + '">' + esc(symbol + ' ' + clip(taskName(id),23)) + '</text><title>' + esc(id + ': ' + LABELS[status]) + '</title></g>';
      } else {
        out += '<rect class="card" x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" rx="4"/>';
        out += '<text class="title" x="' + (p.x + 10) + '" y="' + (p.y + 20) + '">' + esc(clip(taskName(id),27)) + '</text>';
        out += '<text class="subtitle state-label" x="' + (p.x + 10) + '" y="' + (p.y + 41) + '">' + esc(symbol + ' ' + LABELS[status]) + '</text>';
        out += '<text class="subtitle operator-label" x="' + (p.x + p.w - 10) + '" y="' + (p.y + 41) + '" text-anchor="end">' + esc(clip(node.operator.replace(/Operator$/, ''),13)) + '</text><title>' + esc(id + ': ' + LABELS[status]) + '</title></g>';

      }
    });
    viewport.innerHTML = out;
    apply();
    drawList();
    drawChips();
  }

  // ---- Pan and zoom ----
  var scale = 1, tx = 0, ty = 0;
  function apply() { viewport.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + scale + ')'); }
  function zoomBy(factor){var box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;var next=Math.max(.08,Math.min(3,scale*factor));tx=box.width/2-(box.width/2-tx)*(next/scale);ty=box.height/2-(box.height/2-ty)*(next/scale);scale=next;apply();}
  function fit() {
    var box = canvas.getBoundingClientRect();
    if (extent.w === 0 || extent.h === 0) { scale = 1; tx = 20; ty = 20; apply(); return; }
    scale = Math.min(1, (box.width - 48) / extent.w, (box.height - 48) / extent.h);
    tx = (box.width - extent.w * scale) / 2; ty = (box.height - extent.h * scale) / 2; apply();
  }
  canvas.addEventListener('wheel', function (event) {
    event.preventDefault();
    var box = canvas.getBoundingClientRect(), px = event.clientX - box.left, py = event.clientY - box.top;
    var next = Math.max(0.15, Math.min(3, scale * (event.deltaY < 0 ? 1.1 : 0.9)));
    tx = px - (px - tx) * (next / scale); ty = py - (py - ty) * (next / scale); scale = next; apply();
  }, { passive: false });
  var drag = null, moved = false, pressed = null;
  canvas.addEventListener('pointerdown', function (event) { if (event.target.closest('.tools')) return; pressed = event.target.closest('.node, .group'); drag = { x: event.clientX - tx, y: event.clientY - ty }; moved = false; canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove', function (event) { if (!drag) return; var nx = event.clientX - drag.x, ny = event.clientY - drag.y; if (Math.abs(nx - tx) + Math.abs(ny - ty) > 2) moved = true; tx = nx; ty = ny; apply(); });
  canvas.addEventListener('pointerup', function () { drag = null; });
  // Pointer capture retargets the click to the canvas, so the element under the pointer at pointerdown is the hit.
  canvas.addEventListener('click', function (event) {
    var control=event.target.closest('[data-graph-zoom]');if(control){var action=control.getAttribute('data-graph-zoom');if(action==='fit')fit();else if(action==='in'||action==='out')zoomBy(action==='out'?.85:1.15);return;}
    var hit = pressed || event.target.closest('.node, .group'); pressed = null;
    if (moved) return;
    if (!hit) { if(config.clearCanvas)clearTask(); return; }
    if (hit.hasAttribute('data-node')) { var id = hit.getAttribute('data-node'); if (config.toggleSelection && state.selected === id) clearTask(); else select(id); return; }
    toggle(hit.getAttribute('data-group'));
  });
  canvas.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var card = event.target.closest('.node'); if (card) { event.preventDefault(); var id=card.getAttribute('data-node');if(config.toggleSelection&&state.selected===id)clearTask();else select(id);return; }
    var group = event.target.closest('.group'); if (group) { event.preventDefault(); toggle(group.getAttribute('data-group')); }
  });
  function toggle(g) { state.expanded[g] = !state.expanded[g]; draw(); }
  var peek = document.querySelector('.peek');
  function peekHtml(target) {
    if (target.hasAttribute('data-node')) {
      var id = target.getAttribute('data-node'), node = nodes[id], status = outcomeOf(id);
      return '<strong>' + esc(id) + '</strong><div class="peek-row"><span class="dot ' + status + '"></span>' + esc(LABELS[status]) + '</div><div class="peek-row">' + esc(node.operator) + (node.module ? ' <span class="muted">' + esc(node.module) + '</span>' : '') + '</div><div class="peek-row muted">' + (node.group ? 'in ' + esc(node.group) + ' · ' : '') + esc(node.join_policy) + '</div>';
    }
    var g = target.getAttribute('data-group'), members = visibleMembers(g), c = counts(members), parts = [];
    STATUSES.forEach(function (s) { if (c[s]) parts.push(c[s] + ' ' + LABELS[s]); });
    return '<strong>' + esc(g) + '</strong><div class="peek-row">' + members.length + ' nodes</div><div class="peek-row muted">' + esc(parts.join(' · ')) + '</div><div class="peek-row muted">' + (state.expanded[g] ? 'click to collapse' : 'click to expand') + '</div>';
  }
  function placePeek(event) {
    var box = canvas.getBoundingClientRect(), x = event.clientX - box.left + 14, y = event.clientY - box.top + 14;
    if (x + peek.offsetWidth > box.width - 8) x = event.clientX - box.left - peek.offsetWidth - 14;
    if (y + peek.offsetHeight > box.height - 8) y = event.clientY - box.top - peek.offsetHeight - 14;
    peek.style.left = Math.max(4, x) + 'px'; peek.style.top = Math.max(4, y) + 'px';
  }
  canvas.addEventListener('pointerover', function (event) {
    var target = event.target.closest('.node, .group.collapsed, .group.expanded .box'); if (!target || drag) { return; }
    var holder = target.closest('.node, .group'); peek.innerHTML = peekHtml(holder); peek.hidden = false; placePeek(event);
  });
  canvas.addEventListener('pointermove', function (event) { if (!peek.hidden) placePeek(event); });
  canvas.addEventListener('pointerout', function (event) { var target = event.target.closest('.node, .group'); if (target && !(event.relatedTarget && target.contains(event.relatedTarget))) peek.hidden = true; });
  canvas.addEventListener('pointerdown', function () { peek.hidden = true; });

  canvas.addEventListener('focusin',function(event){var target=event.target.closest('.node,.group');if(!target)return;peek.innerHTML=peekHtml(target);peek.hidden=false;var r=target.getBoundingClientRect();placePeek({clientX:r.right,clientY:r.top});});
  canvas.addEventListener('focusout',function(){peek.hidden=true;});
  canvas.addEventListener('keydown',function(event){if(event.key==='Escape')peek.hidden=true;});

  // ---- List view ----
  function drawList() {
    if (!listBody) return;
    var rows = '';
    function walk(container, depth) {
      (plan.containers[container] || []).forEach(function (column) {
        column.forEach(function (item) {
          if (item.indexOf('group:') === 0) {
            var g = item.slice(6), members = visibleMembers(g); if (!members.length) return;
            var c = counts(members), summary = members.length + ' steps' + (c.failed ? ' · ' + c.failed + ' failed' : '') + (c.upstream_failed ? ' · ' + c.upstream_failed + ' upstream failed' : '') + (c.skipped ? ' · ' + c.skipped + ' skipped' : '') + (c.succeeded ? ' · ' + c.succeeded + ' succeeded' : '');
            rows += '<tr class="group-row' + (state.expanded[g] ? '' : ' collapsed') + '" data-group="' + esc(g) + '"><td colspan="4" style="padding-left:' + (12 + depth * 18) + 'px"><span class="chev">▾</span>' + esc(shortName(g, groups[g].parent)) + '<span class="counts">' + esc(summary) + '</span></td></tr>';
            if (state.expanded[g]) walk(g, depth + 1);
          } else {
            if (!visibleNode(item)) return;
            var node = nodes[item], status = outcomeOf(item), cls = 'node-row' + (state.selected === item ? ' selected' : '') + (state.query !== '' && !matches(item) ? ' dim' : '');
            rows += '<tr class="' + cls + '" data-node="' + esc(item) + '"><td style="padding-left:' + (12 + depth * 18) + 'px"><span class="dot ' + status + '"></span><span class="name">' + esc(shortName(item, node.group)) + '</span></td><td class="op">' + esc(node.operator) + '</td><td class="op">' + esc(node.join_policy) + '</td><td>' + esc(LABELS[status]) + '</td></tr>';
          }
        });
      });
    }
    walk('', 0);
    listBody.innerHTML = rows || '<tr><td colspan="4" class="empty">Nothing matches the current filters.</td></tr>';
  }
  document.querySelector('.list').addEventListener('click', function (event) {
    var row = event.target.closest('tr'); if (!row) return;
    if (row.hasAttribute('data-group')) { toggle(row.getAttribute('data-group')); return; }
    if (row.hasAttribute('data-node')) { var id=row.getAttribute('data-node'); if(config.toggleSelection&&state.selected===id) clearTask(); else select(id); }
  });

  // ---- Toolbar ----
  function drawChips() {
    var holder = document.querySelector('[data-status-chips]'); if (!holder) return;
    var c = counts(nodeIds), out = '';
    STATUSES.forEach(function (s) { if (!c[s]) return; out += '<button class="chip ' + s + (state.hidden[s] ? ' off' : '') + '" data-status="' + s + '" aria-pressed="' + !state.hidden[s] + '"><i></i>' + LABELS[s] + ' <b>' + c[s] + '</b></button>'; });
    holder.innerHTML = out;
  }
  document.querySelector('.toolbar').addEventListener('click', function (event) {
    var chip = event.target.closest('[data-status]'); if (chip) { var s = chip.getAttribute('data-status'); state.hidden[s] = !state.hidden[s]; draw(); fit(); return; }
    var view = event.target.closest('[data-view]'); if (view) { setView(view.getAttribute('data-view')); return; }
    if (event.target.closest('[data-expand-all]')) { Object.keys(groups).forEach(function (g) { state.expanded[g] = true; }); draw(); fit(); return; }
    if (event.target.closest('[data-collapse-all]')) { Object.keys(groups).forEach(function (g) { state.expanded[g] = false; }); draw(); fit(); return; }
    if (event.target.closest('[data-fit]')) { fit(); return; }
    if (event.target.closest('[data-focus-clear]')) { setFocus(null); return; }
    if (event.target.closest('[data-readability]')) { document.querySelector('[data-readability]').hidden = true; setView('graph'); return; }
    if (event.target.closest('[data-matches-only]')) { state.matchesOnly = !state.matchesOnly; document.querySelector('[data-matches-only]').classList.toggle('active', state.matchesOnly); draw(); fit(); }
  });
  function setFocus(focus) {
    state.focus = focus; applyFocus();
    var note = document.querySelector('[data-focus-note]'), clear = document.querySelector('[data-focus-clear]');
    if (focus) { note.textContent = 'Focused on ' + focus.node + ' · ' + focus.direction + ', ' + (focus.depth === 0 ? 'all levels' : focus.depth + ' level' + (focus.depth > 1 ? 's' : '')); note.hidden = false; clear.hidden = false; }
    else { note.hidden = true; clear.hidden = true; }
    drawer.querySelectorAll('[data-direction]').forEach(function (b) { b.classList.toggle('active', (focus ? focus.direction : 'all') === b.getAttribute('data-direction')); });
    draw(); fit();
  }
  function setView(view) {
    state.view = view;
    document.querySelectorAll('[data-view]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-view') === view); b.setAttribute('aria-selected', String(b.getAttribute('data-view') === view)); });
    document.querySelectorAll('[data-pane="graph"], [data-pane="list"], [data-pane="code"]').forEach(function (pane) { pane.hidden = pane.getAttribute('data-pane') !== view; });
    if (view === 'graph') fit();
    if (view === 'code' && state.selected) document.querySelector('[data-definition-task="'+CSS.escape(state.selected)+'"]')?.scrollIntoView({block:'nearest'});
  }
  var search = document.querySelector('[data-search]'), searchTimer = null, searchCount = document.querySelector('[data-search-count]');
  function runSearch() {
    state.query = search.value.trim().toLowerCase();
    var found = matchingIds();
    found.forEach(function (id) { ancestors(nodes[id].group).forEach(function (g) { state.expanded[g] = true; }); });
    searchCount.textContent = state.query === '' ? '' : found.length + ' of ' + nodeIds.length;
    document.querySelector('[data-matches-only]').hidden = state.query === '';
    draw();
    if (state.matchesOnly) fit();
  }
  search.addEventListener('input', function () { clearTimeout(searchTimer); searchTimer = setTimeout(runSearch, 120); });
  search.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { search.value = ''; runSearch(); return; }
    if (event.key !== 'Enter') return;
    var found = matchingIds(); if (!found.length) return;
    var current = found.indexOf(state.selected), next = found[(current + 1) % found.length];
    select(next); center(next);
  });
  function center(id) {
    var p = positions[id]; if (!p || state.view !== 'graph') return;
    var box = canvas.getBoundingClientRect();
    scale = Math.max(scale, 0.8); tx = box.width / 2 - (p.x + p.w / 2) * scale; ty = box.height / 2 - (p.y + p.h / 2) * scale; apply();
  }

  // Application inspection is rendered by the declared Incan port, not by this graph mechanism.
  function text(selector, value) { var element=drawer.querySelector(selector);if(element)element.textContent=value; }
  function runName() { return viewing || (run && run.execution_arn ? run.execution_arn.split(':').pop() : ''); }
  function emitSelection(){document.dispatchEvent(new CustomEvent(config.selectionEvent,{detail:{run:runName(),task:state.selected||''}}));}
  function syncSelection(){
    var node=nodes[state.selected];
    text('[data-title]',node?node.id:data.workflow.id);text('[data-operator]',node?node.operator:'Workflow');
    drawer.querySelector('[data-directions]').hidden=!node;
    svg.querySelectorAll('.node').forEach(function(el){var selected=el.getAttribute('data-node')===state.selected;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));});
    listBody.querySelectorAll('tr[data-node]').forEach(function(el){el.classList.toggle('selected',el.getAttribute('data-node')===state.selected);});
    document.querySelectorAll('[data-definition-task]').forEach(function(el){el.classList.toggle('selected',el.getAttribute('data-definition-task')===state.selected);});
    if(state.view==='code'&&state.selected)document.querySelector('[data-definition-task="'+CSS.escape(state.selected)+'"]')?.scrollIntoView({block:'nearest'});
    var params=new URLSearchParams(location.hash.slice(1));
    if(state.selected)params.set('node',state.selected);else ['node','dir','depth'].forEach(function(k){params.delete(k);});
    if(runName())params.set('run',runName());
    history.replaceState(null,'','#'+params.toString());emitSelection();
  }
  function clearTask(){state.selected=null;setFocus(null);syncSelection();draw();}
  function showWorkflow(){clearTask();drawer.classList.add('open');}
  function select(id){if(!nodes[id])return;state.selected=id;syncSelection();drawer.classList.add('open');}
  var pollTimer, awaitingUntil=0;
  function viewRun(name, settled){
    clearTimeout(pollTimer);
    var request=++runViewRevision;viewing=name;
    fetch(config.status+'?'+new URLSearchParams({workflow:data.workflow.id,run:name})).then(function(r){if(!r.ok)throw Error('Execution unavailable');return r.json();}).then(function(status){
      if(request!==runViewRevision)return;
      run=status;outcomes=status.outcomes||{};
      nodeIds.forEach(function(id){var n=nodes[id];haystack[id]=(id+' '+n.operator+' '+n.kind+' '+(n.group||'')+' '+LABELS[outcomeOf(id)]).toLowerCase();});
      draw();syncSelection();
      clearTimeout(pollTimer);if(config.runningStates.includes(status.status)||(config.unavailableStates.includes(status.status)&&Date.now()<awaitingUntil))pollTimer=setTimeout(function(){viewRun(name,false);},1500);else if(!settled)pollTimer=setTimeout(function(){viewRun(name,true);},config.settleDelay);
    }).catch(function(error){drawer.setAttribute('data-pallay-error',error.message);});
  }
  drawer.querySelector('[data-close]').addEventListener('click', clearTask);
  drawer.querySelector('[data-directions]').addEventListener('click', function (event) {
    var button = event.target.closest('[data-direction]'); if (!button || !state.selected) return;
    var direction = button.getAttribute('data-direction');
    if (direction === 'all') { setFocus(null); return; }
    setFocus({ node: state.selected, direction: direction, depth: Number(drawer.querySelector('[data-depth]').value) });
  });
  drawer.querySelector('[data-depth]').addEventListener('change', function () { if (state.focus) setFocus({ node: state.focus.node, direction: state.focus.direction, depth: Number(drawer.querySelector('[data-depth]').value) }); });
  document.querySelector('[data-workflow-details]').addEventListener('click', showWorkflow);
  window.addEventListener('resize', function () { if (state.view === 'graph') fit(); });

  // ---- Start ----
  function hashParams() { var out = {}; location.hash.replace(/^#/, '').split('&').forEach(function (pair) { var at = pair.indexOf('='); if (at > 0) out[pair.slice(0, at)] = decodeURIComponent(pair.slice(at + 1)); }); return out; }
  function applyHash(initial) {
    var params = hashParams();
    if (params.view === 'list' || params.view === 'graph' || params.view === 'code') setView(params.view);
    if (params.node && nodes[params.node]) {
      ancestors(nodes[params.node].group).forEach(function (g) { state.expanded[g] = true; });
      draw(); select(params.node);
      if (params.dir && params.dir !== 'all') { drawer.querySelector('[data-depth]').value = String(Number(params.depth || 0)); setFocus({ node: params.node, direction: params.dir, depth: Number(params.depth || 0) }); }
    } else if (initial && window.innerWidth > 1000) showWorkflow();
    if (params.run && params.run !== viewing) viewRun(params.run);
  }
  draw();
  setView(state.view);
  applyHash(true);
  fit();
  var params0 = hashParams();
  if (bigGraph && !params0.view && !params0.node && state.view === 'graph' && scale * 12.5 < 9) { setView('list'); document.querySelector('[data-readability]').hidden = false; }
  window.addEventListener('hashchange', function () { applyHash(false); });
  document.addEventListener(config.inspectEvent, function (event) {
    var target = event.detail || {};
    if (target.task !== undefined) { if (target.task && nodes[target.task]) select(target.task); else clearTask(); }
    if (target.run && target.run !== runName()) viewRun(target.run);
  });
  document.addEventListener('pallay:command-complete',function(event){var target=event.detail?.arguments?.[config.commandRunArgument]||'';awaitingUntil=Date.now()+config.startupTimeout;clearTimeout(pollTimer);pollTimer=setTimeout(function(){viewRun(target);},config.commandDelay);});
  emitSelection();
  document.querySelector('[data-pane="code"]').addEventListener('click',function(event){var button=event.target.closest('[data-code-task]');if(button)select(button.getAttribute('data-code-task'));});
  window.addEventListener('keydown',function(event){if(state.view !== 'graph' || event.ctrlKey || event.metaKey || event.altKey || event.isComposing || event.target.closest('input,textarea,select,pre,[contenteditable=true]'))return; if(['+','=','-','Add','Subtract'].indexOf(event.key)<0)return;event.preventDefault();zoomBy(event.key==='-'||event.key==='Subtract'?.85:1.15);});
})();
