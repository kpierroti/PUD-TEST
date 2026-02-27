
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

  function getFiltered() {
    const trackObj = DATA[state.track];
    const qn = normalize(state.q);
    const results = [];

    for (const [areaKey, areaObj] of Object.entries(trackObj.areas)) {
      if (state.area !== "all" && state.area !== areaKey) continue;

      const lanes = (areaObj.lanes || [])
        .map((l) => {
          const steps = (l.steps || []).filter((step) => {
            if (!qn) return true;
            const hay = normalize(step.title + " " + (step.note || ""));
            return hay.includes(qn);
          });
          return { ...l, steps };
        })
        .filter((l) => (l.steps || []).length > 0);

      if (lanes.length > 0) {
        results.push({ areaKey, areaObj, lanes });
      }
    }

    return results;
  }

  function openModal({ title, note, track, area, lane }) {
    $("#mTitle").textContent = title;
    $("#mSub").textContent = note || "Você pode preencher uma descrição completa depois.";
    $("#mTrack").textContent = track;
    $("#mArea").textContent = area;
    $("#mLane").textContent = lane;
    $("#mObs").textContent =
      "Dica: inclua aqui objetivos, carga horária, pré-requisitos, materiais e formato.";

    const dlg = $("#dlg");
    if (typeof dlg.showModal === "function") dlg.showModal();
    else alert(title);
  }

  function render() {
    const trackObj = DATA[state.track];
    $("#headline").textContent = trackObj.label;
    $("#subline").textContent = trackObj.description;

    const content = $("#content");
    content.innerHTML = "";

    const filtered = getFiltered();
    $("#empty").hidden = filtered.length !== 0;

    filtered.forEach(({ areaKey, areaObj, lanes }) => {
      const card = document.createElement("article");
      card.className = `areaCard ${areaObj.accentClass || ""}`;

      // define a variável --accent por card
      const accent =
        areaKey === "audiovisual"
          ? "var(--cyan)"
          : areaKey === "design"
          ? "var(--pink)"
          : "var(--orange)";
      card.style.setProperty("--accent", accent);

      const laneCount = lanes.length;
      const stepCount = lanes.reduce((acc, l) => acc + (l.steps?.length || 0), 0);

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
              <span class="tag">${AREA_LABEL[areaKey]}</span>
              <span class="tag">Etapa ${i + 1}</span>
            </div>
            <h4>${step.title}</h4>
            <p>${step.note || "Clique para ver detalhes e editar descrições."}</p>
          `;
          el.addEventListener("click", () =>
            openModal({
              title: step.title,
              note: step.note,
              track: trackObj.label,
              area: AREA_LABEL[areaKey],
              lane: lane.label
            })
          );
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

    $("#q").addEventListener("input", (e) => {
      state.q = e.target.value || "";
      render();
    });

    $("#area").addEventListener("change", (e) => {
      state.area = e.target.value;
      render();
    });

    $("#closeBtn").addEventListener("click", () => $("#dlg").close());
    $("#dlg").addEventListener("click", (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.bottom &&
        rect.left <= e.clientX &&
        e.clientX <= rect.right;
      if (!inDialog) e.currentTarget.close();
    });

    $("#copyBtn").addEventListener("click", async () => {
      const text = $("#mTitle").textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        $("#copyBtn").textContent = "Copiado";
        setTimeout(() => ($("#copyBtn").textContent = "Copiar nome do curso"), 1200);
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

  // init
  bindEvents();
  render();
})();