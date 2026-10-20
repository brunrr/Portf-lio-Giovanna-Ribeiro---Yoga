const root=document.documentElement;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile=window.matchMedia('(max-width: 600px)');
let paused=reduced.matches;
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.querySelector('span').textContent=open?'−':'＋';});
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.querySelector('span').textContent='＋';}
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
root.classList.add('motion-enabled');
const immersion=document.querySelector('.immersion');
const immersionImage=document.querySelector('.immersion-image');
const gallery=document.querySelector('.gallery-scroll');
const track=document.querySelector('.gallery-track');
const progress=document.querySelector('.gallery-progress span');
const galleryCount=document.querySelector('.gallery-count');
const previous=document.querySelector('.gallery-prev');
const next=document.querySelector('.gallery-next');
const photos=[...track.querySelectorAll('figure')];
const clamp=n=>Math.max(0,Math.min(1,n));
let pending=false;
let activePhoto=0;
let targetPhoto=null;
let manualScroll=false;
let previousY=scrollY;
function photoPosition(index){return Math.min(track.scrollWidth-track.clientWidth,Math.max(0,photos[index].offsetLeft-photos[0].offsetLeft));}
function updateGallery(){
 const distance=Math.max(1,track.scrollWidth-track.clientWidth);
 activePhoto=photos.reduce((best,_,i)=>Math.abs(photoPosition(i)-track.scrollLeft)<Math.abs(photoPosition(best)-track.scrollLeft)?i:best,0);
 if(track.scrollLeft>=distance-2)activePhoto=photos.length-1;
 galleryCount.textContent=`Foto ${activePhoto+1} de ${photos.length}`;
 previous.disabled=activePhoto===0;
 next.disabled=activePhoto===photos.length-1;
 progress.style.transform=`translateX(${clamp(track.scrollLeft/distance)*400}%)`;
}
function renderMotion(){
 pending=false;
 if(paused)return;
 const rect=immersion.getBoundingClientRect();
 const ratio=clamp(-rect.top/Math.max(1,immersion.offsetHeight-innerHeight));
 immersionImage.style.clipPath=`inset(${14*(1-ratio)}% ${(mobile.matches?8:18)*(1-ratio)}%)`;
 if(!mobile.matches&&!manualScroll){
  const r=gallery.getBoundingClientRect();
  const p=clamp(-r.top/Math.max(1,gallery.offsetHeight-innerHeight));
  track.scrollLeft=p*Math.max(0,track.scrollWidth-track.clientWidth);
 }
}
function navigateGallery(direction){
 const index=Math.max(0,Math.min(photos.length-1,(targetPhoto??activePhoto)+direction));
 targetPhoto=index;
 manualScroll=true;
 track.scrollTo({left:photoPosition(index),behavior:paused||reduced.matches?'instant':'smooth'});
}
previous.addEventListener('click',()=>navigateGallery(-1));
next.addEventListener('click',()=>navigateGallery(1));
track.addEventListener('keydown',event=>{
 if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
  event.preventDefault();navigateGallery(event.key==='ArrowRight'?1:-1);
 }
});
track.addEventListener('pointerdown',()=>{manualScroll=true;targetPhoto=null;},{passive:true});
track.addEventListener('wheel',event=>{if(Math.abs(event.deltaX)>Math.abs(event.deltaY)){manualScroll=true;targetPhoto=null;}},{passive:true});
track.addEventListener('scroll',updateGallery,{passive:true});
track.addEventListener('scrollend',()=>{targetPhoto=null;});
function schedule(){if(!pending){pending=true;requestAnimationFrame(renderMotion);}}
function syncMotion(){root.classList.toggle('motion-paused',paused);schedule();}
reduced.addEventListener('change',e=>{paused=e.matches;syncMotion();});
addEventListener('scroll',()=>{if(scrollY!==previousY){manualScroll=false;targetPhoto=null;previousY=scrollY;}schedule();},{passive:true});
addEventListener('resize',()=>{schedule();updateGallery();});addEventListener('load',()=>{schedule();updateGallery();});syncMotion();updateGallery();
