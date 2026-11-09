'use strict';
/**
 * Website Ulang Tahun Citra ke-23
 * Vanilla JS — tanpa framework
 *
 * Aturan musik:
 *  - Musik TIDAK diputar saat halaman pertama (surat tertutup) dibuka
 *  - Musik LANGSUNG diputar ketika slide 2 muncul,
 *    yaitu saat surat diklik ("Buka Surat")
 */

/* ================================================================
   LATAR PARTIKEL (canvas background)
   ================================================================ */
(function inisialisasiLatar() {
  const cvs = document.getElementById('bgCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  function resize() {
    cvs.width  = window.innerWidth;
    cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const partikel = [];
  const JUMLAH   = 80;

  for (let i = 0; i < JUMLAH; i++) {
    partikel.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      op: Math.random() * 0.6 + 0.2,
      opDir: (Math.random() > 0.5 ? 1 : -1) * 0.005,
    });
  }

  const WARNA_PARTIKEL = [
    'rgba(139,92,246,', 'rgba(192,132,252,', 'rgba(109,40,217,',
    'rgba(167,139,250,', 'rgba(221,214,254,',
  ];

  function gambar() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    partikel.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.op += p.opDir;
      if (p.op > 0.8 || p.op < 0.1) p.opDir *= -1;
      if (p.x < 0) p.x = cvs.width;
      if (p.x > cvs.width) p.x = 0;
      if (p.y < 0) p.y = cvs.height;
      if (p.y > cvs.height) p.y = 0;

      const warna = WARNA_PARTIKEL[Math.floor(Math.random() * WARNA_PARTIKEL.length)];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = warna + p.op + ')';
      ctx.fill();
    });
    requestAnimationFrame(gambar);
  }
  gambar();
})();

/* ================================================================
   KONFETI
   ================================================================ */
const cvs_k = document.getElementById('konfettiCanvas');
const ctx_k  = cvs_k.getContext('2d');
let partikelK = [];
let konfettiAktif = false;
let timerKonfetti = null;

function resizeKonfetti() {
  cvs_k.width  = window.innerWidth;
  cvs_k.height = window.innerHeight;
}
resizeKonfetti();
window.addEventListener('resize', resizeKonfetti);

function buatPartikelK() {
  const warnaList = [
    '#8B5CF6','#A78BFA','#C084FC','#7C3AED','#DDD6FE',
    '#E9D5FF','#F0ABFC','#FFFFFF',
  ];
  const bentukList = ['bulat','kotak','bintang'];
  return {
    x: Math.random() * cvs_k.width,
    y: -12,
    r: Math.random() * 6 + 3,
    vy: Math.random() * 2.8 + 1.5,
    vx: (Math.random() - 0.5) * 1.5,
    sudut: Math.random() * 360,
    spin: (Math.random() - 0.5) * 6,
    warna: warnaList[Math.floor(Math.random() * warnaList.length)],
    bentuk: bentukList[Math.floor(Math.random() * bentukList.length)],
    op: Math.random() * 0.5 + 0.5,
  };
}

function gambarPartikelK(p) {
  ctx_k.save();
  ctx_k.translate(p.x, p.y);
  ctx_k.rotate(p.sudut * Math.PI / 180);
  ctx_k.globalAlpha = p.op;
  ctx_k.fillStyle   = p.warna;
  if (p.bentuk === 'bulat') {
    ctx_k.beginPath();
    ctx_k.arc(0, 0, p.r, 0, Math.PI * 2);
    ctx_k.fill();
  } else if (p.bentuk === 'kotak') {
    ctx_k.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2);
  } else {
    ctx_k.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5;
      i === 0
        ? ctx_k.moveTo(Math.cos(a) * p.r, Math.sin(a) * p.r)
        : ctx_k.lineTo(Math.cos(a) * p.r, Math.sin(a) * p.r);
    }
    ctx_k.closePath();
    ctx_k.fill();
  }
  ctx_k.restore();
}

function loopKonfetti() {
  ctx_k.clearRect(0, 0, cvs_k.width, cvs_k.height);
  partikelK.forEach((p, i) => {
    p.y += p.vy; p.x += p.vx; p.sudut += p.spin;
    gambarPartikelK(p);
    if (p.y > cvs_k.height + 20) {
      partikelK[i] = konfettiAktif ? buatPartikelK() : null;
    }
  });
  partikelK = partikelK.filter(Boolean);
  if (partikelK.length > 0 || konfettiAktif) requestAnimationFrame(loopKonfetti);
}

function konfetti(durasi = 4500) {
  if (konfettiAktif) return;
  konfettiAktif = true;
  for (let i = 0; i < 160; i++) partikelK.push(buatPartikelK());
  loopKonfetti();
  clearTimeout(timerKonfetti);
  timerKonfetti = setTimeout(() => { konfettiAktif = false; }, durasi);
}

/* ================================================================
   PENGHITUNG WAKTU — HALAMAN 1
   ================================================================ */
const ULTAH_2026 = new Date('2026-11-09T00:00:00');

function hitungSisa() {
  const sekarang  = new Date();
  const selisih   = ULTAH_2026 - sekarang;

  if (selisih <= 0) return null; // sudah tiba atau sudah lewat

  const hari   = Math.floor(selisih / (1000 * 60 * 60 * 24));
  const jam    = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const menit  = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
  const detik  = Math.floor((selisih % (1000 * 60)) / 1000);

  return { hari, jam, menit, detik };
}

function bangunPenghitung() {
  const area = document.getElementById('areaWaktu');
  if (!area) return;

  const sisa = hitungSisa();

  if (!sisa) {
    // Tanggal sudah tiba atau lewat — tampilkan ucapan
    area.innerHTML = `
      <div class="ucapan-waktu">
        <span class="label-hari">✦ HARI INI ✦</span>
        <p class="teks-rayakan">SELAMAT ULANG TAHUN KE-23! 🎂</p>
        <span class="badge-usia">🎉 23 TAHUN 🎉</span>
      </div>`;
    return;
  }

  // Tampilkan penghitung mundur
  area.innerHTML = `
    <div class="penghitung-waktu">
      <div class="pw-unit">
        <div class="pw-angka" id="pw-hari">${String(sisa.hari).padStart(2,'0')}</div>
        <div class="pw-label">Hari</div>
      </div>
      <div class="pw-unit">
        <div class="pw-angka" id="pw-jam">${String(sisa.jam).padStart(2,'0')}</div>
        <div class="pw-label">Jam</div>
      </div>
      <div class="pw-unit">
        <div class="pw-angka" id="pw-menit">${String(sisa.menit).padStart(2,'0')}</div>
        <div class="pw-label">Menit</div>
      </div>
      <div class="pw-unit">
        <div class="pw-angka" id="pw-detik">${String(sisa.detik).padStart(2,'0')}</div>
        <div class="pw-label">Detik</div>
      </div>
    </div>`;

  // Update setiap detik
  const interval = setInterval(() => {
    const s = hitungSisa();
    if (!s) {
      clearInterval(interval);
      bangunPenghitung(); // rebuild menjadi ucapan
      return;
    }
    const elHari  = document.getElementById('pw-hari');
    const elJam   = document.getElementById('pw-jam');
    const elMenit = document.getElementById('pw-menit');
    const elDetik = document.getElementById('pw-detik');
    if (elHari)  elHari.textContent  = String(s.hari).padStart(2,'0');
    if (elJam)   elJam.textContent   = String(s.jam).padStart(2,'0');
    if (elMenit) elMenit.textContent = String(s.menit).padStart(2,'0');
    if (elDetik) elDetik.textContent = String(s.detik).padStart(2,'0');
  }, 1000);
}

/* ================================================================
   TOGGLE MODE GELAP/TERANG
   ================================================================ */
const toggleBtn = document.getElementById('toggleMode');
const iconToggle = document.getElementById('iconToggle');
const htmlElement = document.documentElement;

// Cek preferensi mode dari localStorage
const savedMode = localStorage.getItem('mode-ultah');
if (savedMode === 'terang') {
  document.body.classList.add('mode-terang');
  iconToggle.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('mode-terang');
  
  if (document.body.classList.contains('mode-terang')) {
    iconToggle.textContent = '☀️';
    localStorage.setItem('mode-ultah', 'terang');
  } else {
    iconToggle.textContent = '🌙';
    localStorage.setItem('mode-ultah', 'gelap');
  }
});

/* ================================================================
   AUDIO
   ================================================================ */
const audioEl       = document.getElementById('bgMusic');
const kontrolMusik  = document.getElementById('musikKontrol');
const tombolMusik   = document.getElementById('tombolMusik');
const ikonMusik     = document.getElementById('ikonMusik');
const pengaturVol   = document.getElementById('pengaturVolume');
const tombolSenyap  = document.getElementById('tombolSenyap');
const ikonSenyap    = document.getElementById('ikonSenyap');
const pesanError    = document.getElementById('pesanErrorMusik');
const tombolCobLagi = document.getElementById('tombolCobaLagi');

let musikSudahMulai = false;

audioEl.volume = parseFloat(pengaturVol.value);

function mulaiMusik() {
  if (musikSudahMulai) return;
  audioEl.play()
    .then(() => {
      musikSudahMulai = true;
      kontrolMusik.classList.remove('tersembunyi');
      pesanError.classList.add('tersembunyi');
      ikonMusik.textContent = '⏸';
    })
    .catch(() => {
      pesanError.classList.remove('tersembunyi');
    });
}

tombolMusik.addEventListener('click', () => {
  if (audioEl.paused) {
    audioEl.play()
      .then(() => {
        ikonMusik.textContent = '⏸';
        pesanError.classList.add('tersembunyi');
      })
      .catch(() => pesanError.classList.remove('tersembunyi'));
  } else {
    audioEl.pause();
    ikonMusik.textContent = '▶';
  }
});

tombolSenyap.addEventListener('click', () => {
  audioEl.muted = !audioEl.muted;
  ikonSenyap.textContent = audioEl.muted ? '🔇' : '🔊';
});

pengaturVol.addEventListener('input', () => {
  audioEl.volume = parseFloat(pengaturVol.value);
  if (audioEl.muted && audioEl.volume > 0) {
    audioEl.muted = false;
    ikonSenyap.textContent = '🔊';
  }
  if (audioEl.volume === 0) ikonSenyap.textContent = '🔇';
});

tombolCobLagi.addEventListener('click', mulaiMusik);
audioEl.addEventListener('error', () => {
  if (!musikSudahMulai) pesanError.classList.remove('tersembunyi');
});

/* ================================================================
   NAVIGASI HALAMAN
   ================================================================ */
const TOTAL_HALAMAN = 8;
let halamanAktif = 1;

const indikatorEl    = document.getElementById('indikatorHalaman');
const nomorEl        = document.getElementById('nomorHalaman');
const navBarEl       = document.getElementById('navBar');
const tombolSblmnya  = document.getElementById('tombolSebelumnya');
const tombolLanjutNav = document.getElementById('tombolLanjut');
const titikNavEl     = document.getElementById('titikNav');

// Bangun titik navigasi
for (let i = 1; i <= TOTAL_HALAMAN; i++) {
  const btn = document.createElement('button');
  btn.className = 'titik' + (i === 1 ? ' aktif' : '');
  btn.dataset.hal = i;
  btn.setAttribute('aria-label', 'Halaman ' + i);
  btn.addEventListener('click', () => {
    if (parseInt(btn.dataset.hal) !== halamanAktif) {
      pindah(parseInt(btn.dataset.hal));
    }
  });
  titikNavEl.appendChild(btn);
}

function perbaruiNav() {
  nomorEl.textContent = String(halamanAktif).padStart(2, '0');

  titikNavEl.querySelectorAll('.titik').forEach(t => {
    t.classList.toggle('aktif', parseInt(t.dataset.hal) === halamanAktif);
  });

  tombolSblmnya.disabled     = halamanAktif === 1;
  tombolLanjutNav.disabled   = halamanAktif === TOTAL_HALAMAN;

  if (halamanAktif === 1) {
    navBarEl.classList.add('tersembunyi');
    indikatorEl.classList.add('tersembunyi');
  } else {
    navBarEl.classList.remove('tersembunyi');
    indikatorEl.classList.remove('tersembunyi');
  }
}

function pindah(ke) {
  if (ke < 1 || ke > TOTAL_HALAMAN || ke === halamanAktif) return;

  const dari   = halamanAktif;
  const elDari = document.getElementById('halaman' + dari);
  const elKe   = document.getElementById('halaman' + ke);
  if (!elDari || !elKe) return;

  elDari.classList.remove('halaman--aktif');
  elDari.classList.add('halaman--keluar');
  setTimeout(() => elDari.classList.remove('halaman--keluar'), 600);

  elKe.classList.add('halaman--aktif');
  elKe.scrollTop = 0;
  halamanAktif = ke;

  perbaruiNav();
  padaHalamanAktif(ke);
}

function aksiLanjutCerdas() {
  switch (halamanAktif) {
    case 3:
      if (!kueSelesai) {
        // Tampilkan pesan ringan
        const ks3 = document.getElementById('langkahKue3');
        if (ks3.classList.contains('tersembunyi')) {
          const lks2 = document.getElementById('langkahKue2');
          if (lks2.classList.contains('tersembunyi')) {
            document.getElementById('tombolBuatHarapan').click();
          }
        }
        return;
      }
      pindah(4);
      setTimeout(mulaiNostalgia, 400);
      break;
    case 4:
      pindah(5);
      setTimeout(mulaiHumor, 400);
      break;
    case 6:
      if (!suratSelesai) {
        const kp = document.getElementById('kertasSurat');
        if (kp) kp.scrollTop = kp.scrollHeight;
        return;
      }
      pindah(7);
      setTimeout(inisialisasiHarapan, 400);
      break;
    default:
      pindah(halamanAktif + 1);
      break;
  }
}

function padaHalamanAktif(n) {
  if (n === 2) { mulaiMusik(); }
  if (n === 4 && !nostalgiaJalan) { setTimeout(mulaiNostalgia, 200); }
  if (n === 5 && document.getElementById('daftarHumor').childElementCount === 0) {
    setTimeout(mulaiHumor, 200);
  }
  if (n === 7) { konfetti(5500); }
}

tombolSblmnya.addEventListener('click',   () => pindah(halamanAktif - 1));
tombolLanjutNav.addEventListener('click', () => aksiLanjutCerdas());

perbaruiNav();

/* ================================================================
   HALAMAN 1 — PEMBUKA
   ================================================================ */
const tombolBukaKejutan = document.getElementById('tombolBukaKejutan');

let suratPembukaTerbuka = false;

tombolBukaKejutan.addEventListener('click', () => {
  if (suratPembukaTerbuka) return;
  suratPembukaTerbuka = true;

  const surat = document.getElementById('suratPembuka');
  if (surat) surat.classList.add('terbuka');

  // Dipanggil di klik yang sama supaya browser mengizinkan audio
  mulaiMusik();
  konfetti(2000);

  setTimeout(() => pindah(2), 850);
});

/* ================================================================
   HALAMAN 2 — UCAPAN UTAMA
   ================================================================ */
const tombolLanjutKe3 = document.getElementById('tombolLanjutKe3');
const angka23El       = document.getElementById('angka23');

// Animasi angka 23 saat halaman 2 aktif
function animasiAngka23() {
  if (!angka23El) return;
  angka23El.style.opacity   = '0';
  angka23El.style.transform = 'scale(0.3) rotate(-10deg)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      angka23El.style.transition = 'all 1s cubic-bezier(.34,1.56,.64,1)';
      angka23El.style.opacity    = '1';
      angka23El.style.transform  = 'scale(1) rotate(0deg)';
    });
  });
}

tombolLanjutKe3.addEventListener('click', () => {
  konfetti(3000);
  setTimeout(() => pindah(3), 500);
});

// Observer untuk animasi angka 23 saat halaman 2 muncul
const observer2 = new MutationObserver(mutations => {
  mutations.forEach(m => {
    if (m.target.id === 'halaman2' && m.target.classList.contains('halaman--aktif')) {
      animasiAngka23();
    }
  });
});
const hal2El = document.getElementById('halaman2');
if (hal2El) observer2.observe(hal2El, { attributes: true, attributeFilter: ['class'] });

/* ================================================================
   HALAMAN 3 — KUE ULANG TAHUN
   ================================================================ */
let kueSelesai     = false;
let intervalKedip  = null;

const tombolBuatHarapan = document.getElementById('tombolBuatHarapan');
const tombolTiupLilin   = document.getElementById('tombolTiupLilin');
const langkahKue1       = document.getElementById('langkahKue1');
const langkahKue2       = document.getElementById('langkahKue2');
const langkahKue3       = document.getElementById('langkahKue3');
const nyala1            = document.getElementById('nyala1');
const nyala2            = document.getElementById('nyala2');
const kueEl             = document.getElementById('kue');

tombolBuatHarapan.addEventListener('click', () => {
  langkahKue1.classList.add('tersembunyi');

  // Kilau & konfeti kecil
  konfetti(1800);

  // Lilin berkedip
  let kedip = false;
  intervalKedip = setInterval(() => {
    kedip = !kedip;
    nyala1.style.opacity = kedip ? '0.2' : '1';
    nyala2.style.opacity = kedip ? '0.2' : '1';
  }, 280);

  langkahKue2.classList.remove('tersembunyi');
});

tombolTiupLilin.addEventListener('click', () => {
  clearInterval(intervalKedip);

  // Padamkan nyala
  nyala1.classList.add('padam');
  nyala2.classList.add('padam');

  // Asap
  [document.getElementById('lilin1'), document.getElementById('lilin2')].forEach(lilin => {
    const asap = document.createElement('span');
    asap.className   = 'asap-lilin';
    asap.textContent = '💨';
    lilin.appendChild(asap);
    setTimeout(() => asap.remove(), 1500);
  });

  // Cahaya ungu muncul — efek pada panggung kue
  const panggung = document.querySelector('.panggung-kue');
  if (panggung) {
    panggung.style.filter = 'drop-shadow(0 0 24px rgba(192,132,252,0.8))';
    setTimeout(() => panggung.style.filter = '', 1500);
  }

  // Animasi kue merayakan
  kueEl.classList.add('kue--rayakan');
  setTimeout(() => kueEl.classList.remove('kue--rayakan'), 2200);

  // Konfeti besar
  konfetti(4500);

  langkahKue2.classList.add('tersembunyi');
  langkahKue3.classList.remove('tersembunyi');
  kueSelesai = true;
});

/* ================================================================
   HALAMAN 4 — NOSTALGIA
   ================================================================ */
const TEKS_NOSTALGIA = [
  'Lucu juga ya...',
  'Dulu bisa komunikasi panjang, sekarang malah mas kayak orang bingung cara memulai percakapan😅.',
  'Entah karena kesibukan masing-masing, entah memang waktu membawa kita ke cerita yang berbeda.',
  'Tapi ternyata, ada beberapa orang yang meskipun sudah lama nggak komunikasi, tetap bisa diingat di momen tertentu.',
  'Dan hari ini, kebetulan banget...',
  'Citra lagi ulang tahun.',
  'Jadi, Mas sekalian bikin kejutan kecil.',
  'Tenang, ini bukan pesan yang tiba-tiba minta reuni kok😭',
  'Cuma ucapan ulang tahun, dan doa baik.',
];

const areaNostalgiaEl = document.getElementById('areaNostalgia');
let nostalgiaJalan    = false;

function mulaiNostalgia() {
  if (nostalgiaJalan) return;
  nostalgiaJalan = true;
  areaNostalgiaEl.innerHTML = '';

  const kursor = document.createElement('span');
  kursor.className = 'kursor-ketik';
  areaNostalgiaEl.appendChild(kursor);

  let idx = 0;

  function tampil() {
    if (idx >= TEKS_NOSTALGIA.length) {
      kursor.remove();
      return;
    }
    const p = document.createElement('span');
    p.className   = 'baris-ketik';
    p.textContent = TEKS_NOSTALGIA[idx];
    areaNostalgiaEl.insertBefore(p, kursor);
    areaNostalgiaEl.scrollTop = areaNostalgiaEl.scrollHeight;
    idx++;
    const jeda = Math.min(TEKS_NOSTALGIA[idx - 1].length * 16 + 450, 2300);
    setTimeout(tampil, jeda);
  }

  setTimeout(tampil, 500);
}

/* ================================================================
   HALAMAN 5 — HUMOR
   ================================================================ */
const TEKS_HUMOR = [
  'Selamat datang di usia 23, usia ketika niat tidur cepat sering kalah sama pikiran yang tiba-tiba ramai.',
  'Katanya makin dewasa makin bijak. Tapi kadang masih suka berdiam diri sendirian sambil berpikir "Apa sih yang salah dengan dunia ini?" ',
  'Semoga kedepannya rezekinya lancar, hatinya tenang, dan urusannya nggak makin ribet.',
  '22 tahun sudah berlalu. Semoga kedepannya bukan cuma umur yang bertambah, tapi juga pencapaian dan kebahagiaannya.',
  'Semoga makin cantik, makin bahagia, dan makin sukses.',
  'Kalau ada yang bikin pusing, ingat, Citra sudah bertahan selama 22 tahun lalu. Pasti bisa hadapi apa pun yang datang 💪',
];

const daftarHumorEl = document.getElementById('daftarHumor');

function mulaiHumor() {
  if (daftarHumorEl.childElementCount > 0) return;
  TEKS_HUMOR.forEach((teks, i) => {
    const kartu = document.createElement('div');
    kartu.className = 'kartu-humor';
    kartu.innerHTML = `<p>${teks}</p>`;
    daftarHumorEl.appendChild(kartu);
    setTimeout(() => kartu.classList.add('tampil'), i * 420 + 200);
  });
}

/* ================================================================
   HALAMAN 6 — SURAT
   ================================================================ */
const tutupAmplop    = document.getElementById('tutupAmplop');
const tombolBukaSrt  = document.getElementById('tombolBukaSurat');
const tampilanAmplop = document.getElementById('tampilanAmplop');
const tampilanSurat  = document.getElementById('tampilanSurat');
const isiSuratEl     = document.getElementById('isiSurat');
const kakiSuratEl    = document.getElementById('kakiSurat');

let suratSelesai = false;

const ISI_SURAT = [
  'Selamat ulang tahun yang ke-23, Citra Emalia Putri Syafida Ramadhani! 🎂',
  '',
  'Nggak terasa ya, sekarang sudah 23 tahun aja.',
  '',
  'Semoga di usia yang baru ini, Citra selalu diberikan kesehatan, kebahagiaan, rezeki yang lancar, hati yang tenang, dan banyak hal baik yang datang.',
  '',
  'Semoga semua hal yang selama ini Citra usahakan pelan-pelan menemukan jalannya.',
  '',
  'Semoga Citra semakin dekat dengan hal-hal yang diimpikan, semakin kuat menghadapi hal-hal yang nggak sesuai rencana, dan semakin bahagia dengan kehidupan yang sedang dijalani.',
  '',
  'Semoga kedepannya lebih banyak ketawa daripada nangisnya.',
  'Lebih banyak kabar baik daripada pikiran yang bikin capek.',
  '',
  'BTW...',
  '',
  'Lucu juga ya, Mas sudah lama nggak komunikasi sama Citra, tapi tiba-tiba muncul lagi cuma buat ngucapin ulang tahun.',
  '',
  'Tenang, ini bukan pesan yang punya maksud tersembunyi 😭',
  '',
  'Mas cuma nggak mau melewatkan hari spesial seseorang yang pernah memberi nasihat baik.',
  '',
  'Jadi, meskipun sekarang kita sudah nggak komunikasi, semoga Citra tahu kalau hari ini ada seseorang yang ikut senang melihat Citra sampai di usia 23 tahun.',
  '',
  'Nggak ada tuntutan buat membalas panjang.',
  'Nggak ada maksud bikin suasana jadi canggung.',
  '',
  'Cuma sebuah ucapan sederhana, dan doa baik yang memang pantas Citra dapatkan.',
  '',
  'Semoga 22 tahun lalu menjadi tahun pelajaran yang baik buat Citra.',
  'Semoga semua yang dicari menemukan jalannya.',
  'Semoga Citra selalu punya alasan untuk tersenyum.',
  '',
  'Dan kalau suatu hari nanti kita komunikasi lagi, semoga nggak perlu mulai dari:',
  '"HAI, MASIH INGAT AKU NGGAK?" 😭',
  '',
  'Selamat ulang tahun, Citra!',
  '',
  'Semoga selalu sehat, bahagia, dan dikelilingi hal-hal baik.',
  'Nikmati hari spesial ini.',
  'Semoga banyak hal menyenangkan datang di usia yang baru.',
  '',
  'Dari Mynrrfqi, yang kebetulan muncul lagii awkwkwk😂 . 🎀',
];

tombolBukaSrt.addEventListener('click', () => {
  tutupAmplop.classList.add('terbuka');
  setTimeout(() => {
    tampilanAmplop.classList.add('tersembunyi');
    tampilanSurat.classList.remove('tersembunyi');
    isiSuratEl.innerHTML = '';
    tampilkanSurat();
  }, 780);
});

function tampilkanSurat() {
  let i = 0;
  const kertas = document.getElementById('kertasSurat');

  function lanjut() {
    if (i >= ISI_SURAT.length) {
      kakiSuratEl.classList.remove('tersembunyi');
      konfetti(2200);
      suratSelesai = true;
      return;
    }
    const teks = ISI_SURAT[i];
    if (teks === '') {
      isiSuratEl.appendChild(document.createElement('br'));
    } else {
      const p = document.createElement('p');
      p.textContent = teks;
      isiSuratEl.appendChild(p);
      if (kertas) kertas.scrollTop = kertas.scrollHeight;
    }
    i++;
    const jeda = teks === '' ? 55 : Math.min(teks.length * 9 + 80, 480);
    setTimeout(lanjut, jeda);
  }
  lanjut();
}

/* ================================================================
   INISIALISASI
   ================================================================ */
const tombolUlangi = document.getElementById('tombolUlangi');

tombolUlangi.addEventListener('click', () => {
  // Reset semua state
  kueSelesai     = false;
  suratSelesai   = false;
  nostalgiaJalan = false;
  suratPembukaTerbuka = false;

  const suratPembuka = document.getElementById('suratPembuka');
  if (suratPembuka) suratPembuka.classList.remove('terbuka');

  // Reset kue
  clearInterval(intervalKedip);
  nyala1.classList.remove('padam'); nyala2.classList.remove('padam');
  nyala1.style.opacity = '1';      nyala2.style.opacity = '1';
  langkahKue1.classList.remove('tersembunyi');
  langkahKue2.classList.add('tersembunyi');
  langkahKue3.classList.add('tersembunyi');

  // Reset surat
  tutupAmplop.classList.remove('terbuka');
  tampilanAmplop.classList.remove('tersembunyi');
  tampilanSurat.classList.add('tersembunyi');
  isiSuratEl.innerHTML = '';
  kakiSuratEl.classList.add('tersembunyi');

  // Reset nostalgia, humor
  areaNostalgiaEl.innerHTML = '';
  daftarHumorEl.innerHTML   = '';

  // Kembali ke halaman 1
  const elAktif = document.getElementById('halaman' + halamanAktif);
  if (elAktif) elAktif.classList.remove('halaman--aktif');
  const hal1 = document.getElementById('halaman1');
  if (hal1) hal1.classList.add('halaman--aktif');
  halamanAktif = 1;
  perbaruiNav();

  // Musik TIDAK di-restart, tetap berjalan sesuai state sebelumnya
});

/* ================================================================
   INISIALISASI
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Pastikan hanya halaman 1 aktif
  for (let i = 2; i <= TOTAL_HALAMAN; i++) {
    const el = document.getElementById('halaman' + i);
    if (el) el.classList.remove('halaman--aktif');
  }

  // Bangun penghitung waktu
  bangunPenghitung();

  perbaruiNav();
});
