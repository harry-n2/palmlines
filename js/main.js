document.addEventListener('DOMContentLoaded', () => {
  // ===== ADMIN MODE =====
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'admin') {
    enableAdminMode();
  }

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // ===== COUNT UP =====
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        if (!target) return;
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + '+';
          }
        }, 25);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('[data-count]').forEach(el => {
    if (parseInt(el.dataset.count) > 0) countObserver.observe(el);
  });

  // ===== PARTICLES =====
  initParticles();
});

// Admin Mode Logic
function enableAdminMode() {
  console.log("Admin Mode Activated");
  document.body.classList.add('admin-mode');
  
  // Show toast notification
  const toast = document.createElement('div');
  toast.textContent = "管理者モード: 全ての診断結果を表示中";
  toast.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: var(--navy); color: var(--white);
    padding: 12px 24px; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 9999; font-size: 0.9rem;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// Particle System
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.gold = Math.random() > 0.5;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity += Math.sin(Date.now() * 0.001 + this.x) * 0.003;
      if (this.y < -10) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? 'rgba(201,168,76,' + Math.max(0, this.opacity) + ')'
        : 'rgba(255,255,255,' + Math.max(0, this.opacity * 0.5) + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// FAQ Toggle Global Function
window.toggleFaq = function(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('active'));
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('active');
  }
};
