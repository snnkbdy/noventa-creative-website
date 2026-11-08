import {useEffect,useRef} from 'react';

const WORDS=['NOVENTA','FORM / FUNCTION','GOOD HABIT','OFFSCRIPT'];
type Dot={x:number;y:number;tx:number;ty:number;vx:number;vy:number;size:number;phase:number};

export default function ParticleTypography(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dots:Dot[]=[];const pointer={x:-1000,y:-1000};let w=0,h=0,dpr=1,word=0,frame=0,lastSwap=0,raf=0,visible=true;
  const off=document.createElement('canvas'),oc=off.getContext('2d');
  if(!oc)return;
  const targets=(label:string)=>{
   off.width=1100;off.height=300;oc.clearRect(0,0,off.width,off.height);
   let size=label.length>12?112:label.length>9?142:190;
   oc.font='900 '+size+'px Arial, sans-serif';oc.textAlign='center';oc.textBaseline='middle';
   oc.fillStyle='#000';oc.fillText(label,550,148,1030);
   const data=oc.getImageData(0,0,off.width,off.height).data,pts:{x:number;y:number}[]=[];
   for(let y=12;y<288;y+=5)for(let x=20;x<1080;x+=5)if(data[(y*off.width+x)*4+3]>120)pts.push({x:(x/1100-.5)*w,y:(y/300-.5)*h*.76});
   return pts;
  };
  const morph=(label:string)=>{
   const pts=targets(label);
   dots.forEach((p,i)=>{const t=pts[(i*37)%pts.length]??{x:(Math.random()-.5)*w,y:(Math.random()-.5)*h};p.tx=t.x;p.ty=t.y;});
  };
  const resize=()=>{
   const r=canvas.getBoundingClientRect();w=Math.max(320,r.width);h=Math.max(190,r.height);dpr=Math.min(devicePixelRatio||1,1.6);
   canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
   if(!dots.length){for(let i=0;i<1050;i++)dots.push({x:(Math.random()-.5)*w*1.4,y:(Math.random()-.5)*h*1.4,tx:0,ty:0,vx:0,vy:0,size:.45+Math.random()*1.1,phase:Math.random()*6.28});}
   morph(WORDS[word]);
  };
  const draw=(time:number)=>{
   if(!visible){raf=requestAnimationFrame(draw);return}
   frame++;
   const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#e8e5df');bg.addColorStop(1,'#f4c2a8');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
   if(!reduce&&time-lastSwap>3900){word=(word+1)%WORDS.length;lastSwap=time;morph(WORDS[word]);}
   ctx.save();ctx.translate(w/2,h/2);
   for(const p of dots){
    const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);
    if(!reduce&&dist<92&&dist>0){const force=(92-dist)/92*.75;p.vx+=dx/dist*force;p.vy+=dy/dist*force;}
    const ease=reduce?1:.075;p.vx+=(p.tx-p.x)*ease;p.vy+=(p.ty-p.y)*ease;
    p.vx*=reduce?0:.82;p.vy*=reduce?0:.82;p.x+=p.vx;p.y+=p.vy;
    const shimmer=reduce?1:.78+.22*Math.sin(time*.0015+p.phase);
    ctx.fillStyle='rgba(44,39,35,'+(0.45*shimmer)+')';ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
   }
   ctx.restore();
   // Fine grass-like strokes anchor the particle field without obscuring the work.
   ctx.strokeStyle='rgba(64,55,48,.26)';ctx.lineWidth=1;
   for(let x=0;x<w;x+=12){const base=h-5,lean=Math.sin(x*.07)*7;ctx.beginPath();ctx.moveTo(x,base);ctx.lineTo(x+lean,base-8-(Math.sin(x*.17)*10+10));ctx.stroke();}
   raf=requestAnimationFrame(draw);
  };
  const move=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left-w/2;pointer.y=e.clientY-r.top-h/2;};
  const leave=()=>{pointer.x=-1000;pointer.y=-1000;};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(draw);});
  observer.observe(canvas);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);
  resize();lastSwap=performance.now();raf=requestAnimationFrame(draw);
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  return()=>{cancelAnimationFrame(raf);observer.disconnect();ro.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);};
 },[]);
 return <div className="particle-gallery" aria-label="Parçacık animasyonlu Noventa portfolyo görseli"><canvas ref={ref}/><span className="particle-caption">IDEAS IN MOTION <i>✳</i> NOVENTA STUDIO</span></div>;
}
