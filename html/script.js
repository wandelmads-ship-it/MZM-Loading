(() => {
  'use strict';

  const config = window.MZM_CONFIG || {};
  const root = document.documentElement;
  const loadingScreen = document.getElementById('loadingScreen');
  const fill = document.getElementById('progressFill');
  const percentage = document.getElementById('percentage');
  const message = document.getElementById('loadingMessage');

  let progress = 0;
  let hasClientProgress = false;
  let shuttingDown = false;
  let messageIndex = 0;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element && value) element.textContent = value;
  };

  setText('serverName', config.serverName);
  setText('serverTag', config.serverTag);
  setText('serverInitials', config.serverInitials);
  setText('serverSubtitle', config.subtitle);
  setText('discordName', config.discordName);
  setText('trackTitle', config.musicTitle);
  setText('trackArtist', config.musicArtist);

  const discordLink = document.getElementById('discordLink');
  if (discordLink && config.discordUrl) discordLink.href = config.discordUrl;

  if (Array.isArray(config.socials)) {
    const socialLinks = document.getElementById('socialLinks');
    config.socials.forEach((social) => {
      const link = document.createElement('a');
      link.className = 'social-link';
      link.target = '_blank';
      link.rel = 'noopener';
      link.href = social.url;
      link.innerHTML = `<span>${social.name}</span><span>↗</span>`;
      socialLinks.appendChild(link);
    });
  }

  if (Array.isArray(config.staff)) {
    const staffGrid = document.getElementById('staffGrid');
    config.staff.forEach((member) => {
      const item = document.createElement('div');
      item.className = 'staff-member';
      item.innerHTML = `<div class="staff-avatar">${member.initials}</div><div><strong>${member.name}</strong><span>${member.role}</span></div>`;
      staffGrid.appendChild(item);
    });
  }

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
      document.querySelectorAll('.panel').forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab)?.classList.add('active');
    });
  });

  const setProgress = (value) => {
    progress = Math.max(progress, Math.min(100, Math.round(value)));
    fill.style.width = `${progress}%`;
    percentage.textContent = String(progress);

    if (progress >= 100 && !shuttingDown) shutdown();
  };

  function shutdown() {
    shuttingDown = true;
    loadingScreen.classList.add('exit');
    requestAnimationFrame(() => loadingScreen.classList.add('active'));

    setTimeout(() => {
      if (window.invokeNative) {
        fetch(`https://${window.GetParentResourceName?.() || 'mzm_loading'}/shutdown`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          body: JSON.stringify({})
        }).catch(() => {});
      }
    }, 650);
  }

  function useProgressEvent(event) {
    hasClientProgress = true;
    const data = event?.data;
    if (!data) return;

    const value = typeof data.progress === 'number'
      ? data.progress
      : typeof data.loadFraction === 'number'
        ? data.loadFraction * 100
        : typeof data === 'number'
          ? data
          : null;

    if (value !== null) setProgress(value);
  }

  window.addEventListener('message', useProgressEvent);

  window.addEventListener('loadProgress', (event) => {
    const detail = event.detail || {};
    const value = typeof detail.progress === 'number' ? detail.progress : detail.loadFraction * 100;
    if (Number.isFinite(value)) {
      hasClientProgress = true;
      setProgress(value);
    }
  });

  // FiveM postMessage and loadProgress compatibility; fallback demo remains smooth
  // only when no FiveM load event is received.
  setTimeout(() => {
    if (!hasClientProgress) {
      const timer = setInterval(() => {
        if (hasClientProgress) {
          clearInterval(timer);
          return;
        }
        const next = progress < 68 ? progress + 1.2 : progress < 92 ? progress + .45 : progress + .12;
        setProgress(next);
        if (progress >= 99) {
          clearInterval(timer);
          setTimeout(() => setProgress(100), 900);
        }
      }, 120);
    }
  }, 900);

  const messages = Array.isArray(config.loadingMessages) && config.loadingMessages.length
    ? config.loadingMessages
    : ['Loading resources'];

  setInterval(() => {
    message.classList.add('switching');
    setTimeout(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      message.textContent = messages[messageIndex];
      message.classList.remove('switching');
    }, 260);
  }, 3200);

  const video = document.getElementById('backgroundVideo');
  if (config.backgroundVideo) {
    video.src = config.backgroundVideo;
    video.play().then(() => {
      video.classList.add('ready');
    }).catch(() => {
      if (config.backgroundImage) {
        video.removeAttribute('src');
        video.poster = config.backgroundImage;
        video.classList.add('ready');
      }
    });
  } else if (config.backgroundImage) {
    video.poster = config.backgroundImage;
    video.classList.add('ready');
  }

  const audio = new Audio();
  const playButton = document.getElementById('playButton');
  const volume = document.getElementById('volume');

  if (config.music) {
    audio.src = config.music;
    audio.loop = true;
    audio.volume = Number(volume.value) / 100;

    const toggleMusic = () => {
      if (audio.paused) {
        audio.play().then(() => {
          playButton.textContent = 'Ⅱ';
          playButton.setAttribute('aria-label', 'Pause music');
        }).catch(() => {});
      } else {
        audio.pause();
        playButton.textContent = '▶';
        playButton.setAttribute('aria-label', 'Play music');
      }
    };

    playButton.addEventListener('click', toggleMusic);
  } else {
    playButton.disabled = true;
  }

  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value) / 100;
  });
})();
