
(() => {
  const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];
  const header=qs('.header');
  const onScroll=()=>header.classList.toggle('is-scrolled',window.scrollY>42);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});

  const mobile=qs('#mobileMenu');
  const setMenu=(open)=>{mobile.classList.toggle('is-open',open);document.body.classList.toggle('menu-open',open)};
  qs('#menuOpen').addEventListener('click',()=>setMenu(true));
  qs('#menuClose').addEventListener('click',()=>setMenu(false));
  qsa('a',mobile).forEach(a=>a.addEventListener('click',()=>setMenu(false)));

  const slides=qsa('.hero-slide'), dots=qsa('.hero-dot'), caption=qs('#heroCaption');
  let heroIndex=0, heroTimer;
  function showHero(i){
    heroIndex=(i+slides.length)%slides.length;
    slides.forEach((s,n)=>s.classList.toggle('is-active',n===heroIndex));
    dots.forEach((d,n)=>{d.classList.remove('is-active');void d.offsetWidth;d.classList.toggle('is-active',n===heroIndex)});
    caption.textContent=slides[heroIndex].dataset.caption || '';
  }
  function startHero(){clearInterval(heroTimer);heroTimer=setInterval(()=>showHero(heroIndex+1),6000)}
  qs('#heroPrev').addEventListener('click',()=>{showHero(heroIndex-1);startHero()});
  qs('#heroNext').addEventListener('click',()=>{showHero(heroIndex+1);startHero()});
  dots.forEach((d,n)=>d.addEventListener('click',()=>{showHero(n);startHero()}));
  showHero(0);startHero();

  const tabs=qsa('.approach-tab');
  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.toggle('is-active',t===tab));
    qsa('.approach-panel').forEach(p=>p.classList.toggle('is-active',p.dataset.panel===tab.dataset.tab));
  }));

  const viewport=qs('.project-viewport'), track=qs('.project-track'), cards=qsa('.project-card'), prog=qs('#projectProgress'), count=qs('#projectCount');
  let projectIndex=0, projectTimer;
  function perView(){return innerWidth<=720?1:innerWidth<=1040?2:3}
  function maxIndex(){return Math.max(0,cards.length-perView())}
  function renderProjects(){
    projectIndex=Math.min(projectIndex,maxIndex());
    const gap=20, width=(viewport.clientWidth-gap*(perView()-1))/perView();
    track.style.transform=`translateX(-${projectIndex*(width+gap)}px)`;
    const total=maxIndex()+1;
    prog.style.width=`${((projectIndex+1)/total)*100}%`;
    count.textContent=`${String(projectIndex+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  }
  function nextProject(dir=1){projectIndex+=dir;if(projectIndex>maxIndex())projectIndex=0;if(projectIndex<0)projectIndex=maxIndex();renderProjects()}
  function startProjects(){clearInterval(projectTimer);projectTimer=setInterval(()=>nextProject(1),4800)}
  qs('#projectPrev').addEventListener('click',()=>{nextProject(-1);startProjects()});
  qs('#projectNext').addEventListener('click',()=>{nextProject(1);startProjects()});
  viewport.addEventListener('mouseenter',()=>clearInterval(projectTimer));viewport.addEventListener('mouseleave',startProjects);
  window.addEventListener('resize',renderProjects);renderProjects();startProjects();

  const modal=qs('#serviceModal'), title=qs('#modalTitle'), copy=qs('#modalCopy'), list=qs('#modalList');
  const serviceData={
    restoration:{title:'Реставрация и фасады',copy:'Работы на объектах культурного наследия и исторической застройки с вниманием к первоначальному архитектурному облику.',items:['Реставрация фасадов, кладки, штукатурки и декоративных элементов','Подбор материалов, близких оригиналу по форме, структуре и цвету','Усиление конструкций без искажения внешнего облика','Внутренние ремонтно-отделочные работы']},
    general:{title:'Генподряд и технический надзор',copy:'Организация полного цикла строительства и контроль соответствия работ проектной документации, срокам и требованиям качества.',items:['Функции генерального подрядчика','Управление подрядчиками и графиком','Строительный контроль и технический надзор','Исполнительная документация и сопровождение сдачи']},
    design:{title:'Проектирование и инженерия',copy:'Подготовка решений для зданий, сооружений и инженерной инфраструктуры — от исходных данных до рабочей документации.',items:['Проектирование зданий и сооружений','Проектирование внутренних и наружных инженерных сетей','Обследование строительных конструкций','Сопровождение согласований']},
    monolith:{title:'Монолит и конструкции',copy:'Комплекс работ по устройству несущих конструкций, фундаментов, перекрытий и быстровозводимых объектов.',items:['Монолитные и бетонные работы','Фундаменты и перекрытия','Монтаж металлоконструкций','Ангары и логистические комплексы']},
    networks:{title:'Инженерные сети',copy:'Проектирование, монтаж и сопровождение систем, необходимых для полноценной эксплуатации объекта.',items:['Водоснабжение и водоотведение','Канализация и отопление','Газоснабжение','Внутренние и наружные коммуникации']},
    construction:{title:'Промышленное и гражданское строительство',copy:'Строительство, реконструкция и капитальный ремонт зданий и сооружений различного назначения.',items:['Промышленные и складские объекты','Гражданские здания','Подготовка площадки и общестроительные работы','Благоустройство территорий и дорожные работы']}
  };
  function openModal(key){const d=serviceData[key];if(!d)return;title.textContent=d.title;copy.textContent=d.copy;list.innerHTML=d.items.map(x=>`<li>${x}</li>`).join('');modal.classList.add('is-open');document.body.classList.add('modal-open')}
  function closeModal(){modal.classList.remove('is-open');document.body.classList.remove('modal-open')}
  qsa('[data-service]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.service)));
  qs('#modalClose').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();setMenu(false)}});

  const form=qs('#contactForm'), status=qs('#formStatus');
  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const btn=qs('button[type="submit"]',form);btn.disabled=true;btn.textContent='Отправляем…';status.textContent='';
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
      const data=await res.json().catch(()=>({ok:false,message:'Не удалось прочитать ответ сервера'}));
      if(!res.ok||!data.ok)throw new Error(data.message||'Ошибка отправки');
      form.reset();status.textContent='Запрос отправлен. Мы свяжемся с вами.';status.style.color='#24734d';
    }catch(err){
      status.textContent='Форма не подключена на этом сервере. Позвоните +7 (812) 309-49-34 или напишите на info@prrk.ru.';status.style.color='#9b4d34';
    }finally{btn.disabled=false;btn.textContent='Отправить запрос ↗'}
  });

  qs('#experienceYears').textContent=new Date().getFullYear()-1988;
  qs('#year').textContent=new Date().getFullYear();
})();
