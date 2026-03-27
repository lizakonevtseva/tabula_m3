document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("introOverlay");
  const introText = document.getElementById("introText");
  const introStartBtn = document.getElementById("introStartBtn");

  // Печатание текста + птичка
  const typingElement = document.getElementById("typingText");
  const birdElement = document.querySelector(".bird1-img");
  const agreementButton = document.getElementById("agreementBtn");
  const agreeOverlay = document.getElementById("agreeOverlay");
  const agreePanel = agreeOverlay?.querySelector(".agree-panel") || null;
  const agreePaperImage = document.getElementById("agreePaperImage");
  const agreeCanvas = document.getElementById("agreeCanvas");
  let agreeCanvasScale = 1;

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setBirdTalkingFrame(isOpenMouth) {
    if (!birdElement) return;

    const currentSrc = birdElement.getAttribute("src") || "";
    const srcBird1 = currentSrc.includes("bird2.png")
      ? currentSrc.replace("bird2.png", "bird1.png")
      : currentSrc;
    const srcBird2 = srcBird1.replace("bird1.png", "bird2.png");

    birdElement.setAttribute("src", isOpenMouth ? srcBird2 : srcBird1);
  }

  function startTypingEffect() {
    if (!typingElement) return;

    const fullText = typingElement.dataset.fullText || "";
    const speedMs = 38;
    const mouthToggleEveryChars = 2;

    let i = 0;
    let openMouth = false;

    if (birdElement) {
      const srcBird1 = birdElement.getAttribute("src") || "";
      const srcBird2 = srcBird1.replace("bird1.png", "bird2.png");
      const preload = new Image();
      preload.src = srcBird2;
    }

    typingElement.innerHTML = "";
    setBirdTalkingFrame(false);

    const intervalId = setInterval(() => {
      i++;

      const typed = fullText.slice(0, i);
      // Перенос строки после ;
      const html = escapeHtml(typed)
        .replaceAll(";", ";<br />")
        .replaceAll(", желание покоя", ",<br />желание покоя");

      typingElement.innerHTML = html;

      if (i % mouthToggleEveryChars === 0) {
        openMouth = !openMouth;
        setBirdTalkingFrame(openMouth);
      }

      if (i >= fullText.length) {
        clearInterval(intervalId);
        setBirdTalkingFrame(false);
      }
    }, speedMs);
  }

  let hasMainTypingStarted = false;
  function startMainTypingOnce() {
    if (hasMainTypingStarted) return;
    hasMainTypingStarted = true;
    startTypingEffect();
  }

  // третий экран
  const memoryImage = document.getElementById("memoryImage");
  const memoryText = document.getElementById("memoryText");
  const memoryNums = Array.from(document.querySelectorAll(".mechanism-num"));

  const recordData = [
    {
      id: 1,
      img: "images/memory1.png",
      alt: "запись 01",
      text: `запись 01
тип: раннее воспоминание
место: закрытая территория /
двор дошкольного учреждения
статус: сохранено

описание:
коллективная игра. пространство организовано
кругом без центра. движение синхронное.
субъект не отделяет себя от группы. время отсутствует. фиксируется ритм и безопасность.`,
    },
    {
      id: 2,
      img: "images/memory2.png",
      alt: "запись 02",
      text: `запись 02
тип: событие утраты
место: открытое пространство /
траурная процессия
статус: сохранено

описание:
перемещение тела. движение медленное, синхронное.
субъект наблюдает со стороны.
фиксируется тяжесть и осознание конечности.`,
    },
    {
      id: 3,
      img: "images/memory3.png",
      alt: "запись 03",
      text: `запись 03
тип: социальный момент
место: жилое помещение / общий стол
статус: сохранено

описание:
совместное присутствие. минимальная дистанция.
фиксируется плотность и кратковременное единство.`,
    },
    {
      id: 4,
      img: "images/memory4.png",
      alt: "запись 04",
      text: `запись 04
тип: переход
место: автомобиль / багажное отделение
статус: сохранено

описание:
вещи уложены без системы.
перемещение необратимо.
зафиксирован момент закрытия.
пространство утрачено.`,
    },
    {
      id: 5,
      img: "images/memory5.png",
      alt: "запись 05",
      text: `запись 05
тип: фоновая память
место: кухня / жилое помещение
статус: сохранено

описание:
пространство в покое.люди отсутствуют.
фиксируется повторяемость и стабильность.`,
    },
    {
      id: 6,
      img: "images/memory6.png",
      alt: "запись 06",
      text: `запись 06
тип: финальное воспоминание
место: подмостовое пространство
статус: зафиксировано / последнее

описание:
остановка. изолированное пространство.
осознание действия без реализации.
формирование памяти прекращено.
данные закрыты.`,
    },
  ];

  let memoryTypingIntervalId = null;

  function stopMemoryTyping() {
    if (memoryTypingIntervalId) {
      clearInterval(memoryTypingIntervalId);
      memoryTypingIntervalId = null;
    }
  }

  function typeMemoryText(fullText) {
    if (!memoryText) return;

    stopMemoryTyping();
    memoryText.innerHTML = "";

    const speedMs = 38;
    let i = 0;
    const prepared = preventHangingPrepositions(fullText);

    memoryTypingIntervalId = setInterval(() => {
      i++;
      const typed = prepared.slice(0, i);
      memoryText.innerHTML = escapeHtml(typed).replaceAll("\n", "<br />");

      if (i >= prepared.length) {
        stopMemoryTyping();
      }
    }, speedMs);
  }

  function preventHangingPrepositions(text) {
    return text.replace(
      /(^|[\s\n])((?:[ВвКкСсУуОоАаИи]|но|на|по|за|из|от|до|об|под|над|при|про|без|для|или))\s+/g,
      (_, lead, word) => `${lead}${word}\u00A0`,
    );
  }

  function setActiveRecord(nextId) {
    const record = recordData.find((r) => r.id === nextId) || recordData[0];

    memoryNums.forEach((btn) => {
      const id = Number(btn.dataset.record);
      btn.classList.toggle("is-active", id === record.id);
    });

    if (memoryImage instanceof HTMLImageElement) {
      memoryImage.src = record.img;
      memoryImage.alt = record.alt;
    }

    typeMemoryText(record.text);
  }

  if (memoryNums.length && memoryText) {
    memoryNums.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.record);
        setActiveRecord(id);
      });
    });

    setActiveRecord(1);
  }

  // архив — интерактив
  const archiveTrigger = document.getElementById("archiveTrigger");
  const screamerOverlay = document.getElementById("screamerOverlay");
  let archiveClicks = 0;
  let screamerInProgress = false;
  let screamerFadeTimeoutId = null;
  let screamerCloseTimeoutId = null;

  function setScreamerOpen(isOpen) {
    if (!screamerOverlay) return;
    screamerOverlay.classList.toggle("is-open", isOpen);
    screamerOverlay.classList.remove("is-fading");
    screamerOverlay.setAttribute("aria-hidden", String(!isOpen));
  }

  function startScreamer() {
    if (screamerInProgress) return;
    screamerInProgress = true;

    archiveTrigger?.classList.remove("is-wobbling");
    archiveTrigger?.style.removeProperty("--archive-wobble-ms");

    setScreamerOpen(true);

    if (screamerFadeTimeoutId) clearTimeout(screamerFadeTimeoutId);
    if (screamerCloseTimeoutId) clearTimeout(screamerCloseTimeoutId);

    screamerFadeTimeoutId = setTimeout(() => {
      screamerOverlay?.classList.add("is-fading");

      screamerCloseTimeoutId = setTimeout(() => {
        setScreamerOpen(false);
        screamerInProgress = false;
        archiveClicks = 0; // сброс ритма после события
      }, 5000);
    }, 3000);
  }

  function setArchiveWobbleSpeed(clickCount) {
    if (!(archiveTrigger instanceof HTMLElement)) return;
    const clamped = Math.max(1, Math.min(clickCount, 7));

    const ms = Math.round(520 - (clamped - 1) * 55);
    archiveTrigger.style.setProperty("--archive-wobble-ms", `${ms}ms`);
    archiveTrigger.classList.add("is-wobbling");
  }

  if (archiveTrigger) {
    archiveTrigger.addEventListener("click", () => {
      if (screamerInProgress) return;

      archiveClicks += 1;

      if (archiveClicks >= 8) {
        startScreamer();
        return;
      }

      setArchiveWobbleSpeed(archiveClicks);
    });
  }

  // подсказка
  const questionTrigger = document.getElementById("questionTrigger");
  const questionOverlay = document.getElementById("questionOverlay");
  const questionPanel =
    questionOverlay?.querySelector(".question-panel") || null;

  function setQuestionOpen(isOpen) {
    if (!questionOverlay) return;
    questionOverlay.classList.toggle("is-open", isOpen);
    questionOverlay.setAttribute("aria-hidden", String(!isOpen));
  }

  if (questionTrigger && questionOverlay) {
    questionTrigger.addEventListener("click", () => {
      setQuestionOpen(true);
    });

    questionOverlay.addEventListener("click", (event) => {
      if (event.target === questionOverlay) {
        setQuestionOpen(false);
      }
    });

    questionPanel?.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  // Персональное соглашение
  function setAgreeOpen(isOpen) {
    if (!agreeOverlay) return;
    agreeOverlay.classList.toggle("is-open", isOpen);
    agreeOverlay.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function resizeAgreeCanvasPreserve() {
    if (!(agreeCanvas instanceof HTMLCanvasElement)) return;
    if (!(agreePaperImage instanceof HTMLImageElement)) return;

    const rect = agreePaperImage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    agreeCanvasScale = dpr;
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    if (agreeCanvas.width === nextWidth && agreeCanvas.height === nextHeight)
      return;

    const prev = document.createElement("canvas");
    prev.width = agreeCanvas.width || 1;
    prev.height = agreeCanvas.height || 1;
    const prevCtx = prev.getContext("2d");
    if (prevCtx) prevCtx.drawImage(agreeCanvas, 0, 0);

    agreeCanvas.width = nextWidth;
    agreeCanvas.height = nextHeight;

    const ctx = agreeCanvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(prev, 0, 0, nextWidth, nextHeight);
    }
  }

  function setupAgreeDrawing() {
    if (!(agreeCanvas instanceof HTMLCanvasElement)) return;

    const ctx = agreeCanvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    let drawing = false;
    let lastX = 0;
    let lastY = 0;

    function getPos(event) {
      const rect = agreeCanvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * agreeCanvasScale,
        y: (event.clientY - rect.top) * agreeCanvasScale,
      };
    }

    function onPointerDown(event) {
      if (event.button !== undefined && event.button !== 0) return;
      drawing = true;
      const pos = getPos(event);
      lastX = pos.x;
      lastY = pos.y;
      agreeCanvas.setPointerCapture?.(event.pointerId);
    }

    function onPointerMove(event) {
      if (!drawing) return;
      const pos = getPos(event);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastX = pos.x;
      lastY = pos.y;
    }

    function onPointerUp(event) {
      drawing = false;
      agreeCanvas.releasePointerCapture?.(event.pointerId);
    }

    agreeCanvas.addEventListener("pointerdown", onPointerDown);
    agreeCanvas.addEventListener("pointermove", onPointerMove);
    agreeCanvas.addEventListener("pointerup", onPointerUp);
    agreeCanvas.addEventListener("pointercancel", onPointerUp);
    agreeCanvas.addEventListener("pointerleave", onPointerUp);
  }

  setupAgreeDrawing();

  if (agreementButton && agreeOverlay) {
    agreementButton.addEventListener("click", () => {
      setAgreeOpen(true);

      requestAnimationFrame(() => {
        resizeAgreeCanvasPreserve();

        requestAnimationFrame(resizeAgreeCanvasPreserve);
      });
    });

    if (agreePaperImage instanceof HTMLImageElement) {
      agreePaperImage.addEventListener("load", () => {
        if (agreeOverlay.classList.contains("is-open")) {
          resizeAgreeCanvasPreserve();
        }
      });
    }

    window.addEventListener("resize", () => {
      if (agreeOverlay.classList.contains("is-open")) {
        resizeAgreeCanvasPreserve();
      }
    });

    // закрытие по клику
    agreeOverlay.addEventListener("click", (event) => {
      if (event.target === agreeOverlay) {
        setAgreeOpen(false);
      }
    });

    agreePanel?.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  // второй экран — глитч-текст
  const textElement = document.getElementById("glitchText");

  if (textElement) {
    const originalHTML = textElement.innerHTML;
    const textArray = originalHTML.split("");

    function getRandomGlitchSymbol() {
      const glitchSymbols = ["$", "#", "%", "ؾ", "0", "￥", "▰︎", "1"];
      const randomIndex = Math.floor(Math.random() * glitchSymbols.length);
      return glitchSymbols[randomIndex];
    }

    function startChaoticGlitchEffect() {
      let step = 0;
      const maxSteps = 40;
      const glitchSpeed = 90;

      const glitchInterval = setInterval(() => {
        let glitchedText = "";

        const baseProbability = 0.12;
        const decay = step / maxSteps;
        const currentProbability = Math.max(0, baseProbability * (1 - decay));

        for (let i = 0; i < textArray.length; i++) {
          const char = textArray[i];

          if (
            char === "<" ||
            char === ">" ||
            char === "\n" ||
            char === "\t" ||
            char === "\r" ||
            char === " "
          ) {
            glitchedText += char;
            continue;
          }

          const posFactor = (i % 25) / 25;
          const random = Math.random();

          if (random < currentProbability * (0.6 + posFactor)) {
            glitchedText += getRandomGlitchSymbol();
          } else {
            glitchedText += char;
          }
        }

        textElement.innerHTML = glitchedText;
        step++;

        if (step > maxSteps) {
          step = 0;
          textElement.innerHTML = originalHTML;
        }
      }, glitchSpeed);
    }

    startChaoticGlitchEffect();
  }

  // пиксельная кисть
  const sectionElement = document.querySelector(".section2");

  if (sectionElement) {
    const canvasElement = document.createElement("canvas");
    const canvasContext = canvasElement.getContext("2d");
    sectionElement.appendChild(canvasElement);

    function resizeCanvas() {
      canvasElement.width = sectionElement.clientWidth;
      canvasElement.height = sectionElement.clientHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    canvasElement.style.position = "absolute";
    canvasElement.style.top = "0";
    canvasElement.style.left = "0";

    let isDrawingActive = false;

    const brushSize = 40;
    const pixelSize = 10;
    const brushColor = "#ffffff";

    function drawPixelBrush(mouseX, mouseY) {
      canvasContext.fillStyle = brushColor;
      for (let offsetX = 0; offsetX < brushSize; offsetX += pixelSize) {
        for (let offsetY = 0; offsetY < brushSize; offsetY += pixelSize) {
          canvasContext.fillRect(
            mouseX + offsetX - brushSize / 2,
            mouseY + offsetY - brushSize / 2,
            pixelSize,
            pixelSize,
          );
        }
      }
    }

    sectionElement.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        isDrawingActive = true;
      }
    });

    document.addEventListener("mouseup", () => {
      isDrawingActive = false;
    });

    sectionElement.addEventListener("mousemove", (event) => {
      if (isDrawingActive) {
        const rect = sectionElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        drawPixelBrush(x, y);
      }
    });

    sectionElement.addEventListener("mouseleave", () => {
      isDrawingActive = false;
    });
  }

  // камера
  const cameraButton = document.getElementById("cameraBtn");
  const videoElement = document.getElementById("video");
  const cameraImage = document.querySelector(".camera-frame .camera-img");

  if (cameraButton && videoElement) {
    let stream = null;
    let cameraOn = false;

    cameraButton.addEventListener("click", async () => {
      if (!cameraOn) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });

          videoElement.srcObject = stream;
          cameraOn = true;

          if (cameraImage) {
            cameraImage.style.display = "none";
          }
          videoElement.style.display = "block";

          cameraButton.textContent = "выключить камеру";
        } catch (error) {
          console.error("Ошибка доступа к камере:", error);
        }
      } else {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        videoElement.srcObject = null;
        cameraOn = false;

        if (cameraImage) {
          cameraImage.style.display = "block";
        }
        videoElement.style.display = "none";

        cameraButton.textContent = "доступ к камере";
      }
    });
  }

  // бегущие папки
  const logsMarqueeTrack = document.getElementById("logsMarqueeTrack");
  const logsWindowsLayer = document.getElementById("logsWindowsLayer");
  const syncMarqueeTrack1 = document.getElementById("syncMarqueeTrack1");
  const syncMarqueeTrack2 = document.getElementById("syncMarqueeTrack2");

  const cdDays = document.getElementById("cdDays");
  const cdHours = document.getElementById("cdHours");
  const cdMinutes = document.getElementById("cdMinutes");
  const cdSeconds = document.getElementById("cdSeconds");
  const countdownStopBtn = document.getElementById("countdownStopBtn");

  const choiceOverlay = document.getElementById("choiceOverlay");
  const choiceText = document.getElementById("choiceText");
  const choiceButtons = document.getElementById("choiceButtons");

  // стартовый
  (function runIntro() {
    if (!(introOverlay instanceof HTMLElement)) return;
    if (!(introText instanceof HTMLElement)) return;
    if (!(introStartBtn instanceof HTMLElement)) return;

    document.body.style.overflow = "hidden";

    const firstPart = "субъект обнаружен.\nидентификация...";
    const secondPart = "\n\nдоступ: ограниченный";
    let index = 0;
    const speed = 40;
    let readyToEnter = false;
    let typingTimerId = null;

    function typeNextChar() {
      index += 1;
      introText.textContent = firstPart.slice(0, index);

      if (index >= firstPart.length) {
        setTimeout(() => {
          introText.textContent = firstPart + secondPart;
          introStartBtn.classList.add("is-visible");
          readyToEnter = true;
        }, 3000);
        return;
      }

      typingTimerId = setTimeout(typeNextChar, speed);
    }

    typeNextChar();

    introStartBtn.addEventListener("click", () => {
      if (readyToEnter) {
        introOverlay.classList.add("is-hidden");
        document.body.style.overflow = "";

        setTimeout(startMainTypingOnce, 60);
        setTimeout(() => {
          introOverlay.remove();
        }, 650);
      }
    });
  })();

  const logMap = {
    stability: { windowSrc: "images/wind1.png" },
    introspection: { windowSrc: "images/wind2.png" },
    memorydrift: { windowSrc: "images/wind3.png" },
    decisionstate: { windowSrc: "images/wind4.png" },
    silenceprotocol: { windowSrc: "images/wind5.png" },
  };

  let logsTopZ = 12001;
  const openLogWindows = new Map();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setMarqueeDistance() {
    if (!(logsMarqueeTrack instanceof HTMLElement)) return;

    const track = logsMarqueeTrack;

    if (!track.dataset.isCloned) {
      const originals = Array.from(track.children).filter(
        (el) => el instanceof HTMLElement,
      );

      originals.forEach((el) => {
        const c = el.cloneNode(true);
        if (c instanceof HTMLElement) {
          c.setAttribute("aria-hidden", "true");
        }
        track.appendChild(c);
      });
      track.dataset.isCloned = "true";
    }

    const distance = Math.max(0, Math.round(track.scrollWidth / 2));
    track.style.setProperty("--logs-marquee-distance", `${distance}px`);
  }

  function initMarquee(trackEl, distanceVarName) {
    if (!(trackEl instanceof HTMLElement)) return;

    const varName = distanceVarName || "--logs-marquee-distance";

    function ensureClonedOnce() {
      if (trackEl.dataset.isCloned) return;

      const originals = Array.from(trackEl.childNodes);
      originals.forEach((node) => {
        const c = node.cloneNode(true);
        if (c instanceof HTMLElement) c.setAttribute("aria-hidden", "true");
        trackEl.appendChild(c);
      });
      trackEl.dataset.isCloned = "true";
    }

    function setDistance() {
      ensureClonedOnce();
      const distance = Math.max(0, Math.round(trackEl.scrollWidth / 2));
      trackEl.style.setProperty(varName, `${distance}px`);
    }

    requestAnimationFrame(() => {
      setDistance();
      requestAnimationFrame(setDistance);
    });

    window.addEventListener("resize", setDistance);
  }

  function focusLogWindow(winEl) {
    if (!(winEl instanceof HTMLElement)) return;
    logsTopZ += 1;
    winEl.style.zIndex = String(logsTopZ);
  }

  function createLogWindow(key) {
    if (!(logsWindowsLayer instanceof HTMLElement)) return null;

    const conf = logMap[key];
    if (!conf) return null;

    const wrapper = document.createElement("div");
    wrapper.className = "logs-window";
    wrapper.dataset.log = key;
    wrapper.style.zIndex = String(++logsTopZ);

    const img = document.createElement("img");
    img.src = conf.windowSrc;
    img.alt = "";
    img.draggable = false;

    const closeBtn = document.createElement("button");
    closeBtn.className = "logs-window-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "закрыть");

    wrapper.appendChild(img);
    wrapper.appendChild(closeBtn);
    logsWindowsLayer.appendChild(wrapper);

    const vw = window.innerWidth || 1280;
    const vh = window.innerHeight || 720;
    const left = Math.round(vw * (0.12 + Math.random() * 0.62));
    const top = Math.round(vh * (0.12 + Math.random() * 0.58));
    wrapper.style.left = `${left}px`;
    wrapper.style.top = `${top}px`;

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.remove();
      openLogWindows.delete(key);
    });

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target === closeBtn) return;

      dragging = true;
      focusLogWindow(wrapper);

      const rect = wrapper.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      startX = e.clientX;
      startY = e.clientY;

      wrapper.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e) {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const maxLeft = (window.innerWidth || 0) - 60;
      const maxTop = (window.innerHeight || 0) - 60;

      const nextLeft = clamp(startLeft + dx, -40, maxLeft);
      const nextTop = clamp(startTop + dy, -40, maxTop);

      wrapper.style.left = `${Math.round(nextLeft)}px`;
      wrapper.style.top = `${Math.round(nextTop)}px`;
    }

    function onPointerUp(e) {
      dragging = false;
      wrapper.releasePointerCapture?.(e.pointerId);
    }

    wrapper.addEventListener("pointerdown", onPointerDown);
    wrapper.addEventListener("pointermove", onPointerMove);
    wrapper.addEventListener("pointerup", onPointerUp);
    wrapper.addEventListener("pointercancel", onPointerUp);
    wrapper.addEventListener("mousedown", () => focusLogWindow(wrapper));

    wrapper.addEventListener("click", () => focusLogWindow(wrapper));

    img.addEventListener("load", () => {
      const rect = wrapper.getBoundingClientRect();
      const maxLeft2 = (window.innerWidth || 0) - Math.min(rect.width, 60);
      const maxTop2 = (window.innerHeight || 0) - Math.min(rect.height, 60);
      const curLeft = parseFloat(wrapper.style.left || "0");
      const curTop = parseFloat(wrapper.style.top || "0");
      wrapper.style.left = `${Math.round(clamp(curLeft, -40, maxLeft2))}px`;
      wrapper.style.top = `${Math.round(clamp(curTop, -40, maxTop2))}px`;
    });

    return wrapper;
  }

  function openLogByKey(key) {
    if (!key) return;
    const existing = openLogWindows.get(key);
    if (existing) {
      focusLogWindow(existing);
      return;
    }
    const created = createLogWindow(key);
    if (created) openLogWindows.set(key, created);
  }

  if (logsMarqueeTrack) {
    initMarquee(logsMarqueeTrack, "--logs-marquee-distance");
  }

  if (syncMarqueeTrack1)
    initMarquee(syncMarqueeTrack1, "--logs-marquee-distance");
  if (syncMarqueeTrack2)
    initMarquee(syncMarqueeTrack2, "--logs-marquee-distance");

  document.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const item = target.closest?.(".logs-item");
    if (!(item instanceof HTMLElement)) return;
    const key = item.dataset.log;
    openLogByKey(key);
  });

  // отсчет времени
  let countdownTotalSeconds = 0 * 86400 + 12 * 3600 + 44 * 60 + 19;
  let countdownRunning = true;
  let countdownIntervalId = null;

  function pad2(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function renderCountdown() {
    const total = Math.max(0, countdownTotalSeconds);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    if (cdDays) cdDays.textContent = pad2(days);
    if (cdHours) cdHours.textContent = pad2(hours);
    if (cdMinutes) cdMinutes.textContent = pad2(minutes);
    if (cdSeconds) cdSeconds.textContent = pad2(seconds);
  }

  function tickCountdown() {
    if (!countdownRunning) return;
    if (countdownTotalSeconds <= 0) {
      countdownTotalSeconds = 0;
      renderCountdown();
      countdownRunning = false;
      return;
    }
    countdownTotalSeconds -= 1;
    renderCountdown();
  }

  renderCountdown();
  countdownIntervalId = setInterval(tickCountdown, 1000);

  if (countdownStopBtn) {
    countdownStopBtn.addEventListener("click", () => {
      openChoiceOverlay();
    });
  }

  // выбор(конец)
  const choiceFullText =
    "упс.. кажется, произошла ошибка. вы уже сделали свой выбор..\n\nжелаете продолжить?";
  let choiceTypingIndex = 0;
  let choiceTypingId = null;
  let choiceClicksNo = 0;

  function setGlobalPlayState(state) {
    if (logsMarqueeTrack instanceof HTMLElement)
      logsMarqueeTrack.style.animationPlayState = state;
    if (syncMarqueeTrack1 instanceof HTMLElement)
      syncMarqueeTrack1.style.animationPlayState = state;
    if (syncMarqueeTrack2 instanceof HTMLElement)
      syncMarqueeTrack2.style.animationPlayState = state;
  }

  function closeChoiceOverlay() {
    if (!(choiceOverlay instanceof HTMLElement)) return;
    choiceOverlay.classList.remove("is-open");
    choiceOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    setGlobalPlayState("running");
    countdownRunning = true;
  }

  function renderChoiceButtons() {
    if (!(choiceButtons instanceof HTMLElement)) return;
    choiceButtons.innerHTML = "";

    if (choiceClicksNo >= 4) {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.type = "button";
      btn.textContent = "конечно да!";
      btn.addEventListener("click", () => {
        closeChoiceOverlay();
      });
      choiceButtons.appendChild(btn);
      return;
    }

    const yesBtn = document.createElement("button");
    yesBtn.className = "choice-btn";
    yesBtn.type = "button";
    yesBtn.textContent = "да";
    yesBtn.addEventListener("click", () => {
      closeChoiceOverlay();
    });

    const noBtn = document.createElement("button");
    noBtn.className = "choice-btn";
    noBtn.type = "button";
    noBtn.textContent = "нет";
    noBtn.addEventListener("click", () => {
      choiceClicksNo += 1;
      // кнопка нет, случайная позиция
      const wrapper = noBtn.parentElement;
      if (wrapper instanceof HTMLElement) {
        wrapper.style.position = "relative";
      }
      noBtn.style.position = "absolute";
      const vw = window.innerWidth || 1280;
      const vh = window.innerHeight || 720;
      const offsetX = Math.round(vw * (0.15 + Math.random() * 0.5));
      const offsetY = Math.round(vh * (0.45 + Math.random() * 0.5));
      noBtn.style.left = `${offsetX}px`;
      noBtn.style.top = `${offsetY - vh / 2}px`;

      if (choiceClicksNo >= 5) {
        // "конечно да!"
        renderChoiceButtons();
      }
    });

    choiceButtons.appendChild(yesBtn);
    choiceButtons.appendChild(noBtn);
  }

  function openChoiceOverlay() {
    if (!(choiceOverlay instanceof HTMLElement)) return;
    if (!(choiceText instanceof HTMLElement)) return;

    countdownRunning = false;
    setGlobalPlayState("paused");

    choiceOverlay.classList.add("is-open");
    choiceOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    choiceTypingIndex = 0;
    if (choiceTypingId) {
      clearInterval(choiceTypingId);
      choiceTypingId = null;
    }
    choiceText.textContent = "";
    choiceButtons.innerHTML = "";

    const speed = 35;
    choiceTypingId = setInterval(() => {
      choiceTypingIndex += 1;
      const slice = choiceFullText.slice(0, choiceTypingIndex);
      choiceText.textContent = slice;

      if (choiceTypingIndex >= choiceFullText.length) {
        clearInterval(choiceTypingId);
        choiceTypingId = null;
        renderChoiceButtons();
      }
    }, speed);
  }
});
