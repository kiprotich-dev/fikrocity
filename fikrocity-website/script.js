const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

const shelf = document.getElementById('projectShelf');
const projects = Array.isArray(window.FIKROCITY_PROJECTS) ? window.FIKROCITY_PROJECTS : [];

function makeProjectCard(project, index) {
  const card = document.createElement(project.url ? 'a' : 'article');
  card.className = 'project-card';
  card.classList.add('project-card--tone-' + (index % 5));
  if (project.url) {
    card.href = project.url;
    card.target = '_blank';
    card.rel = 'noreferrer';
    card.setAttribute('aria-label', `View ${project.title}`);
  }
  const visual = document.createElement('div');
  visual.className = 'project-visual';
  const orbit = document.createElement('div');
  orbit.className = 'visual-circle';
  const glyph = document.createElement('div');
  glyph.className = 'project-glyph';
  glyph.textContent = project.symbol || 'f·';
  visual.append(orbit, glyph);
  if (project.image) {
    const image = document.createElement('img');
    image.className = 'project-image';
    image.src = project.image;
    image.alt = project.imageAlt || `${project.title} project preview`;
    image.loading = 'lazy';
    image.addEventListener('load', () => card.classList.add('has-image'));
    visual.append(image);
  }
  const top = document.createElement('div');
  top.className = 'project-top';
  const label = document.createElement('span');
  label.textContent = `CASE FILE / ${project.number || String(index + 1).padStart(2, '0')}`;
  const year = document.createElement('span');
  year.textContent = project.year || 'PORTFOLIO';
  top.append(label, year);
  const bottom = document.createElement('div');
  bottom.className = 'project-bottom';
  const info = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = project.title;
  const type = document.createElement('small');
  type.textContent = project.type || 'DIGITAL PRODUCT';
  info.append(title, type);
  const arrow = document.createElement('span');
  arrow.className = 'project-arrow';
  arrow.textContent = project.url ? '↗' : '✳';
  bottom.append(info, arrow);
  card.append(visual, top, bottom);
  return card;
}

if (projects.length) {
  projects.forEach((project, index) => shelf.append(makeProjectCard(project, index)));
} else {
  ['01', '02', '03', '04'].forEach((number, index) => {
    const card = document.createElement('article');
    card.className = 'project-card project-placeholder';
    const visual = document.createElement('div');
    visual.className = 'project-visual';
    const lines = document.createElement('div');
    lines.className = 'placeholder-lines';
    visual.append(lines);
    const top = document.createElement('div');
    top.className = 'project-top';
    const caseNo = document.createElement('span');
    caseNo.textContent = `CASE FILE / ${number}`;
    const reserved = document.createElement('span');
    reserved.textContent = 'RESERVED';
    top.append(caseNo, reserved);
    const bottom = document.createElement('div');
    bottom.className = 'project-bottom';
    const name = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = index === 0 ? 'Your next project' : 'Add a project';
    const type = document.createElement('small');
    type.textContent = 'EDIT projects.js TO ADD YOUR WORK';
    name.append(title, type);
    const badge = document.createElement('span');
    badge.className = 'placeholder-callout';
    badge.textContent = 'ADD';
    bottom.append(name, badge);
    card.append(visual, top, bottom);
    shelf.append(card);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section-top, .work-intro, .manifesto-body, .studio-values, .cap-header, .cap-list article, .process-grid, .project-card').forEach((item) => {
  item.classList.add('reveal');
  observer.observe(item);
});

// Kinetic glass emblem: drag for free rotation, arrows for keyboard control.
const stage = document.getElementById('heroObject');
const sculpture = stage?.querySelector('.sculpture');
const spinToggle = document.getElementById('spinToggle');
const resetObject = document.getElementById('resetObject');
const readout = document.getElementById('orientationReadout');
if (stage && sculpture && spinToggle && resetObject) {
  let pitch = -8;
  let yaw = 24;
  let velocityPitch = 0;
  let velocityYaw = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let autoSpin = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const updateReadout = () => {
    readout.textContent = `X ${String(Math.round(pitch)).padStart(2, '0')}° / Y ${String(Math.round(yaw)).padStart(2, '0')}°`;
  };
  const render = () => {
    sculpture.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(-28deg)`;
    updateReadout();
  };
  const toggleSpin = (enabled) => {
    autoSpin = enabled;
    spinToggle.setAttribute('aria-pressed', String(autoSpin));
    spinToggle.textContent = autoSpin ? 'PAUSE MOTION' : 'RESUME MOTION';
  };
  stage.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = performance.now();
    velocityPitch = 0;
    velocityYaw = 0;
    toggleSpin(false);
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastTime);
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    yaw += dx * 0.65;
    pitch = clamp(pitch - dy * 0.55, -78, 78);
    velocityYaw = dx / dt * 0.65;
    velocityPitch = -dy / dt * 0.55;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;
    render();
  });
  const releasePointer = () => { dragging = false; };
  stage.addEventListener('pointerup', releasePointer);
  stage.addEventListener('pointercancel', releasePointer);
  stage.addEventListener('lostpointercapture', releasePointer);
  stage.addEventListener('keydown', (event) => {
    const amount = event.shiftKey ? 18 : 8;
    if (event.key === 'ArrowLeft') yaw -= amount;
    else if (event.key === 'ArrowRight') yaw += amount;
    else if (event.key === 'ArrowUp') pitch = clamp(pitch - amount, -78, 78);
    else if (event.key === 'ArrowDown') pitch = clamp(pitch + amount, -78, 78);
    else if (event.key.toLowerCase() === 'r') {
      pitch = -8; yaw = 24; velocityPitch = 0; velocityYaw = 0;
      toggleSpin(false);
    } else return;
    event.preventDefault();
    velocityPitch = 0; velocityYaw = 0;
    toggleSpin(false);
    render();
  });
  spinToggle.addEventListener('click', () => toggleSpin(!autoSpin));
  resetObject.addEventListener('click', () => {
    pitch = -8; yaw = 24; velocityPitch = 0; velocityYaw = 0;
    toggleSpin(false);
    render();
  });
  let previousFrame = performance.now();
  const animate = (now) => {
    const dt = Math.min(40, now - previousFrame);
    previousFrame = now;
    if (!dragging) {
      if (autoSpin) yaw += dt * 0.012;
      else {
        pitch += velocityPitch * dt;
        yaw += velocityYaw * dt;
        velocityPitch *= Math.pow(0.92, dt / 16);
        velocityYaw *= Math.pow(0.92, dt / 16);
        if (Math.abs(velocityPitch) < 0.002) velocityPitch = 0;
        if (Math.abs(velocityYaw) < 0.002) velocityYaw = 0;
        pitch = clamp(pitch, -78, 78);
      }
      render();
    }
    requestAnimationFrame(animate);
  };
  toggleSpin(autoSpin);
  render();
  requestAnimationFrame(animate);
}




// FormSubmit receives standard HTML form posts in a hidden frame, keeping visitors on this page.
const inquiryForm = document.getElementById('inquiryForm');
if (inquiryForm) {
  const inquiryStatus = document.getElementById('inquiryStatus');
  const sendButton = inquiryForm.querySelector('button[type="submit"]');
  const submissionFrame = document.querySelector('iframe[name="formsubmitFrame"]');
  const inbox = (window.FIKROCITY_CONTACT_EMAIL || '').trim();
  let pendingSubmission = false;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inbox)) {
    inquiryForm.action = `https://formsubmit.co/${encodeURIComponent(inbox)}`;
  } else {
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      inquiryStatus.textContent = 'The contact inbox is not configured. No message was sent.';
    });
  }
  inquiryForm.addEventListener('submit', () => {
    if (!inbox) return;
    pendingSubmission = true;
    sendButton.disabled = true;
    inquiryStatus.textContent = 'Sending your message…';
  });
  submissionFrame?.addEventListener('load', () => {
    if (!pendingSubmission) return;
    pendingSubmission = false;
    sendButton.disabled = false;
    inquiryForm.reset();
    inquiryStatus.textContent = 'Thanks — your message was submitted. We’ll be in touch soon.';
  });
}
