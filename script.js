// ====== Countdown ======
const target = new Date('2025-11-22T11:00:00'); // local time
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown(){
  const now = new Date();
  let diff = target - now;
  if(diff < 0){ // passed
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    clearInterval(countdownInterval);
    return;
  }
  const sec = Math.floor(diff / 1000) % 60;
  const min = Math.floor(diff / (1000*60)) % 60;
  const hr  = Math.floor(diff / (1000*60*60)) % 24;
  const day = Math.floor(diff / (1000*60*60*24));

  daysEl.textContent = String(day).padStart(2,'0');
  hoursEl.textContent = String(hr).padStart(2,'0');
  minutesEl.textContent = String(min).padStart(2,'0');
  secondsEl.textContent = String(sec).padStart(2,'0');
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// ====== Music toggle ======
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let musicOn = false;

musicToggle.addEventListener('click', () => {
  if(!musicOn){
    music.play().catch(()=>{/* play may be blocked until user interacts */});
    musicToggle.textContent = 'Tắt nhạc';
    musicOn = true;
  } else {
    music.pause();
    musicToggle.textContent = 'Bật nhạc';
    musicOn = false;
  }
});

// ====== RSVP button (small animation) ======
const rsvpBtn = document.getElementById('rsvp-btn');
rsvpBtn.addEventListener('click', () => {
  rsvpBtn.textContent = 'Cảm ơn! ✅';
  rsvpBtn.disabled = true;
  setTimeout(()=> {
    rsvpBtn.textContent = 'Đã xác nhận';
  }, 1200);
});

// ====== Wishes (localStorage) ======
const form = document.getElementById('wish-form');
const wishesList = document.getElementById('wishes-list');
const clearBtn = document.getElementById('clear-wishes');

function loadWishes(){
  const raw = localStorage.getItem('za_wishes_v1');
  if(!raw) return [];
  try{
    return JSON.parse(raw);
  }catch(e){
    return [];
  }
}

function saveWishes(arr){
  localStorage.setItem('za_wishes_v1', JSON.stringify(arr));
}

function renderWishes(){
  const arr = loadWishes();
  wishesList.innerHTML = '';
  if(arr.length === 0){
    wishesList.innerHTML = '<div style="color:#666">Chưa có lời chúc nào — mời bạn gửi lời chúc nhé! 💌</div>';
    return;
  }
  arr.slice().reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'wish';
    div.innerHTML = `<div class="who">${escapeHtml(item.name)}</div>
                     <div class="txt">${escapeHtml(item.message)}</div>
                     <div style="font-size:0.75rem;color:#999;margin-top:6px">${new Date(item.time).toLocaleString()}</div>`;
    wishesList.appendChild(div);
  });
}

function escapeHtml(s){
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const msg  = document.getElementById('message').value.trim();
  if(!name || !msg) return;
  const arr = loadWishes();
  arr.push({name, message: msg, time: (new Date()).toISOString()});
  saveWishes(arr);
  form.reset();
  renderWishes();
});

// clear all wishes
clearBtn.addEventListener('click', () => {
  if(confirm('Bạn chắc muốn xóa tất cả lời chúc?')) {
    localStorage.removeItem('za_wishes_v1');
    renderWishes();
  }
});

// initial render
renderWishes();
