(() => {
  'use strict';

  /* ============================================
     CONFIG — edit these two things for your gift
     ============================================ */
  const PASSWORD = '1/6'; // change this to whatever you like
  const START_DATE = new Date('2026-03-16T10:30:00');

  // ⚠️ حطي هنا الرابط اللي هتاخديه بعد عمل Deploy للـ Apps Script
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwefC2TcvY1veOwYdVM9phZh5Q32k9CPYnJU1OPbFUevNbLcLUoYkSu8gE-AEV-8IZI_g/exec';

  const WRONG_PASSWORD_MESSAGES = [
    "لا غلط",
    "لا ركزي، في ايه ده سهل",
    "يووه تاريخ ميلاد يا كنج",
    "(1/6) تاريخ ميلادك يا ستي قرفتينا"
  ];
  let wrongAttempts = 0;

  /* ============================================
     ELEMENT REFS
     ============================================ */
  const loginScreen = document.getElementById('loginScreen');
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('passwordInput');
  const loginError = document.getElementById('loginError');

  const hackScreen = document.getElementById('hackScreen');
  const hackLines = document.getElementById('hackLines');
  const hackProgressBar = document.getElementById('hackProgressBar');
  const warningIcon = document.getElementById('warningIcon');

  const mainPage = document.getElementById('mainPage');

  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  const heartsField = document.getElementById('heartsField');

  const envelope = document.getElementById('envelope');
  const messageOverlay = document.getElementById('messageOverlay');
  const messageClose = document.getElementById('messageClose');

  const gallerySlider = document.getElementById('gallerySlider');
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  /* ============================================
     AMBIENT FLOATING HEARTS
     ============================================ */
  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = '♥';
    const size = 10 + Math.random() * 18;
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = size + 'px';
    heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    const duration = 9 + Math.random() * 8;
    heart.style.animationDuration = duration + 's';
    heartsField.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  const heartInterval = setInterval(spawnHeart, 900);
  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);

  /* ============================================
     1) LOGIN
     ============================================ */
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = passwordInput.value.trim();

    if (value.length === 0) {
      showLoginError('Type something for me first.');
      return;
    }

    if (value.toLowerCase() === PASSWORD.toLowerCase()) {
      loginError.classList.remove('show');
      beginHackSequence();
    } else {
      const msgIndex = Math.min(wrongAttempts, WRONG_PASSWORD_MESSAGES.length - 1);
      showLoginError(WRONG_PASSWORD_MESSAGES[msgIndex]);
      wrongAttempts++;

      passwordInput.classList.remove('shake');
      // force reflow so the animation can restart
      void passwordInput.offsetWidth;
      passwordInput.classList.add('shake');
    }
  });

  function showLoginError(msg) {
    loginError.textContent = msg;
    loginError.classList.add('show');
  }

  /* ============================================
     2) FAKE HACKING SCREEN
     ============================================ */
  const HACK_MESSAGES = [
    'Initiating connection...',
    'System Breached...',
    'Accessing Private Data...',
    'Bypassing Firewall...',
    'Injecting...',
    'ERROR...',
    'Decrypting memories...',
    'Access Granted.'
  ];

  function beginHackSequence() {
    loginScreen.classList.add('screen-exit');

    setTimeout(() => {
      loginScreen.setAttribute('aria-hidden', 'true');
      loginScreen.classList.remove('screen-exit');
      hackScreen.setAttribute('aria-hidden', 'false');
      hackScreen.classList.add('glitching');
      runHackTyping();
      animateHackProgress();
      playGlitchSound();
    }, 600);
  }

  function runHackTyping() {
    hackLines.innerHTML = '';
    let lineIndex = 0;

    function typeLine() {
      if (lineIndex >= HACK_MESSAGES.length) return;

      const lineEl = document.createElement('div');
      lineEl.className = 'hack-line';
      hackLines.appendChild(lineEl);

      const text = HACK_MESSAGES[lineIndex];
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex <= text.length) {
          lineEl.innerHTML = text.slice(0, charIndex) + '<span class="cursor"></span>';
          charIndex++;
          setTimeout(typeChar, 18 + Math.random() * 22);
        } else {
          lineEl.innerHTML = text;
          lineIndex++;
          setTimeout(typeLine, 90);
        }
      };
      typeChar();
    }
    typeLine();
  }

  function animateHackProgress() {
    hackProgressBar.style.transition = 'width 2.6s linear';
    requestAnimationFrame(() => {
      hackProgressBar.style.width = '100%';
    });

    setTimeout(finishHackSequence, 4800);
  }

  function playGlitchSound() {
    // Lightweight synthesized glitch blips via WebAudio — no external file needed.
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let t = ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(120 + Math.random() * 500, t);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
        t += 0.12 + Math.random() * 0.25;
      }
    } catch (err) {
      // Audio not available — silently skip, the visuals still land.
    }
  }

  function finishHackSequence() {
    hackScreen.classList.remove('glitching');
    hackScreen.classList.add('screen-exit');

    setTimeout(() => {
      hackScreen.setAttribute('aria-hidden', 'true');
      hackScreen.classList.remove('screen-exit');
      revealMainPage();
    }, 700);
  }

  /* ============================================
     3) MAIN PAGE REVEAL
     ============================================ */
  function revealMainPage() {
    mainPage.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      mainPage.classList.add('visible');
    });
    startTimer();
    document.body.addEventListener('click', tryAutoplayMusicOnce, { once: true });
    loadUploadedGallery();
    loadSavedVoiceNotes();
  }

  /* ---- جلب اللي اترفع من Drive وعرضه في الموقع ---- */
  // ✅ الصيغة دي (lh3.googleusercontent.com) أكتر ثباتاً لعرض الصور جوه <img>
  // من صيغة drive.google.com/uc?export=view اللي بتتعطل أحياناً جوه صفحات تانية
  const DRIVE_IMAGE_URL = (id) => `https://lh3.googleusercontent.com/d/${id}`;
  const DRIVE_PREVIEW_URL = (id) => `https://drive.google.com/file/d/${id}/preview`;

  async function fetchDriveList(category) {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'PASTE_YOUR_WEB_APP_URL_HERE') return [];
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=list&category=${encodeURIComponent(category)}`);
      const data = await res.json();
      if (data.status === 'success') return data.items;
    } catch (err) {
      // فشل هادئ — الموقع يشتغل عادي حتى لو الجلب فشل
    }
    return [];
  }

  async function loadUploadedGallery() {
    const [images, videos] = await Promise.all([
      fetchDriveList('Images'),
      fetchDriveList('Videos')
    ]);

    images.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      const img = document.createElement('img');
      img.src = DRIVE_IMAGE_URL(item.id);
      img.alt = item.name || 'صورة محفوظة';
      img.loading = 'lazy';
      card.appendChild(img);
      gallerySlider.appendChild(card);
    });

    videos.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'gallery-card gallery-card-video';
      const iframe = document.createElement('iframe');
      iframe.src = DRIVE_PREVIEW_URL(item.id);
      iframe.setAttribute('allow', 'autoplay');
      iframe.setAttribute('allowfullscreen', '');
      iframe.title = item.name || 'فيديو محفوظ';
      card.appendChild(iframe);
      gallerySlider.appendChild(card);
    });
  }

  async function loadSavedVoiceNotes() {
    const notes = await fetchDriveList('VoiceNotes');
    const container = document.getElementById('savedVoiceNotesList');
    const emptyMsg = document.getElementById('savedVoiceNotesEmpty');
    if (!container) return;

    if (notes.length === 0) return; // خليه على رسالة "لسه مفيش" الافتراضية

    if (emptyMsg) emptyMsg.remove();

    notes.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'voice-note-item';
      const iframe = document.createElement('iframe');
      iframe.className = 'voice-note-frame';
      iframe.src = DRIVE_PREVIEW_URL(item.id);
      iframe.title = item.name || 'تسجيل صوتي';
      li.appendChild(iframe);
      container.appendChild(li);
    });
  }

  /* ---- elapsed timer (count up) ---- */
  const tDays = document.getElementById('tDays');
  const tHours = document.getElementById('tHours');
  const tMinutes = document.getElementById('tMinutes');
  const tSeconds = document.getElementById('tSeconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateTimer() {
    const now = new Date();
    let diff = Math.max(0, now - START_DATE);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    tDays.textContent = pad(days);
    tHours.textContent = pad(hours);
    tMinutes.textContent = pad(minutes);
    tSeconds.textContent = pad(seconds);
  }

  let timerInterval = null;
  function startTimer() {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  /* ---- background music ---- */
  function tryAutoplayMusicOnce() {
    bgMusic.volume = 0.5;
    const playPromise = bgMusic.play();
    if (playPromise && playPromise.then) {
      playPromise.then(() => {
        musicToggle.setAttribute('aria-pressed', 'true');
      }).catch(() => {
        // Autoplay blocked — user can still tap the button manually.
        musicToggle.setAttribute('aria-pressed', 'false');
      });
    }
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => musicToggle.setAttribute('aria-pressed', 'true')).catch(() => {});
    } else {
      bgMusic.pause();
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });

  bgMusic.addEventListener('pause', () => musicToggle.setAttribute('aria-pressed', 'false'));
  bgMusic.addEventListener('play', () => musicToggle.setAttribute('aria-pressed', 'true'));

  /* ---- envelope / love letter ---- */
  function openEnvelope() {
    envelope.classList.add('opened');
    setTimeout(() => {
      messageOverlay.classList.add('visible');
      messageOverlay.setAttribute('aria-hidden', 'false');
    }, 350);
  }

  function closeEnvelope() {
    messageOverlay.classList.remove('visible');
    messageOverlay.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      envelope.classList.remove('opened');
    }, 250);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
  messageClose.addEventListener('click', closeEnvelope);
  messageOverlay.addEventListener('click', (e) => {
    if (e.target === messageOverlay) closeEnvelope();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && messageOverlay.classList.contains('visible')) closeEnvelope();
  });

  /* ---- gallery + fullscreen modal ---- */
  // بنجيب كروت الصور "لايف" كل مرة، عشان اللي بيتضاف من Drive يشتغل معاها من غير ما نربط الأحداث من جديد
  function getImageCards() {
    return Array.from(gallerySlider.querySelectorAll('.gallery-card:not(.gallery-card-video)'));
  }

  let currentImageIndex = 0;

  function openModal(index) {
    const cards = getImageCards();
    const img = cards[index] && cards[index].querySelector('img');
    if (!img) return;
    currentImageIndex = index;
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    imageModal.classList.add('visible');
    imageModal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    imageModal.classList.remove('visible');
    imageModal.setAttribute('aria-hidden', 'true');
  }

  function showImage(delta) {
    const cards = getImageCards();
    currentImageIndex = (currentImageIndex + delta + cards.length) % cards.length;
    const img = cards[currentImageIndex].querySelector('img');
    modalImage.style.transform = 'scale(0.85)';
    modalImage.style.opacity = '0';
    setTimeout(() => {
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modalImage.style.transform = 'scale(1)';
      modalImage.style.opacity = '1';
    }, 180);
  }

  // event delegation عشان يشتغل مع الكروت اللي بتتضاف بعد التحميل الأول برضو
  gallerySlider.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (!card || card.classList.contains('gallery-card-video')) return;
    const cards = getImageCards();
    const index = cards.indexOf(card);
    if (index > -1) openModal(index);
  });

  modalClose.addEventListener('click', closeModal);
  modalPrev.addEventListener('click', () => showImage(-1));
  modalNext.addEventListener('click', () => showImage(1));
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (!imageModal.classList.contains('visible')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showImage(-1);
    if (e.key === 'ArrowRight') showImage(1);
  });

  /* ============================================
     4) UPLOADS — send to Google Drive via Apps Script
     ============================================ */

  // يحول أي ملف لـ base64 عشان نقدر نبعته في JSON
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result; // "data:mime;base64,XXXX"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadToDrive({ file, category, statusEl, fileNamePrefix }) {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'PASTE_YOUR_WEB_APP_URL_HERE') {
      statusEl.textContent = 'لسه الرابط متحطش، كلمي اللي عمل الموقع 💌';
      return;
    }

    statusEl.textContent = 'بترفع دلوقتي...';

    try {
      const base64Data = await fileToBase64(file);
      const fileName = `${fileNamePrefix || 'file'}_${Date.now()}_${file.name || ''}`;

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          category,
          fileName,
          mimeType: file.type || 'application/octet-stream',
          fileData: base64Data
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        statusEl.textContent = 'اتحفظت ✓';
      } else {
        statusEl.textContent = 'حصل خطأ، جربي تاني';
      }
    } catch (err) {
      statusEl.textContent = 'حصل خطأ، جربي تاني';
    }
  }

  /* ---- image upload ---- */
  const imageInput = document.getElementById('imageInput');
  const imageStatus = document.getElementById('imageStatus');

  if (imageInput) {
    imageInput.addEventListener('change', async () => {
      const file = imageInput.files[0];
      if (!file) return;
      await uploadToDrive({ file, category: 'Images', statusEl: imageStatus, fileNamePrefix: 'image' });
      imageInput.value = '';
      loadUploadedGallery();
    });
  }

  /* ---- video upload ---- */
  const videoInput = document.getElementById('videoInput');
  const videoStatus = document.getElementById('videoStatus');

  if (videoInput) {
    videoInput.addEventListener('change', async () => {
      const file = videoInput.files[0];
      if (!file) return;
      await uploadToDrive({ file, category: 'Videos', statusEl: videoStatus, fileNamePrefix: 'video' });
      videoInput.value = '';
      loadUploadedGallery();
    });
  }

  /* ---- voice note recording ---- */
  const recordBtn = document.getElementById('recordBtn');
  const recordLabel = document.getElementById('recordLabel');
  const voiceStatus = document.getElementById('voiceStatus');
  const voiceNotesList = document.getElementById('voiceNotesList');

  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;

  if (recordBtn) {
    recordBtn.addEventListener('click', async () => {
      if (!isRecording) {
        await startRecording();
      } else {
        stopRecording();
      }
    });
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'audio/webm' });
        addVoiceNoteToList(blob);
        // نوقف كل التراكات عشان نطفي الميكروفون
        stream.getTracks().forEach((track) => track.stop());

        // نرفعها أوتوماتيك على Drive
        const fakeFile = new File([blob], 'voice-note.webm', { type: 'audio/webm' });
        await uploadToDrive({ file: fakeFile, category: 'VoiceNotes', statusEl: voiceStatus, fileNamePrefix: 'voice' });
        loadSavedVoiceNotes(); // نحدّث القايمة تحت في قسم "your voice notes"
      };

      mediaRecorder.start();
      isRecording = true;
      recordBtn.classList.add('recording');
      recordLabel.textContent = 'وقفي التسجيل';
      voiceStatus.textContent = 'بتسجل الآن...';
    } catch (err) {
      voiceStatus.textContent = 'محتاجة تسمحي بالميكروفون';
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
    recordBtn.classList.remove('recording');
    recordLabel.textContent = 'ابدئي التسجيل';
  }

  function addVoiceNoteToList(blob) {
    const url = URL.createObjectURL(blob);
    const li = document.createElement('li');
    li.className = 'voice-note-item';

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = url;

    li.appendChild(audio);
    voiceNotesList.prepend(li);
  }

  /* focus login input on load for convenience */
  window.addEventListener('load', () => passwordInput.focus());
})();