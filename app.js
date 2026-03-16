(function () {
  const DATA = window.PUD_DATA;
  const AREA_LABEL = window.PUD_AREA_LABEL;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const state = {
    track: "criancas",
    area: "all",
    q: ""
  };

  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function safeText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value || "—";
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-");
    if (!y || !m || !d) return dateStr;
    return `${d}/${m}/${y}`;
  }

  function getAccent(areaKey) {
    if (areaKey === "audiovisual") return "var(--cyan)";
    if (areaKey === "design") return "var(--pink)";
    if (areaKey === "prog") return "var(--orange)";
    if (areaKey === "eco") return "var(--violet, var(--pink))";
    return "var(--amber, var(--orange))";
  }

  function getFiltered() {
    const trackObj = DATA[state.track];
    const qn = normalize(state.q);
    const results = [];

    for (const [areaKey, areaObj] of Object.entries(trackObj.areas || {})) {
      if (state.area !== "all" && state.area !== areaKey) continue;

      const lanes = (areaObj.lanes || [])
        .map((lane) => {
          const steps = (lane.steps || []).filter((step) => {
            if (!qn) return true;

            const hay = normalize([
              step.title,
              step.note,
              lane.label,
              areaObj.label,
              ...(step.meta?.conteudo_programatico || []),
              ...(step.meta?.objetivos || [])
            ].join(" "));

            return hay.includes(qn);
          });

          return { ...lane, steps };
        })
        .filter((lane) => lane.steps.length > 0);

      if (lanes.length > 0) {
        results.push({ areaKey, areaObj, lanes });
      }
    }

    return results;
  }

  function closeDialogSafe(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === "function") dlg.close();
    else dlg.removeAttribute("open");
  }

  function showDialogSafe(dlg) {
    if (!dlg) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "open");
  }

  function buildEmenta(meta) {
    const content = $("#ementaContent");
    if (!content) return;

    const linhas = meta?.conteudo_programatico || [];
    content.innerHTML = "";

    if (!linhas.length) {
      content.innerHTML = "<p>Ementa não disponível.</p>";
      return;
    }

    linhas.forEach((linha) => {
      const p = document.createElement("p");
      p.textContent = linha;
      content.appendChild(p);
    });
  }

  function openEmenta(step) {
    const meta = step.meta || {};
    safeText("#ementaTitle", `Ementa completa — ${step.title}`);
    buildEmenta(meta);
    showDialogSafe($("#ementaDlg"));
  }

  function setupDescription(step) {
    const desc = $("#mObs");
    const toggleBtn = $("#toggleDesc");
    if (!desc || !toggleBtn) return;

    const text = step.note || "Descrição não disponível.";
    desc.textContent = text;

    const shouldCollapse = text.length > 280;
    desc.classList.toggle("collapsed", shouldCollapse);
    toggleBtn.hidden = !shouldCollapse;
    toggleBtn.textContent = shouldCollapse ? "Ver mais" : "";

    toggleBtn.onclick = function () {
      const isCollapsed = desc.classList.contains("collapsed");
      desc.classList.toggle("collapsed", !isCollapsed);
      toggleBtn.textContent = isCollapsed ? "Ver menos" : "Ver mais";
    };
  }

  function openModal({ step, track, area, lane }) {
    const meta = step.meta || {};

    safeText("#mTitle", step.title);
    safeText("#mTrack", track);
    safeText("#mArea", area);
    safeText("#mLane", lane);
    safeText("#mCarga", meta.carga_horaria || "—");
    safeText(
      "#mDatas",
      meta.data_inicio && meta.data_final
        ? `${formatDate(meta.data_inicio)} → ${formatDate(meta.data_final)}`
        : "—"
    );
    safeText(
      "#mHorario",
      meta.horario_inicio && meta.horario_final
        ? `${meta.horario_inicio} - ${meta.horario_final}`
        : "—"
    );
    safeText("#mFormato", meta.formato || "—");

    setupDescription(step);

    const ementaBtn = $("#ementaBtn");
    if (ementaBtn) {
      ementaBtn.onclick = function () {
        openEmenta(step);
      };
    }

    showDialogSafe($("#dlg"));
  }

  function render() {
    const trackObj = DATA[state.track];
    safeText("#headline", trackObj.label);
    safeText("#subline", trackObj.description);

    const content = $("#content");
    const empty = $("#empty");
    if (!content || !empty) return;

    content.innerHTML = "";

    const filtered = getFiltered();
    empty.hidden = filtered.length !== 0;

    filtered.forEach(({ areaKey, areaObj, lanes }) => {
      const card = document.createElement("article");
      card.className = `areaCard ${areaObj.accentClass || ""}`;

      const accent = getAccent(areaKey);
      card.style.setProperty("--accent", accent);

      const laneCount = lanes.length;
      const stepCount = lanes.reduce((acc, lane) => acc + (lane.steps?.length || 0), 0);

      card.innerHTML = `
        <div class="areaHeader">
          <div class="areaTitle">
            <span class="spark" aria-hidden="true"></span>
            <div style="min-width:0">
              <h3>${areaObj.label}</h3>
              <div class="meta">${laneCount} trilha(s) • ${stepCount} curso(s)</div>
            </div>
          </div>
          <span class="chip">
            <span aria-hidden="true" style="width:8px;height:8px;border-radius:999px;background:var(--accent);display:inline-block"></span>
            ${trackObj.label}
          </span>
        </div>
        <div class="roadmap"></div>
      `;

      const roadmap = $(".roadmap", card);

      lanes.forEach((lane, laneIndex) => {
        const laneBox = document.createElement("div");
        laneBox.className = "lane";
        laneBox.style.marginTop = laneIndex === 0 ? "0" : "12px";

        const header = document.createElement("div");
        header.className = "connector";
        header.innerHTML = `
          <div style="white-space:nowrap;"><strong style="color:var(--text)">${lane.label}</strong></div>
          <div class="line" aria-hidden="true"></div>
          <div style="white-space:nowrap;">sequência sugerida</div>
        `;
        laneBox.appendChild(header);

        const steps = document.createElement("div");
        steps.className = "steps";

        lane.steps.forEach((step, i) => {
          const el = document.createElement("div");
          el.className = "step";
          el.dataset.accent = "1";
          el.style.setProperty("--accent", accent);

          el.innerHTML = `
            <div class="stepTop">
              <span class="tag">${AREA_LABEL[areaKey] || areaObj.label}</span>
              <span class="tag">Etapa ${i + 1}</span>
            </div>
            <h4>${step.title}</h4>
            <p>${step.note || "Clique para ver detalhes."}</p>
          `;

          el.addEventListener("click", () => {
            openModal({
              step,
              track: trackObj.label,
              area: AREA_LABEL[areaKey] || areaObj.label,
              lane: lane.label
            });
          });

          steps.appendChild(el);
        });

        laneBox.appendChild(steps);
        roadmap.appendChild(laneBox);
      });

      content.appendChild(card);
    });
  }

  function setTrack(track) {
    state.track = track;

    $$(".tab").forEach((btn) => {
      const active = btn.dataset.track === track;
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    render();
  }

  function bindEvents() {
    $$(".tab").forEach((btn) => {
      btn.addEventListener("click", () => setTrack(btn.dataset.track));
    });

    $("#q")?.addEventListener("input", (e) => {
      state.q = e.target.value || "";
      render();
    });

    $("#area")?.addEventListener("change", (e) => {
      state.area = e.target.value;
      render();
    });

    $("#closeBtn")?.addEventListener("click", () => closeDialogSafe($("#dlg")));
    $("#closeEmentaBtn")?.addEventListener("click", () => closeDialogSafe($("#ementaDlg")));

    $("#copyBtn")?.addEventListener("click", async () => {
      const text = $("#mTitle")?.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        const btn = $("#copyBtn");
        if (btn) {
          const old = btn.textContent;
          btn.textContent = "Copiado";
          setTimeout(() => {
            btn.textContent = old;
          }, 1200);
        }
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    });
  }

  bindEvents();
  render();
})();
