
    // ----- Data -----
    const topTalkers = [
      ["Mabutho", 652],
      ["Mapiwane", 518],
      ["NKO_Gallardo", 362],
      ["Unsaved number", 336],
      ["Nolwazi", 336]
    ];

    const hourCounts = [
      10, 4, 4, 2, 3, 10, 59, 36, 20, 29, 44, 19,
      62, 94, 125, 79, 265, 231, 425, 747, 885, 602, 167, 18
    ];

    const accents = ["#db0a40", "#ffc906", "#2b5cff"];

    // ----- Elements -----
    const slides = [...document.querySelectorAll(".slide")];
    const progress = document.getElementById("prog");
    let current = -1;
    let timer;

    // ----- Build slides -----
    slides.forEach((slide, k) => {
      const accent = accents[k % 3];
      const navy = k % 2 ? "#0a1a4d" : "#12296e";

      slide.style.background = `linear-gradient(160deg, ${navy} 25%, #001033)`;

      slide.insertAdjacentHTML("afterbegin", `
        <div class="blob" style="width:260px;height:260px;right:-80px;top:${10 + k * 7}%;background:${accent}"></div>
        <div class="blob" style="width:180px;height:180px;left:-60px;bottom:8%;background:#fff;animation-delay:-3s"></div>
      `);

      progress.insertAdjacentHTML("beforeend", "<div><i></i></div>");
    });

    // ----- Build top talkers -----
    document.getElementById("top").innerHTML = topTalkers.map(([name, count], k) => `
      <div class="row a">
        <span class="n">${k + 1}</span>
        <div class="bar">
          <i data-w="${count / topTalkers[0][1] * 100}"></i>
          <b>${name}</b>
        </div>
        <span class="v">${count}</span>
      </div>
    `).join("");

    // ----- Build hour chart -----
    const maxHour = Math.max(...hourCounts);

    document.getElementById("hrs").innerHTML = hourCounts.map(count => `
      <i class="${count === maxHour ? "pk" : ""}" data-h="${count / maxHour * 100}"></i>
    `).join("");

    // ----- Animated counter -----
    function countUp(el) {
      const target = +el.dataset.n;
      const start = performance.now();

      function frame(now) {
        const p = Math.min((now - start) / 1400, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    }

    // ----- Go to slide -----
    function go(n) {
      if (n < 0) n = 0;
      if (n >= slides.length) n = slides.length - 1;

      clearTimeout(timer);

      slides.forEach((s, k) => s.classList.toggle("on", k === n));

      [...progress.children].forEach((bar, k) => {
        bar.className = k < n ? "d" : k === n ? "c" : "";
        const fill = bar.firstElementChild;
        fill.style.animation = "none";
        bar.offsetWidth; // restart animation
        fill.style.animation = "";
      });

      const slide = slides[n];

      slide.querySelectorAll("[data-n]").forEach(el => {
        el.textContent = "0";
        setTimeout(() => countUp(el), 300);
      });

      slide.querySelectorAll("[data-w]").forEach(el => {
        el.style.width = "0";
        setTimeout(() => (el.style.width = el.dataset.w + "%"), 500);
      });

      slide.querySelectorAll("[data-h]").forEach((el, k) => {
        el.style.height = "0";
        setTimeout(() => (el.style.height = el.dataset.h + "%"), 400 + k * 30);
      });

      current = n;

      if (n < slides.length - 1) {
        timer = setTimeout(() => go(n + 1), 6000);
      }
    }

    // ----- Controls -----
    document.getElementById("pr").onclick = () => go(current + 1);
    document.getElementById("pl").onclick = () => go(current - 1);

    document.getElementById("again").onclick = (e) => {
      e.stopPropagation();
      go(0);
    };

    addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === " ") go(current + 1);
      if (e.key === "ArrowLeft") go(current - 1);
    });

    go(0);
