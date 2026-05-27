// LOADER
window.addEventListener('load',()=>{
  const loader=document.getElementById('loader');
  const countEl=document.getElementById('loader-count');
  const fillEl=document.querySelector('.loader-fill');
  if(loader) {
    let count=0;
    const interval=setInterval(()=>{
      count += Math.floor(Math.random() * 6) + 3;
      if(count>=100) {
        count=100;
        clearInterval(interval);
        setTimeout(()=>{
          loader.classList.add('hidden');
        },300);
      }
      if(countEl) countEl.textContent=count.toString().padStart(2,'0')+'%';
      if(fillEl) fillEl.style.width=count+'%';
    },40);
  }
});

// CURSOR
const cur=document.getElementById('cursor'),trail=document.getElementById('cursor-trail');
const isTouch='ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
if(cur && trail) {
  if(isTouch) {
    cur.style.display='none';
    trail.style.display='none';
  } else {
    let mx=0,my=0,tx=0,ty=0;
    let isFirstMove=true;
    document.addEventListener('mousemove',e=>{
      mx=e.clientX;
      my=e.clientY;
      cur.style.left=mx+'px';
      cur.style.top=my+'px';
      if(isFirstMove) {
        isFirstMove=false;
        cur.classList.add('active');
        trail.classList.add('active');
        tx=mx;
        ty=my;
      }
    });
    (function animate(){
      tx+=(mx-tx)*0.14;
      ty+=(my-ty)*0.14;
      trail.style.left=tx+'px';
      trail.style.top=ty+'px';
      requestAnimationFrame(animate);
    })();
    document.addEventListener('mouseleave',()=>{
      cur.classList.remove('active');
      trail.classList.remove('active');
    });
    document.addEventListener('mouseenter',()=>{
      if(!isFirstMove) {
        cur.classList.add('active');
        trail.classList.add('active');
      }
    });
    const interactiveSelector='a, button, .service-card, .project-card, .social-link, .footer-social, .proj-card-btn, .btn-send, .filter-btn, .back-top, .cv-card, .avatar-ring';
    document.addEventListener('mouseover',e=>{
      if(e.target.closest(interactiveSelector)){
        cur.classList.add('hovered');
        trail.classList.add('hovered');
      }
    });
    document.addEventListener('mouseout',e=>{
      if(e.target.closest(interactiveSelector)){
        const related=e.relatedTarget ? e.relatedTarget.closest(interactiveSelector) : null;
        if(!related){
          cur.classList.remove('hovered');
          trail.classList.remove('hovered');
        }
      }
    });
  }
}

// SCROLL
window.addEventListener('scroll',()=>{
  const pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
  const pb=document.getElementById('progress-bar');
  if(pb) pb.style.width=Math.min(pct,100)+'%';
  const bt=document.getElementById('backTop');
  if(bt) bt.classList.toggle('visible',window.scrollY>400);
});

// TYPED EFFECT
const phrases=['Web Designer','Frontend Developer','HTML Developer'];
let pi=0,ci=0,del=false;
const typedEl=document.getElementById('typed');
function typeLoop(){
  if(!typedEl) return;
  const phrase=phrases[pi];
  if(!del){if(ci<phrase.length){typedEl.textContent=phrase.slice(0,++ci);setTimeout(typeLoop,80)}else{setTimeout(()=>{del=true;typeLoop()},2200)}}
  else{if(ci>0){typedEl.textContent=phrase.slice(0,--ci);setTimeout(typeLoop,40)}else{del=false;pi=(pi+1)%phrases.length;setTimeout(typeLoop,400)}}
}
if(typedEl) typeLoop();

// MOBILE MENU
function toggleMenu(){
  const mm=document.getElementById('mobileMenu');
  const hb=document.getElementById('hamburger');
  if(mm) mm.classList.toggle('open');
  if(hb) hb.classList.toggle('open');
}

// REVEAL
const revEls=document.querySelectorAll('.reveal');
let skillsAnimated=false;
let countersAnimated=false;
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      if(e.target.id==='skillsGrid'&&!skillsAnimated){
        skillsAnimated=true;
        setTimeout(animateSkills,300);
      }
      if(e.target.classList.contains('about-grid')&&!countersAnimated){
        countersAnimated=true;
        setTimeout(animateCounters,300);
      }
    }
  });
},{threshold:0.12});
revEls.forEach(el=>io.observe(el));

// SKILLS
const skills=[
  {name:'HTML5',pct:95,color:'#e34f26',icon:'H5'},
  {name:'CSS3',pct:92,color:'#264de4',icon:'C3'},
  {name:'Bootstrap',pct:88,color:'#7952b3',icon:'BS'},
  {name:'SASS/SCSS',pct:82,color:'#cc6699',icon:'Ss'},
  {name:'Figma',pct:96,color:'#a855f7',icon:'Fg'},
  {name:'React JS',pct:80,color:'#61dafb',icon:'⚛'},
  {name:'Tailwind CSS',pct:90,color:'#06b6d4',icon:'TW'},
  {name:'JavaScript',pct:85,color:'#f7df1e',icon:'JS'},
  {name:'jQuery',pct:78,color:'#0769ad',icon:'jQ'},
  {name:'Photoshop',pct:85,color:'#31a8ff',icon:'Ps'},
];
function renderSkills(){
  const grid=document.getElementById('skillsGrid');
  if(!grid) return;
  grid.innerHTML=skills.map(s=>`
    <div class="col-xl-3 col-lg-4 col-md-6">
      <div class="skill-card">
        <div class="skill-header">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="skill-icon" style="background:${s.color}1a;color:${s.color};border:1px solid ${s.color}30;font-size:${s.icon.length>2?'1rem':'0.8rem'}">${s.icon}</div>
            <div class="skill-name">${s.name}</div>
          </div>
          <div class="skill-pct">${s.pct}%</div>
        </div>
        <div class="skill-bar">
          <div class="skill-fill" style="background:linear-gradient(90deg,${s.color},${s.color}99)" data-w="${s.pct}%"></div>
        </div>
      </div>
    </div>`).join('');
}
renderSkills();
function animateSkills(){document.querySelectorAll('.skill-fill').forEach(el=>el.style.width=el.dataset.w)}

// COUNTERS
function animateCounters(){
  document.querySelectorAll('.stat-num').forEach(el=>{
    const target=parseInt(el.dataset.target) || 0;
    const duration=target > 5 ? 1500 : 600;
    let startTimestamp=null;
    
    const easeOutQuad = t => t * (2 - t);
    
    function step(timestamp){
      if(!startTimestamp) startTimestamp=timestamp;
      const progress=Math.min((timestamp-startTimestamp)/duration,1);
      const easedProgress=easeOutQuad(progress);
      const currentVal=Math.round(easedProgress*target);
      
      el.textContent=currentVal+'+';
      if(progress<1){
        window.requestAnimationFrame(step);
      }else{
        el.textContent=target+'+';
      }
    }
    window.requestAnimationFrame(step);
  });
}

// SERVICES
const services=[
  {icon:'<i class="ri-layout-4-line"></i>',title:'Web Design',desc:'I create modern, visually appealing, and user-friendly website designs tailored to your brand identity.',tags:['Figma','Adobe XD','Prototyping'],bg:'rgba(168,85,247,0.1)',bd:'rgba(168,85,247,0.2)'},
  {icon:'<i class="ri-smartphone-line"></i>',title:'Responsive Web Design',desc:'Designs that work perfectly across desktop, tablet, and mobile devices for a seamless user experience.',tags:['User Research','Wireframing','Testing'],bg:'rgba(6,182,212,0.1)',bd:'rgba(6,182,212,0.2)'},
  {icon:'<i class="ri-pages-line"></i>',title:'Landing Page Design',desc:'High-converting and engaging landing pages designed to attract visitors and boost conversions.',tags:['HTML5','CSS3','Tailwind'],bg:'rgba(59,130,246,0.1)',bd:'rgba(59,130,246,0.2)'},
  {icon:'<i class="ri-code-s-slash-line"></i>',title:'Front-End Development',desc:'Transforming creative designs into fully responsive and interactive websites using modern technologies.',tags:['Conversion','CRO','A/B Testing'],bg:'rgba(236,72,153,0.1)',bd:'rgba(236,72,153,0.2)'},
  {icon:'<i class="ri-window-line"></i>',title:'Dashboard UI Design',desc:'Premium and clean admin dashboard interfaces with modern layouts and intuitive user interactions.',tags:['React','Charts','Data Viz'],bg:'rgba(16,185,129,0.1)',bd:'rgba(16,185,129,0.2)'},
  {icon:'<i class="ri-pencil-ruler-2-line"></i>',title:'UI/UX Design',desc:'Designing seamless user journeys, high-fidelity wireframes, and interactive prototypes with a focus on usability.',tags:['React JS','GSAP','Framer Motion'],bg:'rgba(245,158,11,0.1)',bd:'rgba(245,158,11,0.2)'},
];
const servicesGrid=document.getElementById('servicesGrid');
if(servicesGrid){
  servicesGrid.innerHTML=services.map(s=>`
    <div class="col-lg-4 col-md-6">
      <div class="service-card">
        <div class="service-icon" style="background:${s.bg};border:1px solid ${s.bd}">${s.icon}</div>
        <div class="service-title">${s.title}</div>
        <div class="service-desc">${s.desc}</div>
        <div class="service-tags">${s.tags.map(t=>`<span class="s-tag">${t}</span>`).join('')}</div>
      </div>
    </div>`).join('');
}

// PROJECTS
const projects=[
  {title:'Vastra Bazaar',desc:'Modern e-commerce platform for traditional Indian clothing with seamless shopping experience and advanced filtering.',cats:['E-Commerce'],img:'asstes/images/vastra_bazaar.png',link:'https://vastrabazaar.in'},
  {title:'Capital Corporat',desc:'Professional corporate finance website with dark dashboard aesthetics and interactive analytics charts.',cats:['Finance','Dashboard'],img:'asstes/images/capital_corporat.png',link:'https://capitalcorporat.com'},
  {title:'Radha Rani Krishna',desc:'Online platform for live Darshan, darshan tickets, donation, and religious services with video streaming.',cats:['Web App'],img:'asstes/images/radharani.png',link:'https://radharanikrishna.com'},
  {title:'E-Commerce Jewellery',desc:'Luxury jewellery e-commerce with 3D product views, wishlists, and a premium checkout experience.',cats:['E-Commerce'],img:'asstes/images/jewellery_ecommerce.png',link:'https://jewellery.itwebcreation.com'},
  {title:'Birthday Wishes Website',desc:'Interactive animated birthday greeting platform with personalised messages and beautiful party themes.',cats:['Creative'],img:'asstes/images/birthday_wishes.png',link:'https://birthdaywishemessages.com'},
  {title:'Rental Home',desc:'Real estate rental platform with advanced filters, virtual tours, and integrated Google Maps search.',cats:['Real Estate'],img:'asstes/images/rental_home.png',link:'https://rental.itwebcreation.com'},
  {title:'Mahadev',desc:'Online darshan platform for devotees to watch live darshan, book darshan tickets, make donations, and access religious services.',cats:['Web App'],img:'asstes/images/mahadev.png',link:'https://mahadev.itwebcreation.com'},
  {title:'Allecropper',desc:'Financial Calculators website for banking, retirement, loans, insurance, and investment planning.',cats:['Web App'],img:'asstes/images/allecropper.png',link:'https://allecropper.com'},
  {title:'White Sparrow Hub',desc:'Premium hospitality and event venue booking platform with immersive gallery and virtual walkthroughs.',cats:['Hospitality'],img:'asstes/images/whitesparrowhub.png',link:'https://whitesparrowhub.com'},
  {title:'My islamicway',desc:'  My Islamic Way is a modern Islamic platform that shares authentic Islamic knowledge, duas, Quranic teachings, and inspirational content for Muslims worldwide. ',cats:['Islamic'],img:'asstes/images/myislamicway.png',link:'https://myislamicway.com'},
  {title:'Kashtbhanjan Daily Darshan',desc:'Kashtbhanjan Daily Darshan is a Hindu temple located in Salangpur, Gujarat, India. It is dedicated to Lord Hanuman and is one of the most revered temples in Gujarat.',cats:[''],img:'asstes/images/kashtbhanjandailydarshan.png',link:'https://kashtbhanjandailydarshan.com/'},
  {title:'Crickbuzz now',desc:'Crickbuzz now is a cricket website that provides live cricket scores, news, and commentary for cricket lovers.',cats:['Web App'],img:'asstes/images/crickbuzznow.png',link:'https://crickbuzznow.com/'},

];
function renderProjects(){
  const homeGrid=document.getElementById('projectsGrid');
  const allGrid=document.getElementById('allProjectsGrid');
  if(homeGrid){
    homeGrid.innerHTML=projects.slice(0,6).map(p=>renderProjectCard(p)).join('');
  }else if(allGrid){
    allGrid.innerHTML=projects.map(p=>renderProjectCard(p)).join('');
  }
}
function renderProjectCard(p){
  return `
    <div class="col-lg-4 col-md-6">
      <div class="project-card">
        <div class="project-thumb">
          <img src="${p.img}" alt="${p.title}" class="project-img">
        </div>
        <div class="project-body">
          <div class="proj-cats">${p.cats.map(c=>`<span class="proj-cat">${c}</span>`).join('')}</div>
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.desc}</div>
          <div style="margin-top:auto;padding-top:1.25rem">
            <a href="${p.link}" target="_blank" class="proj-card-btn">
              Live Preview <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
      </div>
    </div>`;
}
renderProjects();



// CONTACT FORM
function handleSend(btn){
  const orig=btn.textContent;
  btn.textContent='Sending...';btn.style.opacity='0.75';
  setTimeout(()=>{
    btn.textContent='✓ Message Sent!';btn.style.opacity='1';
    btn.style.background='linear-gradient(135deg,#059669,#34d399)';
    setTimeout(()=>{btn.textContent=orig;btn.style.background=''},3500);
  },1600);
}
