/* =========================================================
   1) AudioPlayer
   ========================================================= */
class AudioPlayer {
  constructor(tracks) {
    this.tracks = tracks;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.isRepeat = false;
    this.isMuted = false;
    this.volume = 0.8;
    this.sounds = {};
    this.onStateChange = null;
    this.onTimeUpdate = null;
    this._ticker = null;
    this._initSounds();
  }

  _initSounds() {
    this.tracks.forEach((track, i) => {
      this.sounds[i] = new Howl({
        src: [track.src],
        html5: true,
        volume: this.volume,
        preload: i === 0 ? 'auto' : 'metadata',
        onplay: () => this._handlePlay(),
        onpause: () => this._handlePause(),
        onstop: () => this._handlePause(),
        onend: () => this._handleEnd(),
        onload: () => {
          if (i === this.currentIndex && this.onStateChange) this.onStateChange(this.getState());
        },
        onloaderror: () => console.warn(`تعذر تحميل: ${track.src}`),
      });
    });
  }

  load(index, autoplay = false) {
    if (index === this.currentIndex && this.sounds[index].state() === 'loaded') {
      if (autoplay) this.play();
      return;
    }
    this.pause();
    this.currentIndex = index;
    if (this.onStateChange) this.onStateChange(this.getState());
    if (autoplay) this.play();
  }

  play() {
    const sound = this.sounds[this.currentIndex];
    if (!sound) return;
    sound.play();
    this.isPlaying = true;
    this._startTicker();
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  pause() {
    const sound = this.sounds[this.currentIndex];
    if (sound) sound.pause();
    this.isPlaying = false;
    this._stopTicker();
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  toggle() { this.isPlaying ? this.pause() : this.play(); }

  next() {
    let next;
    if (this.isShuffle) {
      do { next = Math.floor(Math.random() * this.tracks.length); }
      while (next === this.currentIndex && this.tracks.length > 1);
    } else {
      next = (this.currentIndex + 1) % this.tracks.length;
    }
    this.load(next, true);
  }

  prev() {
    const sound = this.sounds[this.currentIndex];
    if (sound && sound.seek() > 3) { sound.seek(0); return; }
    let prev;
    if (this.isShuffle) {
      do { prev = Math.floor(Math.random() * this.tracks.length); }
      while (prev === this.currentIndex && this.tracks.length > 1);
    } else {
      prev = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    }
    this.load(prev, true);
  }

  seek(percent) {
    const sound = this.sounds[this.currentIndex];
    if (!sound || sound.state() !== 'loaded') return;
    const duration = sound.duration();
    if (duration > 0) sound.seek(duration * percent);
  }

  setVolume(v) {
    this.volume = v;
    Object.values(this.sounds).forEach(s => s.volume(v));
    this.isMuted = v === 0;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Object.values(this.sounds).forEach(s => s.mute(this.isMuted));
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  _handlePlay() { this.isPlaying = true; if (this.onStateChange) this.onStateChange(this.getState()); }
  _handlePause() { this.isPlaying = false; this._stopTicker(); if (this.onStateChange) this.onStateChange(this.getState()); }

  _handleEnd() {
    if (this.isRepeat) {
      const sound = this.sounds[this.currentIndex];
      sound.seek(0); sound.play();
    } else { this.next(); }
  }

  _startTicker() {
    this._stopTicker();
    this._ticker = setInterval(() => {
      const sound = this.sounds[this.currentIndex];
      if (!sound || sound.state() !== 'loaded') return;
      const seek = sound.seek() || 0;
      const dur = sound.duration() || 0;
      if (this.onTimeUpdate) this.onTimeUpdate(seek, dur);
    }, 200);
  }

  _stopTicker() {
    if (this._ticker) { clearInterval(this._ticker); this._ticker = null; }
  }

  getState() {
    return {
      currentIndex: this.currentIndex,
      track: this.tracks[this.currentIndex],
      isPlaying: this.isPlaying,
      isShuffle: this.isShuffle,
      isRepeat: this.isRepeat,
      isMuted: this.isMuted,
      volume: this.volume,
    };
  }
}

/* =========================================================
   2) Visualizer
   ========================================================= */
class Visualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.active = false;
    this.t = 0;
    this.frameSkip = 0;
    this._resize();
    window.addEventListener('resize', () => this._resize());
    this._loop();
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.canvas.offsetWidth * dpr;
    this.canvas.height = this.canvas.offsetHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = this.canvas.offsetWidth;
    this.h = this.canvas.offsetHeight;
  }

  setActive(v) { this.active = v; }

  _loop = () => {
    requestAnimationFrame(this._loop);
    this.frameSkip = (this.frameSkip + 1) % 2;
    if (this.frameSkip) return;
    this.t += 0.04;
    this._draw();
  };

  _draw() {
    const { ctx, w, h, active } = this;
    ctx.clearRect(0, 0, w, h);
    const bars = 32, bw = w / bars, centerY = h * 0.5;
    const intensity = active ? 1 : 0.35;
    for (let i = 0; i < bars; i++) {
      const wave1 = Math.sin(this.t + i * 0.4) * 0.5 + 0.5;
      const wave2 = Math.sin(this.t * 1.7 + i * 0.8) * 0.3 + 0.3;
      const height = (wave1 * 0.6 + wave2 * 0.4) * 60 * intensity + 6;
      const x = i * bw + bw * 0.2;
      const y = centerY - height / 2;
      ctx.fillStyle = `rgba(212,175,55,${0.3 + wave1 * 0.5 * intensity})`;
      ctx.fillRect(x, y, bw * 0.6, height);
    }
  }
}

/* =========================================================
   3) Main
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const TRACKS = [
    { title: 'البداية', artist: 'نغم', src: 'audio/track1.mp3' },
    { title: 'الذروة',  artist: 'نغم', src: 'audio/track2.mp3' },
    { title: 'الختام',  artist: 'نغم', src: 'audio/track3.mp3' },
  ];

  const $ = id => document.getElementById(id);
  const miniPlayer = $('mini-player');
  const fullPlayer = $('full-player');
  const drawer     = $('drawer');
  const overlay    = $('overlay');

  const canvas = $('hero-canvas');
  const viz = canvas ? new Visualizer(canvas) : null;
  const player = new AudioPlayer(TRACKS);

  function toast(msg, ms = 2000) {
    const el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ms);
  }

  function fmt(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateUI(state) {
    const t = state.track;
    $('mini-title').textContent  = t.title;
    $('mini-artist').textContent = t.artist;
    $('mini-play').textContent   = state.isPlaying ? '⏸' : '▶';
    $('fp-title').textContent    = t.title;
    $('fp-artist').textContent   = t.artist;
    $('fp-play').textContent     = state.isPlaying ? '⏸' : '▶';
    $('fp-shuffle').classList.toggle('active', state.isShuffle);
    $('fp-repeat').classList.toggle('active', state.isRepeat);
    $('fp-mute').textContent = (state.isMuted || state.volume === 0) ? '🔇' : '🔊';
    document.querySelectorAll('.track-card').forEach((c, i) => {
      c.classList.toggle('active', i === state.currentIndex);
    });
    if (viz) viz.setActive(state.isPlaying);
  }

  player.onStateChange = updateUI;

  player.onTimeUpdate = (cur, dur) => {
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    $('mini-progress-fill').style.width = pct + '%';
    $('fp-progress-fill').style.width = pct + '%';
    $('fp-current').textContent = fmt(cur);
    $('fp-duration').textContent = fmt(dur);
  };

  updateUI(player.getState());

  let firstInteract = false;
  const startOnFirstTouch = () => {
    if (firstInteract) return;
    firstInteract = true;
    player.load(0, false);
  };
  document.addEventListener('touchstart', startOnFirstTouch, { once: true });
  document.addEventListener('click', startOnFirstTouch, { once: true });

  $('hero-play').addEventListener('click', () => {
    player.load(0, true);
    openFullPlayer();
    toast('يتم التشغيل...');
  });

  document.querySelectorAll('.card-play').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = Number(btn.dataset.track);
      if (idx === player.currentIndex && player.isPlaying) player.pause();
      else { player.load(idx, true); openFullPlayer(); }
    });
  });

  document.querySelectorAll('.track-card').forEach(card => {
    card.addEventListener('click', () => openFullPlayer());
  });

  $('mini-play').addEventListener('click', () => player.toggle());
  $('mini-expand').addEventListener('click', openFullPlayer);
  miniPlayer.addEventListener('click', (e) => {
    if (e.target === miniPlayer ||
        e.target.classList.contains('mini-thumb') ||
        e.target.classList.contains('mini-info')) {
      openFullPlayer();
    }
  });

  function openFullPlayer() {
    fullPlayer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeFullPlayer() {
    fullPlayer.classList.remove('open');
    document.body.style.overflow = '';
  }

  $('fp-close').addEventListener('click', closeFullPlayer);
  $('fp-play').addEventListener('click', () => player.toggle());
  $('fp-prev').addEventListener('click', () => player.prev());
  $('fp-next').addEventListener('click', () => player.next());
  $('fp-shuffle').addEventListener('click', () => {
    player.toggleShuffle();
    toast(player.isShuffle ? '🔀 عشوائي مفعّل' : 'ترتيب عادي');
  });
  $('fp-repeat').addEventListener('click', () => {
    player.toggleRepeat();
    toast(player.isRepeat ? '🔁 تكرار مفعّل' : 'تكرار مغلق');
  });

  const fpProg = $('fp-progress');
  let isDragging = false;

  function seekFromTouch(clientX) {
    const rect = fpProg.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    player.seek(pct);
    $('fp-progress-fill').style.width = (pct * 100) + '%';
  }

  fpProg.addEventListener('touchstart', (e) => {
    isDragging = true;
    seekFromTouch(e.touches[0].clientX);
  }, { passive: true });
  fpProg.addEventListener('touchmove', (e) => {
    if (isDragging) seekFromTouch(e.touches[0].clientX);
  }, { passive: true });
  fpProg.addEventListener('touchend', () => { isDragging = false; });
  fpProg.addEventListener('click', (e) => seekFromTouch(e.clientX));

  $('fp-vol').addEventListener('input', (e) => {
    player.setVolume(parseFloat(e.target.value));
    updateUI(player.getState());
  });
  $('fp-mute').addEventListener('click', () => {
    player.toggleMute();
    updateUI(player.getState());
  });

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('show');
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
  }
  $('menu-btn').addEventListener('click', openDrawer);
  $('close-drawer').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setTimeout(closeDrawer, 150));
  });

  $('theme-btn').addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    document.body
