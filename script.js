/* ===================================================================
   JTC TAX CONSULTANT — script.js
=================================================================== */

(function(){

// ---------- THEME TOGGLE ----------
const body = document.body;
const themeToggleBtn = document.getElementById('jtc-themeToggle');
const THEME_KEY = 'jtc-theme';

function applyTheme(theme){
  if(theme === 'light'){
    body.setAttribute('data-theme','light');
    if(themeToggleBtn) themeToggleBtn.textContent = '🌙';
  }else{
    body.setAttribute('data-theme','dark');
    if(themeToggleBtn) themeToggleBtn.textContent = '☀️';
  }
}

(function initTheme(){
  let saved = null;
  try{ saved = localStorage.getItem(THEME_KEY); }catch(e){}
  applyTheme(saved === 'light' ? 'light' : 'dark');
})();

if(themeToggleBtn){
  themeToggleBtn.addEventListener('click', function(){
    const current = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
    if(window.jtcUpdateSceneTheme) window.jtcUpdateSceneTheme(next);
  });
}

// ---------- MOBILE NAV ----------
const hamburger = document.getElementById('jtc-hamburger');
const navLinks = document.getElementById('jtc-navLinks');
if(hamburger && navLinks){
  hamburger.addEventListener('click', function(){
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ---------- SCROLL PROGRESS + NAV BACKGROUND ----------
window.addEventListener('scroll', function(){
  const el = document.getElementById('jtc-scrollBar');
  const pct = (window.scrollY/(document.body.scrollHeight - window.innerHeight))*100;
  if(el) el.style.width = pct + '%';
  const nav = document.getElementById('jtc-navbar');
  if(nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ---------- FAQ ----------
const faqList = document.getElementById('jtc-faqList');
if(faqList){
  faqList.addEventListener('click', function(e){
    const btn = e.target.closest('.faq-q');
    if(!btn) return;
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(i){ i.classList.remove('open'); });
    if(!isOpen) item.classList.add('open');
  });
}

// ---------- COUNTER ANIMATION ----------
let counted = false;
function checkStats(){
  const el = document.getElementById('jtc-stat1');
  if(!el) return;
  const rect = el.getBoundingClientRect();
  if(rect.top < window.innerHeight && !counted){
    counted = true;
    const s1 = document.getElementById('jtc-stat1');
    const s2 = document.getElementById('jtc-stat2');
    const s3 = document.getElementById('jtc-stat3');
    [{el:s1,val:100},{el:s2,val:98},{el:s3,val:5}].forEach(function(item){
      const suffix = item.el.querySelector('span').textContent;
      let cur = 0;
      const iv = setInterval(function(){
        cur = Math.min(cur + item.val/60, item.val);
        item.el.innerHTML = Math.round(cur) + '<span>' + suffix + '</span>';
        if(cur >= item.val) clearInterval(iv);
      }, 33);
    });
  }
}
window.addEventListener('scroll', checkStats);
checkStats();

// ---------- FORM SUBMIT ----------
window.submitForm = function(){
  const name = document.getElementById('jtc-f-name').value.trim();
  const email = document.getElementById('jtc-f-email').value.trim();
  if(!name || !email){ alert('Please fill in your name and email.'); return; }
  document.getElementById('jtc-successMsg').classList.add('show');
  document.querySelectorAll('#jtc-consultForm input,#jtc-consultForm textarea,#jtc-consultForm select').forEach(function(el){ el.value=''; });
};

// ---------- SCROLL FADE-IN ----------
const obs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, {threshold:.12});
document.querySelectorAll('.why-card,.service-card,.expert-card,.testimonial-card,.workflow-step,.vm-card').forEach(function(el){
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity .55s ease,transform .55s ease';
  obs.observe(el);
});

// ---------- THREE.JS HERO CANVAS ----------
function initHeroScene(){
  const canvas = document.getElementById('jtc-heroCanvas');
  const visual = document.getElementById('jtc-heroVisual');
  if(!canvas || !visual || typeof THREE === 'undefined') return;

  let W = visual.clientWidth || 500;
  let H = visual.clientHeight || 540;

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
  camera.position.z = 6;

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xB71C2B, 1.2);
  dirLight.position.set(5,5,5); scene.add(dirLight);
  const dirLight2 = new THREE.DirectionalLight(0x4f7ef7, .8);
  dirLight2.position.set(-5,3,2); scene.add(dirLight2);
  const pointLight = new THREE.PointLight(0xffffff, .6, 10);
  pointLight.position.set(0,0,3); scene.add(pointLight);

  const navyMat = new THREE.MeshPhongMaterial({color:0x1a3a8f, shininess:60, transparent:true, opacity:.92});
  const redMat = new THREE.MeshPhongMaterial({color:0xB71C2B, shininess:80});
  // Neutral slate (instead of pure white) so the "document" object reads
  // clearly on both the dark hero gradient and the light theme background.
  const neutralMat = new THREE.MeshPhongMaterial({color:0x94a3b8, shininess:40, transparent:true, opacity:.35});

  function createShield(){
    const g = new THREE.Group();
    const body = new THREE.CylinderGeometry(1, 0.5, 1.8, 6, 1, false);
    g.add(new THREE.Mesh(body, navyMat));
    const inner = new THREE.CylinderGeometry(.7, .35, 1.4, 6, 1, false);
    const iMesh = new THREE.Mesh(inner, redMat);
    iMesh.position.y = .1; g.add(iMesh);
    return g;
  }
  function createDoc(){
    const g = new THREE.Group();
    const page = new THREE.BoxGeometry(1.2, 1.6, .06);
    g.add(new THREE.Mesh(page, neutralMat));
    const line = new THREE.BoxGeometry(0.7, .06, .08);
    for(let i=0;i<4;i++){
      const lm = new THREE.Mesh(line, new THREE.MeshPhongMaterial({color:0xCBD5E1, transparent:true, opacity:.35+i*.1}));
      lm.position.y = 0.4 - i*.25; lm.position.z = .05; g.add(lm);
    }
    return g;
  }
  function createCalc(){
    const g = new THREE.Group();
    const body = new THREE.BoxGeometry(1, .4, 1.4);
    g.add(new THREE.Mesh(body, new THREE.MeshPhongMaterial({color:0x0d2355, shininess:60})));
    const btn = new THREE.SphereGeometry(.08, 8, 8);
    for(let r=0;r<3;r++){ for(let c=0;c<3;c++){
      const bBtn = new THREE.Mesh(btn, redMat.clone());
      bBtn.position.set(-0.25+c*.25, 0.22, -0.2+r*.25); g.add(bBtn);
    }}
    return g;
  }
  function createChart(){
    const g = new THREE.Group();
    const bars = [.6,.9,.5,.8,1.0,.75];
    bars.forEach(function(h,i){
      const bar = new THREE.BoxGeometry(.2, h, .2);
      const col = i===4 ? redMat : new THREE.MeshPhongMaterial({color:0x1a3a8f, shininess:40});
      const m = new THREE.Mesh(bar, col);
      m.position.set(-0.6+i*.24, h/2-.3, 0); g.add(m);
    });
    return g;
  }

  const shield = createShield(); shield.scale.setScalar(.85); scene.add(shield);
  const doc = createDoc(); doc.position.set(-2.2,0.5,-.5); doc.rotation.y=.3; doc.rotation.z=-.1; scene.add(doc);
  const calc = createCalc(); calc.position.set(2,.5,-.3); calc.rotation.y=-.4; calc.rotation.x=.3; scene.add(calc);
  const chart = createChart(); chart.position.set(-2,-1.2,-.3); chart.rotation.y=.5; scene.add(chart);

  const pGeom = new THREE.BufferGeometry();
  const pCount = 60;
  const pPos = new Float32Array(pCount*3);
  for(let i=0;i<pCount*3;i++) pPos[i] = (Math.random()-.5)*10;
  pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({color:0xffffff, size:.03, transparent:true, opacity:.4});
  const particles = new THREE.Points(pGeom, pMat);
  scene.add(particles);

  let mx = 0, my = 0;
  visual.addEventListener('mousemove', function(e){
    const r = e.currentTarget.getBoundingClientRect();
    mx = ((e.clientX - r.left)/r.width - .5)*2;
    my = ((e.clientY - r.top)/r.height - .5)*2;
  });

  // Keep the 3D scene correctly sized on resize / orientation change.
  let resizeTimer = null;
  function handleResize(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      W = visual.clientWidth || W;
      H = visual.clientHeight || H;
      renderer.setSize(W, H);
      camera.aspect = W/H;
      camera.updateProjectionMatrix();
    }, 150);
  }
  window.addEventListener('resize', handleResize);

  function animate(){
    requestAnimationFrame(animate);
    const t = Date.now()*.001;
    shield.rotation.y += .005;
    shield.rotation.x = Math.sin(t*.5)*.08;
    doc.rotation.y = .3+Math.sin(t*.7)*.1;
    doc.position.y = .5+Math.sin(t*.6)*.15;
    calc.rotation.y = -.4+Math.sin(t*.5+1)*.1;
    calc.position.y = .5+Math.sin(t*.7+.5)*.12;
    chart.rotation.y = .5+Math.sin(t*.4)*.08;
    chart.position.y = -1.2+Math.sin(t*.5+1)*.1;
    scene.rotation.y += mx*.001;
    scene.rotation.x += (my*.0005 - scene.rotation.x)*.05;
    particles.rotation.y = t*.05;
    renderer.render(scene, camera);
  }
  animate();
}

initHeroScene();

})();
// ============================================================
// BAHASA (toggle Indonesia / English)
// ============================================================
(function() {
  // --- Terjemahan semua teks ---
  const translations = {
    id: {
      // Navbar
      'nav.about': 'Tentang Kami',
      'nav.services': 'Layanan',
      'nav.experts': 'Tim Ahli',
      'nav.faq': 'FAQ',
      'nav.contact': 'Kontak',
      'nav.cta': 'Konsultasi Gratis',
      // Hero
      'hero.badge': 'Mitra Konsultasi Pajak Terpercaya',
      'hero.title': 'Solusi Pajak Profesional<br>Untuk <span>Pertumbuhan Bisnis</span><br>Yang Berkelanjutan',
      'hero.desc': 'Membantu bisnis Anda tetap patuh, mengoptimalkan strategi perpajakan, dan mencapai kesuksesan finansial jangka panjang melalui layanan konsultasi pajak yang ahli.',
      'hero.btn1': '📅 Jadwalkan Konsultasi',
      'hero.btn2': 'Jelajahi Layanan →',
      'hero.metric1': 'Bisnis Telah Dibantu',
      'hero.metric2': 'Kepuasan Klien',
      'hero.metric3': 'Tahun Pengalaman',
      // About
      'about.tag': 'Tentang JTC',
      'about.title': 'Mitra <span>Konsultasi Pajak</span> Terpercaya Anda Sejak 2021',
      'about.desc1': 'JTC Tax Consultant didirikan dengan satu tujuan: memberikan panduan pajak yang andal dan berbasis keahlian kepada bisnis dan individu untuk mendukung pertumbuhan berkelanjutan. Selama lebih dari satu dekade, kami telah membangun keahlian mendalam di seluruh aspek perpajakan Indonesia dan internasional.',
      'about.desc2': 'Tim konsultan pajak bersertifikat kami membawa pengalaman gabungan puluhan tahun di berbagai industri mulai dari UMKM yang baru menapaki kewajiban pajak pertama mereka hingga korporasi multinasional yang merancang struktur lintas batas yang kompleks.',
      'about.visi': 'Visi Kami',
      'about.visi.text': 'Menjadi firma konsultasi pajak paling terpercaya di Indonesia, diakui atas integritas, keahlian, dan hasil nyata bagi klien.',
      'about.misi': 'Misi Kami',
      'about.misi.text': 'Memberikan solusi pajak yang personal dan proaktif untuk melindungi serta mengembangkan kepentingan finansial klien melalui kepatuhan dan perencanaan strategis.',
      // Why
      'why.tag': 'Mengapa JTC',
      'why.title': 'Mengapa Bisnis Memilih <span>JTC Tax Consultant</span>',
      'why.desc': 'Kami melampaui kepatuhan kami menjadi mitra pajak strategis Anda, membantu melihat peluang di mana orang lain hanya melihat kewajiban.',
      'why.card1.title': 'Konsultan Pajak Bersertifikat',
      'why.card1.desc': 'Konsultan kami memegang sertifikasi resmi dan selalu mengikuti perkembangan regulasi sehingga Anda tidak pernah melewatkan kewajiban kepatuhan.',
      'why.card2.title': 'Solusi Pajak yang Personal',
      'why.card2.desc': 'Tidak ada dua bisnis yang sama. Kami merancang strategi yang disesuaikan dengan industri, skala, dan lintasan pertumbuhan spesifik Anda.',
      'why.card3.title': 'Fokus pada Kepatuhan',
      'why.card3.desc': 'Kami mengelola kewajiban pajak Anda secara proaktif untuk menghilangkan sanksi, memastikan kesiapan audit, dan menjaga kepercayaan regulasi.',
      'why.card4.title': 'Respons Cepat',
      'why.card4.desc': 'Masalah pajak yang mendesak membutuhkan perhatian segera. Tim kami memberikan respons yang cepat dan akurat dalam tenggat waktu yang terjamin.',
      'why.card5.title': 'Saran Berorientasi Bisnis',
      'why.card5.desc': 'Kami menerjemahkan hukum pajak yang kompleks menjadi strategi yang jelas dan dapat ditindaklanjuti, selaras langsung dengan tujuan bisnis Anda.',
      'why.card6.title': 'Kemitraan Jangka Panjang',
      'why.card6.desc': 'Kami membangun hubungan, bukan transaksi. Kesuksesan Anda adalah tolok ukur kami, dan kami berinvestasi dalam kesehatan finansial jangka panjang Anda.',
      // Services
      'services.tag': 'Layanan Kami',
      'services.title': 'Layanan <span>Konsultasi Pajak</span> Lengkap',
      'services.desc': 'Dari kepatuhan rutin hingga struktur pajak internasional yang kompleks, kami mencakup setiap dimensi kewajiban pajak Anda.',
      'services.s1': 'Konsultasi Pajak',
      'services.s1.desc': 'Panduan strategis mengenai implikasi pajak atas keputusan bisnis, transaksi, dan restrukturisasi perusahaan.',
      'services.s2': 'Perencanaan Pajak',
      'services.s2.desc': 'Strategi proaktif dan berorientasi masa depan untuk meminimalkan beban pajak sambil tetap menjaga kepatuhan penuh.',
      'services.s3': 'Kepatuhan Pajak',
      'services.s3.desc': 'Persiapan dan pelaporan semua SPT pajak secara akurat dan tepat waktu korporasi, PPN, PPh pemotongan, dan lainnya.',
      'services.s4': 'Pendampingan Pemeriksaan Pajak',
      'services.s4.desc': 'Representasi dan dukungan ahli sepanjang proses pemeriksaan DJP, mulai dari dokumentasi hingga penyelesaian sengketa.',
      'services.s5': 'Reviu Pajak',
      'services.s5.desc': 'Reviu diagnostik komprehensif atas posisi pajak Anda untuk mengidentifikasi risiko, eksposur, dan peluang penghematan.',
      'services.s6': 'Konsultasi Keuangan',
      'services.s6.desc': 'Membantu perusahaan mengelola keuangan secara lebih efektif melalui analisis laporan keuangan, perencanaan anggaran, pengelolaan arus kas, dan pengambilan keputusan bisnis yang tepat.',
      'services.s7': 'Pajak Internasional',
      'services.s7.desc': 'Perencanaan pajak lintas batas, optimalisasi tax treaty, dan strukturisasi untuk perusahaan penanaman modal asing.',
      'services.s8': 'Penyelesaian Sengketa Pajak',
      'services.s8.desc': 'Penanganan profesional atas keberatan, banding, dan sengketa pajak administratif di hadapan otoritas dan pengadilan pajak.',
      'services.arrow': 'Pelajari lebih lanjut →',
      // Workflow
      'workflow.tag': 'Proses Kami',
      'workflow.title': 'Bagaimana Kami <span>Memberikan Hasil</span>',
      'workflow.desc': 'Model keterlibatan yang terstruktur dan transparan, dari kontak pertama hingga pemantauan berkelanjutan.',
      'workflow.step1': 'Konsultasi',
      'workflow.step1.desc': 'Memahami struktur bisnis, riwayat pajak, dan tujuan utama Anda',
      'workflow.step2': 'Analisis',
      'workflow.step2.desc': 'Reviu mendalam atas laporan keuangan, status kepatuhan, dan eksposur pajak',
      'workflow.step3': 'Strategi',
      'workflow.step3.desc': 'Menyusun peta jalan optimasi pajak yang disesuaikan dan patuh regulasi',
      'workflow.step4': 'Implementasi',
      'workflow.step4.desc': 'Melaksanakan pelaporan, restrukturisasi, dan dokumentasi dengan presisi',
      'workflow.step5': 'Pemantauan',
      'workflow.step5.desc': 'Reviu berkelanjutan dan penyesuaian proaktif agar Anda selalu selangkah lebih maju',
      // Stats
      'stats.label1': 'Klien Telah Dibantu',
      'stats.label2': 'Kepuasan Klien',
      'stats.label3': 'Tahun Pengalaman',
      'stats.label4': 'Dukungan Profesional',
      // Experts
      'experts.tag': 'Tim Kami',
      'experts.title': 'Kenali Para <span>Ahli Pajak</span> Kami',
      'experts.desc': 'Profesional bersertifikat dengan keahlian mendalam dan komitmen penuh terhadap keberhasilan finansial Anda.',
      // FAQ
      'faq.tag': 'FAQ',
      'faq.title': 'Pertanyaan yang <span>Sering Diajukan</span>',
      'faq.q1': 'Bisnis apa saja yang dilayani oleh JTC Tax Consultant?',
      'faq.a1': 'JTC melayani bisnis dari semua skala mulai dari startup dan UMKM hingga korporasi besar dan perusahaan penanaman modal asing di berbagai industri utama termasuk manufaktur, teknologi, ritel, kesehatan, dan logistik.',
      'faq.q2': 'Seberapa cepat JTC dapat merespons urusan pajak yang mendesak?',
      'faq.a2': 'Untuk urusan mendesak, tim kami memberikan respons awal dalam waktu 4 jam pada hari kerja. Kami menawarkan dukungan 24/7 untuk batas waktu kepatuhan kritis dan situasi pemeriksaan agar Anda tidak pernah dibiarkan tanpa panduan.',
      'faq.q3': 'Bagaimana proses memulai konsultasi pajak dengan JTC?',
      'faq.a3': 'Cukup kirimkan permintaan konsultasi melalui website kami atau hubungi kantor kami. Kami akan menjadwalkan sesi discovery awal untuk memahami kebutuhan Anda, dilanjutkan dengan proposal terperinci yang menguraikan pendekatan yang kami rekomendasikan beserta struktur biaya.',
      'faq.q4': 'Apakah JTC menangani urusan pajak internasional untuk perusahaan asing?',
      'faq.a4': 'Ya, tim pajak internasional kami mengkhususkan diri dalam perencanaan pajak lintas batas, penerapan tax treaty, dan kepatuhan bagi perusahaan penanaman modal asing yang beroperasi di Indonesia.',
      'faq.q5': 'Di industri apa JTC memiliki keahlian pajak yang paling mendalam?',
      'faq.a5': 'Keahlian terdalam kami mencakup manufaktur, perdagangan, teknologi, jasa keuangan, properti, dan F&B. Namun, konsultan bersertifikat kami terlatih untuk menangani urusan pajak di semua industri yang diatur di Indonesia.',
      // Consultation
      'consult.tag': 'Mulai Sekarang',
      'consult.title': 'Jadwalkan <span>Konsultasi Gratis</span> Anda',
      'consult.desc': 'Ceritakan bisnis dan kebutuhan pajak Anda. Tim ahli kami siap menghubungi Anda dalam 24 jam.',
      'consult.name': 'Nama Lengkap *',
      'consult.email': 'Alamat Email *',
      'consult.phone': 'Nomor Telepon *',
      'consult.company': 'Nama Perusahaan',
      'consult.service': 'Layanan yang Dibutuhkan',
      'consult.service.placeholder': 'Pilih layanan...',
      'consult.message': 'Pesan',
      'consult.message.placeholder': 'Ceritakan situasi pajak Anda atau hal yang ingin Anda diskusikan...',
      'consult.submit': '📅 Jadwalkan Konsultasi Gratis via WhatsApp',
      'consult.success': '✅ Permintaan konsultasi Anda telah terkirim! Kami akan menghubungi Anda melalui WhatsApp dalam 24 jam.',
      // Contact
      'contact.tag': 'Hubungi Kami',
      'contact.title': 'Hubungi <span>Kami</span>',
      'contact.address': 'Alamat Kantor',
      'contact.address.val': 'World Trade Centre 5, Level 11<br>Jl. Jenderal Sudirman, RT.8/RW.3<br>Karet Kuningan, Setiabudi<br>Jakarta Selatan 12930',
      'contact.phone': 'Telepon',
      'contact.phone.val': '+62 21 5790 1234<br>+62 812 1234 5678',
      'contact.email': 'Email',
      'contact.email.val': 'info@jtctax.co.id<br>consult@jtctax.co.id',
      'contact.hours': 'Jam Operasional',
      'contact.hours.val': 'Senin – Jumat: 08.00 – 17.00<br>Sabtu: 09.00 – 14.00',
      'contact.form.title': 'Kirim Pesan',
      'contact.form.name': 'Nama Lengkap',
      'contact.form.email': 'Email',
      'contact.form.subject': 'Subjek',
      'contact.form.subject.placeholder': 'Bagaimana kami bisa membantu?',
      'contact.form.message': 'Pesan',
      'contact.form.message.placeholder': 'Pesan Anda...',
      'contact.form.submit': '💬 Kirim via WhatsApp',
      // Footer
      'footer.brand': 'Layanan konsultasi pajak profesional yang membantu bisnis mencapai pertumbuhan berkelanjutan melalui perencanaan pajak strategis dan manajemen kepatuhan yang ahli.',
      'footer.quicklinks': 'Tautan Cepat',
      'footer.services': 'Layanan',
      'footer.contact': 'Kontak',
      'footer.copyright': '© 2025 JTC Tax Consultant. Hak cipta dilindungi undang-undang. | Dibangun dengan penuh keunggulan.',
      'footer.policy': 'Kebijakan Privasi · Syarat Layanan · Kebijakan Cookie',
      //Kepatuhan pajak
      'compliance.hero.title': 'Apa itu Kepatuhan Pajak?',
      'compliance.hero.desc': 'Kepatuhan Pajak adalah layanan yang membantu wajib pajak memenuhi seluruh kewajiban perpajakan secara tepat waktu, akurat, dan sesuai dengan peraturan yang berlaku. Dengan dukungan tim profesional, kami memastikan seluruh proses administrasi dan pelaporan pajak berjalan lancar sehingga Anda dapat fokus pada pengembangan bisnis.',
      'compliance.hero.li1': 'Pelaporan pajak yang tepat waktu dan sesuai ketentuan.',
      'compliance.hero.li2': 'Perhitungan pajak yang akurat dan terdokumentasi dengan baik.',
      'compliance.hero.li3': 'Mengurangi risiko sanksi akibat kesalahan administrasi perpajakan.',
      'compliance.services.title': 'Layanan Kepatuhan <span>Pajak yang Kami Layani</span>',
      'compliance.s1.title': 'Perhitungan Pajak',
      'compliance.s1.desc': 'Membantu menghitung kewajiban perpajakan perusahaan maupun individu secara akurat sesuai peraturan yang berlaku.',
      'compliance.s2.title': 'Pelaporan SPT Masa',
      'compliance.s2.desc': 'Penyusunan dan pelaporan SPT Masa PPN, PPh Pasal 21, PPh Pasal 23, serta jenis pajak lainnya secara tepat waktu.',
      'compliance.s3.title': 'Pelaporan SPT Tahunan',
      'compliance.s3.desc': 'Pendampingan penyusunan dan pelaporan SPT Tahunan Badan maupun Orang Pribadi sesuai ketentuan perpajakan.',
      'compliance.s4.title': 'Rekonsiliasi Pajak',
      'compliance.s4.desc': 'Pemeriksaan dan pencocokan data keuangan dengan laporan perpajakan untuk memastikan konsistensi dan akurasi.',
      'compliance.s5.title': 'Review Kepatuhan Pajak',
      'compliance.s5.desc': 'Evaluasi terhadap pelaksanaan kewajiban perpajakan guna mengidentifikasi potensi risiko dan area perbaikan.',
      'compliance.s6.title': 'Administrasi dan Dokumentasi Pajak',
      'compliance.s6.desc': 'Pengelolaan dokumen perpajakan secara sistematis untuk mendukung kepatuhan dan kesiapan menghadapi pemeriksaan.',
      'compliance.cta.title': 'Siap Mendapatkan Konsultasi Pajak Strategis?',
      'compliance.cta.desc': 'Jangan biarkan keputusan bisnis Anda terhambat oleh ketidakpastian pajak. Tim ahli kami siap membantu Anda mengoptimalkan posisi pajak dengan strategi yang terbukti efektif.',
      'compliance.cta.btn1': '📅 Jadwalkan Konsultasi Gratis',
      'compliance.cta.btn2': '← Kembali ke Layanan',
      //Konsultasi keuangan
      'finance.hero.title': 'Apa itu Konsultasi Keuangan?',
      'finance.hero.desc': 'Konsultasi Keuangan adalah layanan profesional yang membantu perusahaan dan individu mengelola kondisi keuangan secara lebih efektif, terukur, dan berkelanjutan. Kami memberikan analisis, rekomendasi, dan strategi keuangan yang mendukung pertumbuhan bisnis, efisiensi operasional, serta pengambilan keputusan yang lebih tepat.',
      'finance.hero.li1': 'Analisis kesehatan dan kinerja keuangan perusahaan.',
      'finance.hero.li2': 'Perencanaan keuangan untuk mendukung pertumbuhan bisnis.',
      'finance.hero.li3': 'Strategi pengelolaan arus kas dan investasi yang optimal.',
      'finance.services.title': 'Layanan <span>Konsultasi Keuangan</span>',
      'finance.service1.title': 'Analisis Laporan Keuangan',
      'finance.service1.desc': 'Menelaah laporan keuangan untuk mengevaluasi kinerja, profitabilitas, likuiditas, dan kondisi keuangan perusahaan.',
      'finance.service2.title': 'Perencanaan Anggaran',
      'finance.service2.desc': 'Membantu menyusun anggaran yang efektif guna mendukung pengendalian biaya dan pencapaian target bisnis.',
      'finance.service3.title': 'Manajemen Arus Kas',
      'finance.service3.desc': 'Memberikan strategi pengelolaan cash flow agar operasional bisnis tetap berjalan dengan lancar dan sehat.',
      'finance.service4.title': 'Analisis Investasi',
      'finance.service4.desc': 'Mengevaluasi peluang investasi dan memberikan rekomendasi berdasarkan tingkat risiko dan potensi keuntungan.',
      'finance.service5.title': 'Perencanaan Keuangan Bisnis',
      'finance.service5.desc': 'Menyusun strategi keuangan jangka pendek maupun jangka panjang untuk mendukung pertumbuhan usaha.',
      'finance.service6.title': 'Pengambilan Keputusan Finansial',
      'finance.service6.desc': 'Memberikan pertimbangan dan rekomendasi keuangan untuk membantu manajemen mengambil keputusan yang lebih tepat.',
      'finance.cta.title': 'Siap Mendapatkan Konsultasi Keuangan Strategis?',
      'finance.cta.desc': 'Jangan biarkan keputusan bisnis Anda terhambat oleh ketidakpastian keuangan. Tim ahli kami siap membantu Anda mengoptimalkan strategi keuangan dengan pendekatan yang terbukti efektif.',
      'finance.back': '← Kembali ke Layanan',
      //konsultan pajak
      'taxconsult.hero.title': 'Apa itu Konsultasi Pajak?',
      'taxconsult.hero.desc': 'Konsultasi Pajak adalah layanan strategis yang dirancang untuk membantu bisnis memahami implikasi pajak dari setiap keputusan bisnis yang mereka buat. Dari transaksi sederhana hingga restrukturisasi kompleks, tim ahli kami memberikan wawasan mendalam tentang posisi pajak Anda',
      'taxconsult.hero.li1': 'Analisis pajak sebelum keputusan bisnis penting.',
      'taxconsult.hero.li2': 'Strategi perpajakan yang efisien dan compliant.',
      'taxconsult.hero.li3': 'Mitigasi risiko sengketa dan pemeriksaan pajak.',
      'taxconsult.services.title': 'Jenis Konsultasi <span>yang Kami Layani</span>',
      'taxconsult.service1.title': 'Konsultasi Transaksi Bisnis',
      'taxconsult.service1.desc': 'Konsultasi tentang implikasi pajak dari penjualan aset, merger & acquisition, dan transaksi bisnis lainnya.',
      'taxconsult.service2.title': 'Konsultasi Restrukturisasi Perusahaan',
      'taxconsult.service2.desc': 'Panduan tentang konsekuensi pajak dari reorganisasi perusahaan, pemisahan, penggabungan, dan kegiatan serupa.',
      'taxconsult.service3.title': 'Konsultasi Keputusan Investasi',
      'taxconsult.service3.desc': 'Analisis pajak mendalam tentang implikasi pajak dari keputusan investasi dan pembiayaan Anda.',
      'taxconsult.cta.title': 'Siap Mendapatkan Konsultasi Pajak Strategis?',
      'taxconsult.cta.desc': 'Jangan biarkan keputusan bisnis Anda terhambat oleh ketidakpastian pajak. Tim ahli kami siap membantu Anda mengoptimalkan posisi pajak dengan strategi yang terbukti efektif.',
      'taxconsult.back': '← Kembali ke Layanan',
      // International Tax - Pajak Internasional
      'inttax.hero.title': 'Apa itu Pajak Internasional?',
      'inttax.hero.desc': 'Pajak Internasional adalah layanan konsultasi dan pendampingan yang membantu perusahaan mengelola kewajiban perpajakan atas transaksi lintas negara. Kami membantu memastikan kepatuhan terhadap regulasi domestik maupun internasional, meminimalkan risiko pajak berganda, serta mengoptimalkan struktur transaksi global secara legal dan efisien.',
      'inttax.hero.li1': 'Analisis perpajakan atas transaksi lintas negara.',
      'inttax.hero.li2': 'Pemanfaatan tax treaty untuk menghindari pajak berganda.',
      'inttax.hero.li3': 'Mitigasi risiko perpajakan internasional dan kepatuhan global.',
      'inttax.services.title': 'Layanan <span>Pajak Internasional</span>',
      'inttax.service1.title': 'Konsultasi Transaksi Internasional',
      'inttax.service1.desc': 'Memberikan analisis perpajakan atas transaksi ekspor, impor, jasa lintas negara, dan aktivitas bisnis internasional lainnya.',
      'inttax.service2.title': 'Penerapan Tax Treaty',
      'inttax.service2.desc': 'Membantu pemanfaatan Perjanjian Penghindaran Pajak Berganda (P3B) untuk memperoleh perlakuan pajak yang sesuai.',
      'inttax.service3.title': 'Analisis Permanent Establishment',
      'inttax.service3.desc': 'Menilai potensi Bentuk Usaha Tetap (BUT) dan implikasi perpajakannya bagi perusahaan yang beroperasi lintas negara.',
      'inttax.service4.title': 'Withholding Tax Advisory',
      'inttax.service4.desc': 'Memberikan panduan terkait pemotongan pajak atas pembayaran kepada pihak luar negeri sesuai ketentuan yang berlaku.',
      'inttax.service5.title': 'Struktur Investasi Internasional',
      'inttax.service5.desc': 'Membantu merancang struktur investasi dan pendanaan internasional yang efisien serta sesuai regulasi perpajakan.',
      'inttax.service6.title': 'Pendampingan Sengketa Pajak Internasional',
      'inttax.service6.desc': 'Memberikan dukungan dalam penyelesaian permasalahan perpajakan internasional, termasuk sengketa yang melibatkan yurisdiksi berbeda.',
      'inttax.cta.title': 'Siap Mendapatkan Konsultasi Pajak Internasional?',
      'inttax.cta.desc': 'Jangan biarkan transaksi lintas negara Anda terhambat oleh ketidakpastian pajak. Tim ahli kami siap membantu Anda mengoptimalkan strategi pajak internasional dengan pendekatan yang terbukti efektif.',
      'inttax.back': '← Kembali ke Layanan',
      //Pendampingan pajak
      'audit.hero.title': 'Apa itu Pendampingan Pemeriksaan Pajak?',
      'audit.hero.desc': 'Pendampingan Pemeriksaan Pajak adalah layanan profesional yang membantu wajib pajak menghadapi proses pemeriksaan oleh otoritas pajak. Kami mendampingi setiap tahapan pemeriksaan, mulai dari persiapan dokumen, pemberian klarifikasi, hingga pembahasan hasil pemeriksaan untuk memastikan hak dan kewajiban perpajakan Anda terlindungi dengan baik.',
      'audit.hero.li1': 'Persiapan dokumen dan data pendukung pemeriksaan.',
      'audit.hero.li2': 'Pendampingan selama proses pemeriksaan pajak berlangsung.',
      'audit.hero.li3': 'Mitigasi risiko koreksi dan sengketa pajak.',
      'audit.services.title': 'Layanan Pendampingan <span>Pemeriksaan Pajak</span>',
      'audit.service1.title': 'Persiapan Pemeriksaan Pajak',
      'audit.service1.desc': 'Membantu menyiapkan dokumen, laporan keuangan, dan data perpajakan yang diperlukan selama proses pemeriksaan.',
      'audit.service2.title': 'Review Dokumen Pajak',
      'audit.service2.desc': 'Melakukan penelaahan terhadap dokumen dan transaksi untuk mengidentifikasi potensi risiko koreksi pajak.',
      'audit.service3.title': 'Pendampingan Klarifikasi',
      'audit.service3.desc': 'Mendampingi wajib pajak dalam memberikan penjelasan dan klarifikasi kepada pemeriksa pajak.',
      'audit.service4.title': 'Pembahasan Temuan Pemeriksaan',
      'audit.service4.desc': 'Memberikan analisis dan argumentasi atas hasil temuan pemeriksa untuk memastikan perlakuan pajak yang tepat.',
      'audit.service5.title': 'Pendampingan Closing Conference',
      'audit.service5.desc': 'Mendampingi wajib pajak dalam pembahasan akhir hasil pemeriksaan sebelum diterbitkannya ketetapan pajak.',
      'audit.service6.title': 'Tindak Lanjut Hasil Pemeriksaan',
      'audit.service6.desc': 'Memberikan rekomendasi dan strategi atas hasil pemeriksaan, termasuk persiapan keberatan atau upaya hukum lainnya jika diperlukan.',
      'audit.cta.title': 'Siap Mendapatkan Pendampingan Pemeriksaan Pajak?',
      'audit.cta.desc': 'Jangan biarkan proses pemeriksaan pajak mengganggu bisnis Anda. Tim ahli kami siap mendampingi Anda setiap tahapan untuk memastikan hak dan kewajiban perpajakan Anda terlindungi dengan baik.',
      'audit.back': '← Kembali ke Layanan',
      //penyelesaian sangketa pajak
      'dispute.hero.title': 'Apa itu Penyelesaian Sengketa Pajak?',
      'dispute.hero.desc': 'Penyelesaian Sengketa Pajak adalah layanan pendampingan profesional yang membantu wajib pajak dalam menghadapi perselisihan dengan otoritas pajak. Kami memberikan dukungan mulai dari analisis kasus, penyusunan argumentasi perpajakan, hingga pendampingan dalam proses keberatan, banding, dan gugatan untuk melindungi hak serta kepentingan wajib pajak.',
      'dispute.hero.li1': 'Pendampingan pada proses keberatan, banding, dan gugatan pajak.',
      'dispute.hero.li2': 'Penyusunan strategi dan argumentasi perpajakan yang kuat.',
      'dispute.hero.li3': 'Representasi profesional dalam proses sengketa perpajakan.',
      'dispute.services.title': 'Layanan <span>Penyelesaian Sengketa Pajak</span>',
      'dispute.service1.title': 'Keberatan Pajak',
      'dispute.service1.desc': 'Membantu penyusunan dan pengajuan surat keberatan atas hasil pemeriksaan atau ketetapan pajak yang diterbitkan oleh otoritas pajak.',
      'dispute.service2.title': 'Banding Pajak',
      'dispute.service2.desc': 'Memberikan pendampingan dalam proses banding di Pengadilan Pajak untuk memperjuangkan hak dan kepentingan wajib pajak.',
      'dispute.service3.title': 'Gugatan Pajak',
      'dispute.service3.desc': 'Mendampingi wajib pajak dalam mengajukan gugatan atas tindakan atau keputusan perpajakan yang dianggap merugikan.',
      'dispute.service4.title': 'Analisis Sengketa Pajak',
      'dispute.service4.desc': 'Melakukan kajian menyeluruh terhadap pokok sengketa untuk menentukan strategi penyelesaian yang efektif dan tepat.',
      'dispute.service5.title': 'Penyusunan Dokumen dan Bukti',
      'dispute.service5.desc': 'Membantu menyiapkan dokumen, data pendukung, dan argumentasi hukum perpajakan yang diperlukan selama proses sengketa.',
      'dispute.service6.title': 'Pendampingan Persidangan',
      'dispute.service6.desc': 'Memberikan representasi dan pendampingan profesional selama proses persidangan di Pengadilan Pajak hingga sengketa memperoleh putusan.',
      'dispute.cta.title': 'Siap Mendapatkan Bantuan Penyelesaian Sengketa Pajak?',
      'dispute.cta.desc': 'Jangan biarkan sengketa pajak mengganggu bisnis Anda. Tim ahli kami siap membantu Anda melalui setiap tahapan proses sengketa untuk melindungi hak dan kepentingan perpajakan Anda.',
      'dispute.back': '← Kembali ke Layanan',
      //perencanaan pajak
      'taxplan.hero.title': 'Apa itu Perencanaan Pajak?',
      'taxplan.hero.desc': 'Perencanaan Pajak adalah proses strategis untuk mengelola kewajiban perpajakan secara efisien dengan tetap mematuhi peraturan yang berlaku. Melalui perencanaan yang tepat, bisnis dapat mengoptimalkan beban pajak, meningkatkan efisiensi keuangan, dan mendukung pertumbuhan usaha secara berkelanjutan.',
      'taxplan.hero.li1': 'Optimalisasi kewajiban pajak sesuai ketentuan yang berlaku.',
      'taxplan.hero.li2': 'Perencanaan transaksi yang lebih efisien dari sisi perpajakan.',
      'taxplan.hero.li3': 'Meningkatkan kepatuhan sekaligus mengurangi risiko pajak di masa depan.',
      'taxplan.services.title': 'Jenis Perencanaan <span>Pajak yang Kami Layani</span>',
      'taxplan.service1.title': 'Perencanaan Pajak Perusahaan',
      'taxplan.service1.desc': 'Menyusun strategi perpajakan yang efektif untuk mengoptimalkan kewajiban pajak perusahaan dan mendukung tujuan bisnis jangka panjang.',
      'taxplan.service2.title': 'Perencanaan Transaksi',
      'taxplan.service2.desc': 'Analisis dan perancangan struktur transaksi bisnis agar lebih efisien dari sisi perpajakan tanpa mengabaikan kepatuhan terhadap regulasi.',
      'taxplan.service3.title': 'Perencanaan Investasi',
      'taxplan.service3.desc': 'Memberikan solusi perpajakan untuk berbagai pilihan investasi sehingga menghasilkan manfaat finansial yang optimal.',
      'taxplan.service4.title': 'Perencanaan Pajak Internasional',
      'taxplan.service4.desc': 'Pendampingan terkait transaksi lintas negara, pemanfaatan tax treaty, dan pengelolaan kewajiban pajak internasional.',
      'taxplan.service5.title': 'Perencanaan Pajak Karyawan',
      'taxplan.service5.desc': 'Membantu menyusun skema remunerasi dan tunjangan yang lebih efisien dari sisi perpajakan bagi perusahaan dan karyawan.',
      'taxplan.service6.title': 'Review dan Evaluasi Tax Planning',
      'taxplan.service6.desc': 'Meninjau strategi perpajakan yang telah diterapkan untuk memastikan efektivitas, efisiensi, dan kesesuaiannya dengan regulasi terbaru.',
      'taxplan.cta.title': 'Siap Mendapatkan Perencanaan Pajak Strategis?',
      'taxplan.cta.desc': 'Jangan biarkan keputusan bisnis Anda terhambat oleh ketidakpastian pajak. Tim ahli kami siap membantu Anda mengoptimalkan posisi pajak dengan strategi yang terbukti efektif.',
      'taxplan.back': '← Kembali ke Layanan',
      //reviu pajak
      // Tax Review - Reviu Pajak
      'taxreview.hero.title': 'Apa itu Reviu Pajak?',
      'taxreview.hero.desc': 'Reviu Pajak adalah layanan evaluasi menyeluruh terhadap kepatuhan dan posisi perpajakan perusahaan untuk mengidentifikasi potensi risiko, kesalahan pelaporan, maupun peluang perbaikan. Melalui reviu yang sistematis, kami membantu memastikan bahwa kewajiban perpajakan telah dilaksanakan sesuai dengan peraturan yang berlaku.',
      'taxreview.hero.li1': 'Identifikasi risiko dan potensi koreksi pajak.',
      'taxreview.hero.li2': 'Evaluasi kepatuhan terhadap peraturan perpajakan.',
      'taxreview.hero.li3': 'Rekomendasi perbaikan untuk meminimalkan risiko di masa depan.',
      'taxreview.services.title': 'Layanan <span>Reviu Pajak</span>',
      'taxreview.service1.title': 'Reviu Kepatuhan Pajak',
      'taxreview.service1.desc': 'Evaluasi terhadap pemenuhan kewajiban perpajakan perusahaan untuk memastikan kesesuaian dengan peraturan yang berlaku.',
      'taxreview.service2.title': 'Reviu SPT Masa dan Tahunan',
      'taxreview.service2.desc': 'Pemeriksaan atas pelaporan pajak untuk mengidentifikasi potensi kesalahan, kekurangan, maupun risiko koreksi.',
      'taxreview.service3.title': 'Reviu Transaksi Perpajakan',
      'taxreview.service3.desc': 'Analisis perlakuan pajak atas transaksi bisnis untuk memastikan penerapan ketentuan perpajakan yang tepat.',
      'taxreview.service4.title': 'Rekonsiliasi Fiskal',
      'taxreview.service4.desc': 'Penelaahan perbedaan antara laporan keuangan komersial dan fiskal guna memastikan akurasi perhitungan pajak.',
      'taxreview.service5.title': 'Identifikasi Risiko Pajak',
      'taxreview.service5.desc': 'Mengidentifikasi area yang berpotensi menimbulkan sengketa, pemeriksaan, atau sanksi perpajakan di kemudian hari.',
      'taxreview.service6.title': 'Rekomendasi Perbaikan',
      'taxreview.service6.desc': 'Memberikan rekomendasi strategis untuk meningkatkan kepatuhan, efisiensi, dan pengelolaan pajak perusahaan.',
      'taxreview.cta.title': 'Siap Melakukan Reviu Pajak Perusahaan?',
      'taxreview.cta.desc': 'Jangan biarkan risiko pajak mengganggu bisnis Anda. Tim ahli kami siap membantu Anda mengevaluasi posisi perpajakan dan memberikan rekomendasi perbaikan yang strategis.',
      'taxreview.back': '← Kembali ke Layanan',
    },
    en: {
      // Navbar
      'nav.about': 'About Us',
      'nav.services': 'Services',
      'nav.experts': 'Our Experts',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',
      'nav.cta': 'Free Consultation',
      // Hero
      'hero.badge': 'Trusted Tax Consulting Partner',
      'hero.title': 'Professional Tax Solutions<br>For <span>Sustainable Business</span><br>Growth',
      'hero.desc': 'Helping your business stay compliant, optimize tax strategies, and achieve long-term financial success through expert tax consulting services.',
      'hero.btn1': '📅 Schedule Consultation',
      'hero.btn2': 'Explore Services →',
      'hero.metric1': 'Businesses Helped',
      'hero.metric2': 'Client Satisfaction',
      'hero.metric3': 'Years of Experience',
      // About
      'about.tag': 'About JTC',
      'about.title': 'Your Trusted <span>Tax Consulting</span> Partner Since 2021',
      'about.desc1': 'JTC Tax Consultant was founded with one purpose: to provide reliable, expert tax guidance to businesses and individuals to support sustainable growth. For over a decade, we have built deep expertise across all aspects of Indonesian and international taxation.',
      'about.desc2': 'Our certified tax consultants bring combined decades of experience across various industries, from SMEs taking their first steps in tax compliance to multinational corporations designing complex cross-border structures.',
      'about.visi': 'Our Vision',
      'about.visi.text': 'To become the most trusted tax consulting firm in Indonesia, recognized for integrity, expertise, and tangible results for clients.',
      'about.misi': 'Our Mission',
      'about.misi.text': 'To deliver personal and proactive tax solutions that protect and develop clients\' financial interests through compliance and strategic planning.',
      // Why
      'why.tag': 'Why JTC',
      'why.title': 'Why Businesses Choose <span>JTC Tax Consultant</span>',
      'why.desc': 'We go beyond compliance to become your strategic tax partner, helping you see opportunities where others only see obligations.',
      'why.card1.title': 'Certified Tax Consultants',
      'why.card1.desc': 'Our consultants hold official certifications and continuously stay updated on regulatory changes so you never miss a compliance obligation.',
      'why.card2.title': 'Personalized Tax Solutions',
      'why.card2.desc': 'No two businesses are the same. We design strategies tailored to your specific industry, scale, and growth trajectory.',
      'why.card3.title': 'Focus on Compliance',
      'why.card3.desc': 'We proactively manage your tax obligations to eliminate penalties, ensure audit readiness, and maintain regulatory trust.',
      'why.card4.title': 'Fast Response',
      'why.card4.desc': 'Urgent tax matters need immediate attention. Our team delivers fast, accurate responses within guaranteed deadlines.',
      'why.card5.title': 'Business-Oriented Advice',
      'why.card5.desc': 'We translate complex tax laws into clear, actionable strategies that align directly with your business goals.',
      'why.card6.title': 'Long-Term Partnership',
      'why.card6.desc': 'We build relationships, not transactions. Your success is our measure, and we invest in your long-term financial health.',
      // Services
      'services.tag': 'Our Services',
      'services.title': 'Comprehensive <span>Tax Consulting</span> Services',
      'services.desc': 'From routine compliance to complex international tax structures, we cover every dimension of your tax obligations.',
      'services.s1': 'Tax Consulting',
      'services.s1.desc': 'Strategic guidance on tax implications of business decisions, transactions, and corporate restructuring.',
      'services.s2': 'Tax Planning',
      'services.s2.desc': 'Proactive, forward-looking strategies to minimize tax burden while maintaining full compliance.',
      'services.s3': 'Tax Compliance',
      'services.s3.desc': 'Accurate and timely preparation and filing of all tax returns – corporate, VAT, withholding tax, and more.',
      'services.s4': 'Tax Audit Assistance',
      'services.s4.desc': 'Expert representation and support throughout the tax audit process, from documentation to dispute resolution.',
      'services.s5': 'Tax Review',
      'services.s5.desc': 'Comprehensive diagnostic review of your tax position to identify risks, exposures, and savings opportunities.',
      'services.s6': 'Financial Consulting',
      'services.s6.desc': 'Helping companies manage finances more effectively through financial statement analysis, budgeting, cash flow management, and sound business decision-making.',
      'services.s7': 'International Tax',
      'services.s7.desc': 'Cross-border tax planning, tax treaty optimization, and structuring for foreign investment companies.',
      'services.s8': 'Tax Dispute Resolution',
      'services.s8.desc': 'Professional handling of objections, appeals, and administrative tax disputes before authorities and tax courts.',
      'services.arrow': 'Learn more →',
      // Workflow
      'workflow.tag': 'Our Process',
      'workflow.title': 'How We <span>Deliver Results</span>',
      'workflow.desc': 'A structured, transparent engagement model from first contact to ongoing monitoring.',
      'workflow.step1': 'Consultation',
      'workflow.step1.desc': 'Understand business structure, tax history, and your main objectives',
      'workflow.step2': 'Analysis',
      'workflow.step2.desc': 'In-depth review of financial statements, compliance status, and tax exposures',
      'workflow.step3': 'Strategy',
      'workflow.step3.desc': 'Develop a tailored, compliant tax optimization roadmap',
      'workflow.step4': 'Implementation',
      'workflow.step4.desc': 'Execute reporting, restructuring, and documentation with precision',
      'workflow.step5': 'Monitoring',
      'workflow.step5.desc': 'Ongoing review and proactive adjustments to keep you one step ahead',
      // Stats
      'stats.label1': 'Clients Helped',
      'stats.label2': 'Client Satisfaction',
      'stats.label3': 'Years of Experience',
      'stats.label4': 'Professional Support',
      // Experts
      'experts.tag': 'Our Team',
      'experts.title': 'Meet Our <span>Tax Experts</span>',
      'experts.desc': 'Certified professionals with deep expertise and a full commitment to your financial success.',
      // FAQ
      'faq.tag': 'FAQ',
      'faq.title': 'Frequently Asked <span>Questions</span>',
      'faq.q1': 'What types of businesses does JTC Tax Consultant serve?',
      'faq.a1': 'JTC serves businesses of all scales, from startups and SMEs to large corporations and foreign investment companies across various key industries including manufacturing, technology, retail, healthcare, and logistics.',
      'faq.q2': 'How quickly can JTC respond to urgent tax matters?',
      'faq.a2': 'For urgent matters, our team provides an initial response within 4 hours on business days. We offer 24/7 support for critical compliance deadlines and audit situations so you are never left without guidance.',
      'faq.q3': 'What is the process to start a tax consultation with JTC?',
      'faq.a3': 'Simply submit a consultation request through our website or contact our office. We will schedule an initial discovery session to understand your needs, followed by a detailed proposal outlining our recommended approach and fee structure.',
      'faq.q4': 'Does JTC handle international tax matters for foreign companies?',
      'faq.a4': 'Yes, our international tax team specializes in cross-border tax planning, tax treaty application, and compliance for foreign investment companies operating in Indonesia.',
      'faq.q5': 'In which industries does JTC have the deepest tax expertise?',
      'faq.a5': 'Our deepest expertise covers manufacturing, trading, technology, financial services, property, and F&B. However, our certified consultants are trained to handle tax matters in all regulated industries in Indonesia.',
      // Consultation
      'consult.tag': 'Start Now',
      'consult.title': 'Schedule Your <span>Free Consultation</span>',
      'consult.desc': 'Tell us about your business and tax needs. Our expert team will contact you within 24 hours.',
      'consult.name': 'Full Name *',
      'consult.email': 'Email Address *',
      'consult.phone': 'Phone Number *',
      'consult.company': 'Company Name',
      'consult.service': 'Service Needed',
      'consult.service.placeholder': 'Select a service...',
      'consult.message': 'Message',
      'consult.message.placeholder': 'Tell us about your tax situation or what you\'d like to discuss...',
      'consult.submit': '📅 Schedule Free Consultation via WhatsApp',
      'consult.success': '✅ Your consultation request has been sent! We will contact you via WhatsApp within 24 hours.',
      // Contact
      'contact.tag': 'Contact Us',
      'contact.title': 'Contact <span>Us</span>',
      'contact.address': 'Office Address',
      'contact.address.val': 'World Trade Centre 5, Level 11<br>Jl. Jenderal Sudirman, RT.8/RW.3<br>Karet Kuningan, Setiabudi<br>Jakarta Selatan 12930',
      'contact.phone': 'Phone',
      'contact.phone.val': '+62 21 5790 1234<br>+62 812 1234 5678',
      'contact.email': 'Email',
      'contact.email.val': 'info@jtctax.co.id<br>consult@jtctax.co.id',
      'contact.hours': 'Business Hours',
      'contact.hours.val': 'Monday – Friday: 08:00 – 17:00<br>Saturday: 09:00 – 14:00',
      'contact.form.title': 'Send a Message',
      'contact.form.name': 'Full Name',
      'contact.form.email': 'Email',
      'contact.form.subject': 'Subject',
      'contact.form.subject.placeholder': 'How can we help?',
      'contact.form.message': 'Message',
      'contact.form.message.placeholder': 'Your message...',
      'contact.form.submit': '💬 Send via WhatsApp',
      // Footer
      'footer.brand': 'Professional tax consulting services that help businesses achieve sustainable growth through strategic tax planning and expert compliance management.',
      'footer.quicklinks': 'Quick Links',
      'footer.services': 'Services',
      'footer.contact': 'Contact',
      'footer.copyright': '© 2025 JTC Tax Consultant. All rights reserved. | Built with excellence.',
      'footer.policy': 'Privacy Policy · Terms of Service · Cookie Policy',
      //Kepatuhan pajak
      'compliance.hero.title': 'What is Tax Compliance?',
      'compliance.hero.desc': 'Tax Compliance is a service that helps taxpayers fulfill all tax obligations in a timely, accurate, and compliant manner. With the support of our professional team, we ensure the entire tax administration and reporting process runs smoothly so you can focus on business development.',
      'compliance.hero.li1': 'Timely and compliant tax reporting.',
      'compliance.hero.li2': 'Accurate and well-documented tax calculations.',
      'compliance.hero.li3': 'Reducing the risk of penalties due to tax administration errors.',
      'compliance.services.title': 'Our <span>Tax Compliance</span> Services',
      'compliance.s1.title': 'Tax Calculation',
      'compliance.s1.desc': 'Assisting in accurately calculating corporate and individual tax obligations in accordance with applicable regulations.',
      'compliance.s2.title': 'Periodic Tax Return Filing',
      'compliance.s2.desc': 'Preparation and timely filing of periodic tax returns including VAT, Income Tax Article 21, Income Tax Article 23, and other taxes.',
      'compliance.s3.title': 'Annual Tax Return Filing',
      'compliance.s3.desc': 'Assistance in preparing and filing annual corporate and individual tax returns in accordance with tax provisions.',
      'compliance.s4.title': 'Tax Reconciliation',
      'compliance.s4.desc': 'Examination and matching of financial data with tax reports to ensure consistency and accuracy.',
      'compliance.s5.title': 'Tax Compliance Review',
      'compliance.s5.desc': 'Evaluation of tax compliance to identify potential risks and areas for improvement.',
      'compliance.s6.title': 'Tax Administration and Documentation',
      'compliance.s6.desc': 'Systematic management of tax documents to support compliance and audit readiness.',
      'compliance.cta.title': 'Ready to Get Strategic Tax Consultation?',
      'compliance.cta.desc': 'Don\'t let business decisions be hindered by tax uncertainty. Our expert team is ready to help you optimize your tax position with proven strategies.',
      'compliance.cta.btn1': '📅 Schedule Free Consultation',
      'compliance.cta.btn2': '← Back to Services',
      //konsultasi keuangan
      'finance.hero.title': 'What is Financial Consulting?',
      'finance.hero.desc': 'Financial Consulting is a professional service that helps companies and individuals manage their financial condition more effectively, measurably, and sustainably. We provide analysis, recommendations, and financial strategies that support business growth, operational efficiency, and better decision-making.',
      'finance.hero.li1': 'Analysis of company financial health and performance.',
      'finance.hero.li2': 'Financial planning to support business growth.',
      'finance.hero.li3': 'Optimal cash flow and investment management strategies.',
      'finance.services.title': 'Financial <span>Consulting Services</span>',
      'finance.service1.title': 'Financial Statement Analysis',
      'finance.service1.desc': 'Reviewing financial statements to evaluate performance, profitability, liquidity, and overall financial condition.',
      'finance.service2.title': 'Budget Planning',
      'finance.service2.desc': 'Helping to develop effective budgets to support cost control and achievement of business targets.',
      'finance.service3.title': 'Cash Flow Management',
      'finance.service3.desc': 'Providing cash flow management strategies so business operations remain smooth and healthy.',
      'finance.service4.title': 'Investment Analysis',
      'finance.service4.desc': 'Evaluating investment opportunities and providing recommendations based on risk level and potential returns.',
      'finance.service5.title': 'Business Financial Planning',
      'finance.service5.desc': 'Developing short-term and long-term financial strategies to support business growth.',
      'finance.service6.title': 'Financial Decision Making',
      'finance.service6.desc': 'Providing financial considerations and recommendations to help management make better decisions.',
      'finance.cta.title': 'Ready to Get Strategic Financial Consulting?',
      'finance.cta.desc': 'Don\'t let business decisions be hindered by financial uncertainty. Our expert team is ready to help you optimize your financial strategy with proven effective approaches.',
      'finance.back': '← Back to Services',
      // tax consulting
      'taxconsult.hero.title': 'What is Tax Consulting?',
      'taxconsult.hero.desc': 'Tax Consulting is a strategic service designed to help businesses understand the tax implications of every business decision they make. From simple transactions to complex restructuring, our expert team provides deep insights into your tax position.',
      'taxconsult.hero.li1': 'Tax analysis before important business decisions.',
      'taxconsult.hero.li2': 'Efficient and compliant tax strategies.',
      'taxconsult.hero.li3': 'Mitigation of dispute and audit risks.',
      'taxconsult.services.title': 'Types of <span>Consulting We Offer</span>',
      'taxconsult.service1.title': 'Business Transaction Consulting',
      'taxconsult.service1.desc': 'Consultation on tax implications of asset sales, mergers & acquisitions, and other business transactions.',
      'taxconsult.service2.title': 'Corporate Restructuring Consulting',
      'taxconsult.service2.desc': 'Guidance on tax consequences of corporate reorganizations, spin-offs, mergers, and similar activities.',
      'taxconsult.service3.title': 'Investment Decision Consulting',
      'taxconsult.service3.desc': 'In-depth tax analysis of the tax implications of your investment and financing decisions.',
      'taxconsult.cta.title': 'Ready to Get Strategic Tax Consulting?',
      'taxconsult.cta.desc': 'Don\'t let business decisions be hindered by tax uncertainty. Our expert team is ready to help you optimize your tax position with proven effective strategies.',
      'taxconsult.back': '← Back to Services',
      // Tax Inter
      'inttax.hero.title': 'What is International Tax?',
      'inttax.hero.desc': 'International Tax is a consulting and assistance service that helps companies manage their tax obligations on cross-border transactions. We help ensure compliance with both domestic and international regulations, minimize double taxation risks, and optimize global transaction structures legally and efficiently.',
      'inttax.hero.li1': 'Tax analysis of cross-border transactions.',
      'inttax.hero.li2': 'Utilization of tax treaties to avoid double taxation.',
      'inttax.hero.li3': 'Mitigation of international tax risks and global compliance.',
      'inttax.services.title': 'International <span>Tax Services</span>',
      'inttax.service1.title': 'International Transaction Consulting',
      'inttax.service1.desc': 'Providing tax analysis on export, import, cross-border services, and other international business activities.',
      'inttax.service2.title': 'Tax Treaty Application',
      'inttax.service2.desc': 'Assisting in the utilization of Double Taxation Avoidance Agreements (DTAA) to obtain appropriate tax treatment.',
      'inttax.service3.title': 'Permanent Establishment Analysis',
      'inttax.service3.desc': 'Assessing the potential of a Permanent Establishment (PE) and its tax implications for companies operating across borders.',
      'inttax.service4.title': 'Withholding Tax Advisory',
      'inttax.service4.desc': 'Providing guidance on tax withholding on payments to foreign parties in accordance with applicable regulations.',
      'inttax.service5.title': 'International Investment Structuring',
      'inttax.service5.desc': 'Assisting in designing efficient international investment and financing structures that comply with tax regulations.',
      'inttax.service6.title': 'International Tax Dispute Assistance',
      'inttax.service6.desc': 'Providing support in resolving international tax issues, including disputes involving different jurisdictions.',
      'inttax.cta.title': 'Ready to Get International Tax Consulting?',
      'inttax.cta.desc': 'Don\'t let your cross-border transactions be hindered by tax uncertainty. Our expert team is ready to help you optimize your international tax strategy with proven effective approaches.',
      'inttax.back': '← Back to Services',
      //Tax Audit Asistance
      'audit.hero.title': 'What is Tax Audit Assistance?',
      'audit.hero.desc': 'Tax Audit Assistance is a professional service that helps taxpayers face the audit process by tax authorities. We accompany every stage of the audit, from document preparation, providing clarifications, to discussing audit results to ensure your tax rights and obligations are well protected.',
      'audit.hero.li1': 'Preparation of documents and supporting data for audit.',
      'audit.hero.li2': 'Assistance during the tax audit process.',
      'audit.hero.li3': 'Mitigation of correction and tax dispute risks.',
      'audit.services.title': 'Tax Audit <span>Assistance Services</span>',
      'audit.service1.title': 'Tax Audit Preparation',
      'audit.service1.desc': 'Helping prepare documents, financial statements, and tax data required during the audit process.',
      'audit.service2.title': 'Tax Document Review',
      'audit.service2.desc': 'Reviewing documents and transactions to identify potential risks of tax corrections.',
      'audit.service3.title': 'Clarification Assistance',
      'audit.service3.desc': 'Accompanying taxpayers in providing explanations and clarifications to tax auditors.',
      'audit.service4.title': 'Audit Findings Discussion',
      'audit.service4.desc': 'Providing analysis and arguments on audit findings to ensure proper tax treatment.',
      'audit.service5.title': 'Closing Conference Assistance',
      'audit.service5.desc': 'Accompanying taxpayers in the final discussion of audit results before the issuance of tax assessments.',
      'audit.service6.title': 'Audit Results Follow-up',
      'audit.service6.desc': 'Providing recommendations and strategies on audit results, including preparation of objections or other legal remedies if needed.',
      'audit.cta.title': 'Ready to Get Tax Audit Assistance?',
      'audit.cta.desc': 'Don\'t let the tax audit process disrupt your business. Our expert team is ready to accompany you through every stage to ensure your tax rights and obligations are well protected.',
      'audit.back': '← Back to Services',
      //Tax Dispute Resolution
      'dispute.hero.title': 'What is Tax Dispute Resolution?',
      'dispute.hero.desc': 'Tax Dispute Resolution is a professional assistance service that helps taxpayers in dealing with disputes with tax authorities. We provide support from case analysis, preparation of tax arguments, to assistance in the objection, appeal, and lawsuit process to protect taxpayers\' rights and interests.',
      'dispute.hero.li1': 'Assistance in the objection, appeal, and tax lawsuit process.',
      'dispute.hero.li2': 'Development of strong tax strategies and arguments.',
      'dispute.hero.li3': 'Professional representation in tax dispute processes.',
      'dispute.services.title': 'Tax Dispute <span>Resolution Services</span>',
      'dispute.service1.title': 'Tax Objection',
      'dispute.service1.desc': 'Assisting in the preparation and submission of objection letters regarding audit results or tax assessments issued by tax authorities.',
      'dispute.service2.title': 'Tax Appeal',
      'dispute.service2.desc': 'Providing assistance in the appeal process at the Tax Court to fight for taxpayers\' rights and interests.',
      'dispute.service3.title': 'Tax Lawsuit',
      'dispute.service3.desc': 'Accompanying taxpayers in filing lawsuits against tax actions or decisions deemed detrimental.',
      'dispute.service4.title': 'Tax Dispute Analysis',
      'dispute.service4.desc': 'Conducting a comprehensive review of the dispute subject to determine an effective and appropriate resolution strategy.',
      'dispute.service5.title': 'Document and Evidence Preparation',
      'dispute.service5.desc': 'Assisting in preparing documents, supporting data, and tax legal arguments required during the dispute process.',
      'dispute.service6.title': 'Trial Assistance',
      'dispute.service6.desc': 'Providing professional representation and assistance during the trial process at the Tax Court until the dispute obtains a decision.',
      'dispute.cta.title': 'Ready to Get Tax Dispute Resolution Assistance?',
      'dispute.cta.desc': 'Don\'t let tax disputes disrupt your business. Our expert team is ready to help you through every stage of the dispute process to protect your tax rights and interests.',
      'dispute.back': '← Back to Services',
      //tax planning
      'taxplan.hero.title': 'What is Tax Planning?',
      'taxplan.hero.desc': 'Tax Planning is a strategic process to manage tax obligations efficiently while complying with applicable regulations. Through proper planning, businesses can optimize tax burden, improve financial efficiency, and support sustainable business growth.',
      'taxplan.hero.li1': 'Optimization of tax obligations in accordance with applicable provisions.',
      'taxplan.hero.li2': 'More efficient transaction planning from a tax perspective.',
      'taxplan.hero.li3': 'Improving compliance while reducing future tax risks.',
      'taxplan.services.title': 'Types of Tax <span>Planning We Offer</span>',
      'taxplan.service1.title': 'Corporate Tax Planning',
      'taxplan.service1.desc': 'Developing effective tax strategies to optimize corporate tax obligations and support long-term business goals.',
      'taxplan.service2.title': 'Transaction Planning',
      'taxplan.service2.desc': 'Analysis and design of business transaction structures to be more tax-efficient without neglecting regulatory compliance.',
      'taxplan.service3.title': 'Investment Planning',
      'taxplan.service3.desc': 'Providing tax solutions for various investment options to generate optimal financial benefits.',
      'taxplan.service4.title': 'International Tax Planning',
      'taxplan.service4.desc': 'Assistance with cross-border transactions, tax treaty utilization, and management of international tax obligations.',
      'taxplan.service5.title': 'Employee Tax Planning',
      'taxplan.service5.desc': 'Helping to design remuneration and benefit schemes that are more tax-efficient for companies and employees.',
      'taxplan.service6.title': 'Tax Planning Review and Evaluation',
      'taxplan.service6.desc': 'Reviewing implemented tax strategies to ensure effectiveness, efficiency, and compliance with the latest regulations.',
      'taxplan.cta.title': 'Ready to Get Strategic Tax Planning?',
      'taxplan.cta.desc': 'Don\'t let business decisions be hindered by tax uncertainty. Our expert team is ready to help you optimize your tax position with proven effective strategies.',
      'taxplan.back': '← Back to Services',
      //tax review
      'taxreview.hero.title': 'What is Tax Review?',
      'taxreview.hero.desc': 'Tax Review is a comprehensive evaluation service of a company\'s tax compliance and position to identify potential risks, reporting errors, and improvement opportunities. Through systematic review, we help ensure that tax obligations have been fulfilled in accordance with applicable regulations.',
      'taxreview.hero.li1': 'Identification of risks and potential tax corrections.',
      'taxreview.hero.li2': 'Evaluation of compliance with tax regulations.',
      'taxreview.hero.li3': 'Improvement recommendations to minimize future risks.',
      'taxreview.services.title': 'Tax <span>Review Services</span>',
      'taxreview.service1.title': 'Tax Compliance Review',
      'taxreview.service1.desc': 'Evaluation of the company\'s fulfillment of tax obligations to ensure compliance with applicable regulations.',
      'taxreview.service2.title': 'Periodic and Annual Tax Return Review',
      'taxreview.service2.desc': 'Examination of tax reporting to identify potential errors, deficiencies, or correction risks.',
      'taxreview.service3.title': 'Tax Transaction Review',
      'taxreview.service3.desc': 'Analysis of tax treatment of business transactions to ensure proper application of tax provisions.',
      'taxreview.service4.title': 'Fiscal Reconciliation',
      'taxreview.service4.desc': 'Review of differences between commercial and fiscal financial statements to ensure accuracy of tax calculations.',
      'taxreview.service5.title': 'Tax Risk Identification',
      'taxreview.service5.desc': 'Identifying areas that could potentially lead to disputes, audits, or tax sanctions in the future.',
      'taxreview.service6.title': 'Improvement Recommendations',
      'taxreview.service6.desc': 'Providing strategic recommendations to improve compliance, efficiency, and tax management of the company.',
      'taxreview.cta.title': 'Ready to Conduct a Company Tax Review?',
      'taxreview.cta.desc': 'Don\'t let tax risks disrupt your business. Our expert team is ready to help you evaluate your tax position and provide strategic improvement recommendations.',
      'taxreview.back': '← Back to Services',
    }
  };

  // --- Variabel bahasa ---
  let currentLang = localStorage.getItem('jtc-lang') || 'id';

  // --- Fungsi untuk menerapkan bahasa ---
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('jtc-lang', lang);

    // Ubah atribut lang di html
    document.documentElement.lang = lang;

    // Update semua elemen dengan data-i18n (innerText)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerText = translations[lang][key];
      }
    });

    // Update elemen dengan data-i18n-html (innerHTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Update tombol toggle bahasa
    const langToggle = document.getElementById('jtc-langToggle');
    if (langToggle) {
      langToggle.textContent = lang === 'id' ? 'EN' : 'ID';
      langToggle.setAttribute('aria-label', lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia');
    }
  }

  // --- Event listener untuk tombol toggle ---
  const langToggle = document.getElementById('jtc-langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function() {
      const nextLang = currentLang === 'id' ? 'en' : 'id';
      setLanguage(nextLang);
    });
  }

  // --- Inisialisasi ---
  setLanguage(currentLang);
})();

// --- KLIK EXPERT CARD -> BUKA LINKEDIN ---
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.expert-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var url = this.getAttribute('data-linkedin');
      if (url) {
        window.open(url, '_blank');
      }
    });
  });
});
