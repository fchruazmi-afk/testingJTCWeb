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
