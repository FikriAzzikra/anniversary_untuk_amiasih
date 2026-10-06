// ====== TANGGAL ANNIVERSARY (format: tahun, bulan-1, tanggal) ======
const ANNIV = new Date(2026, 9, 20); // Oktober = 9

const $ = id => document.getElementById(id);
const music = $('music'), musicBtn = $('musicBtn');
const emojis = ['❤️','💗','💕','🌸','💖'];

/* Hati melayang di background (ringan: hanya 14) */
for (let i = 0; i < 14; i++) {
  const h = document.createElement('span');
  h.className = 'h';
  h.textContent = emojis[i % emojis.length];
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = 14 + Math.random() * 18 + 'px';
  h.style.animationDuration = 12 + Math.random() * 12 + 's';
  h.style.animationDelay = -Math.random() * 20 + 's';
  $('hearts').appendChild(h);
}

/* Foto yang belum diganti -> tampilkan placeholder */
document.querySelectorAll('.ph img').forEach(img => {
  img.addEventListener('error', () => img.classList.add('broken'));
});

/* Musik */
function setMusicLabel() { musicBtn.textContent = music.paused ? '▶ Play Music' : '⏸ Pause Music'; }
function playMusic() { music.play().catch(() => {}).finally(setMusicLabel); }
musicBtn.addEventListener('click', () => { music.paused ? playMusic() : music.pause(); setMusicLabel(); });

/* Buka hadiah */
$('openBtn').addEventListener('click', () => {
  playMusic(); // musik mulai dari klik pengguna, jadi tidak diblokir browser
  musicBtn.hidden = false; setMusicLabel();
  $('opening').classList.add('out');
  setTimeout(() => {
    $('opening').style.display = 'none';
    $('main').hidden = false;
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    document.querySelectorAll('#main > section').forEach(s => s.classList.add('fade'));
    observeSections();
  }, 800);
});

/* Fade-in saat section muncul */
function observeSections() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.fade').forEach(s => io.observe(s));
}

/* Countdown */
function tick() {
  const box = $('countdown'), diff = ANNIV - new Date();
  if (diff <= 0) { box.innerHTML = '<div class="done">Happy Anniversary ❤️</div>'; return; }
  const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24,
        m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
  box.innerHTML = [[d,'hari'],[h,'jam'],[m,'menit'],[s,'detik']]
    .map(([v,l]) => `<div><b>${v}</b><small>${l}</small></div>`).join('');
}
tick(); setInterval(tick, 1000);

/* Surat: buka amplop lalu efek mengetik */
$('envelope').addEventListener('click', () => {
  const env = $('envelope'), letter = $('letter');
  env.classList.add('open');
  setTimeout(() => { env.style.display = 'none'; letter.hidden = false; typeLetter(letter); }, 500);
});
async function typeLetter(letter) {
  const ps = [...letter.querySelectorAll('p')];
  const texts = ps.map(p => p.innerHTML);
  ps.forEach(p => p.innerHTML = '');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (let i = 0; i < ps.length; i++) {
    if (reduce) { ps[i].innerHTML = texts[i]; continue; }
    ps[i].classList.add('typing');
    const parts = texts[i].split(/(<br>)/); // jaga <br> tetap utuh
    let out = '';
    for (const part of parts) {
      if (part === '<br>') { out += part; ps[i].innerHTML = out; continue; }
      for (const ch of part) { out += ch; ps[i].innerHTML = out; await new Promise(r => setTimeout(r, 22)); }
    }
    ps[i].classList.remove('typing');
    await new Promise(r => setTimeout(r, 250));
  }
}

/* Pesan kejutan + hati naik dari bawah */
$('surpriseBtn').addEventListener('click', e => {
  e.currentTarget.style.display = 'none';
  $('final').hidden = false;
  $('final').scrollIntoView({ behavior: 'smooth', block: 'center' });
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('span');
    c.className = 'rise';
    c.textContent = emojis[i % emojis.length];
    c.style.left = Math.random() * 100 + '%';
    c.style.fontSize = 18 + Math.random() * 22 + 'px';
    c.style.animationDelay = Math.random() * 1.2 + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5000);
  }
});