(() => {
  const canvas = document.getElementById('hopperCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1200; canvas.height = 620;
  const stage = document.getElementById('hopperStage');
  const overlay = document.getElementById('hopperOverlay');
  const startBtn = document.getElementById('hopperStart');
  const scoreEl = document.getElementById('hopperScore');
  const bestEl = document.getElementById('hopperBest');
  const statusEl = document.getElementById('hopperStatus');
  const hintEl = document.getElementById('hopperHint');
  const W = canvas.width, H = canvas.height, ground = 500;
  const errors = [
    ['ImagePullBackOff','#f1a58f'],['CrashLoopBackOff','#ef9b9b'],['OOMKilled','#f0a06e'],
    ['Pending Pod','#e7bc75'],['FailedScheduling','#d9a0c4'],['NodeNotReady','#c3a3e8'],
    ['DNS Failure','#8fb9df'],['HTTP 503','#ee9a9a'],['API Throttling','#e7bd78'],
    ['Expired TLS','#9bb8e5'],['IAM Denied','#c49de4'],['GPU Unavailable','#91b6a9'],
    ['Inference Timeout','#d89baf']
  ];
  let best = 0; try { best = +(localStorage.getItem('cloudHopperBest') || 0); } catch (_) {}
  bestEl.textContent = best;
  let running = false, score = 0, speed = 4, frame = 0, spawnIn = 70, obstacles = [], tokens = [], clouds = [];
  const player = {x:145,y:ground-42,vy:0,w:56,h:42,onGround:true};
  for(let i=0;i<11;i++) clouds.push({x:i*145+20,y:42+(i%4)*48,s:0.55+(i%3)*0.2});
  function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function drawCloud(x,y,scale=1,color='#fff'){
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,12*scale,0,Math.PI*2);ctx.arc(x+13*scale,y-7*scale,16*scale,0,Math.PI*2);ctx.arc(x+29*scale,y,11*scale,0,Math.PI*2);ctx.fill();
    rounded(x-1*scale,y,32*scale,10*scale,5*scale,color);
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#081226');sky.addColorStop(.52,'#111d3a');sky.addColorStop(1,'#172b48');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    // crisp star field and soft atmospheric glows
    for(let i=0;i<72;i++){const sx=(i*137+29)%W, sy=(i*83+17)%(ground-45);ctx.fillStyle=i%5===0?'rgba(115,220,255,.85)':'rgba(225,241,255,.55)';ctx.beginPath();ctx.arc(sx,sy,i%7===0?2:1.15,0,Math.PI*2);ctx.fill();}
    const glow=ctx.createRadialGradient(760,145,8,760,145,290);glow.addColorStop(0,'rgba(67,151,255,.22)');glow.addColorStop(1,'rgba(67,151,255,0)');ctx.fillStyle=glow;ctx.fillRect(430,0,500,430);
    ctx.fillStyle='rgba(235,246,255,.92)';ctx.beginPath();ctx.arc(1030,95,34,0,Math.PI*2);ctx.fill();ctx.fillStyle='#17223b';ctx.beginPath();ctx.arc(1044,83,31,0,Math.PI*2);ctx.fill();
    clouds.forEach(c=>{drawCloud(c.x,c.y,c.s,'rgba(255,255,255,.9)');});
    const floor=ctx.createLinearGradient(0,ground,0,H);floor.addColorStop(0,'#183d5a');floor.addColorStop(1,'#0b172b');ctx.fillStyle=floor;ctx.fillRect(0,ground,W,H-ground);
    ctx.strokeStyle='#55d9f4';ctx.lineWidth=2;ctx.setLineDash([8,10]);ctx.beginPath();ctx.moveTo(0,ground);ctx.lineTo(W,ground);ctx.stroke();ctx.setLineDash([]);
    // small grass / runway marks
    for(let x=-(frame*speed*.65%46);x<W;x+=46){ctx.fillStyle='rgba(94,218,255,.45)';ctx.fillRect(x,ground+30,25,3);}
    // player cloud with a tiny face
    ctx.save();ctx.shadowColor='#62dfff';ctx.shadowBlur=24;drawCloud(player.x,player.y+9,1.15,'#f4fbff');ctx.restore();
    ctx.fillStyle='#17233a';ctx.beginPath();ctx.arc(player.x+13,player.y+5,2,0,7);ctx.arc(player.x+25,player.y+5,2,0,7);ctx.fill();
    ctx.strokeStyle='#17233a';ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(player.x+19,player.y+10,4,.1,Math.PI-.1);ctx.stroke();
    obstacles.forEach(o=>{
      rounded(o.x,o.y,o.w,o.h,8,o.color);
      rounded(o.x+4,o.y+5,o.w-8,7,4,'rgba(255,255,255,.42)');
      ctx.fillStyle='#fff';ctx.font='bold 13px Manrope, sans-serif';ctx.textAlign='center';ctx.fillText(o.label,o.x+o.w/2,o.y+o.h+20);
      ctx.fillStyle='rgba(8,17,34,.82)';ctx.font='bold 17px Manrope';ctx.fillText('!',o.x+o.w/2,o.y+o.h/2+6);
    });
    tokens.forEach(t=>{ctx.fillStyle='#36d6a0';ctx.beginPath();ctx.arc(t.x,t.y,11,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('✓',t.x,t.y+5);});
    if(!running && !overlay.hidden) { /* overlay owns start state */ }
  }
  function reset(){score=0;speed=4;frame=0;spawnIn=65;obstacles=[];tokens=[];player.y=ground-42;player.vy=0;player.onGround=true;scoreEl.textContent='0';}
  function start(){reset();running=true;overlay.hidden=true;statusEl.textContent='PLATFORM HEALTHY';hintEl.textContent='Nice flight. Green deploy tokens add bonus points.';last=performance.now();requestAnimationFrame(loop);}
  function hop(){if(!running){start();return;}if(player.onGround){player.vy=-13.2;player.onGround=false;}}
  function end(){running=false;statusEl.textContent='DEPLOYMENT INTERRUPTED';hintEl.textContent='A production issue caught your cloud. Try another run.';overlay.hidden=false;overlay.querySelector('h2').textContent='Cloud grounded!';overlay.querySelector('p').textContent=`You scored ${score}. Ready for another deploy?`;startBtn.textContent='Try again ↻';}
  function loop(now){if(!running)return;const dt=Math.min(2,(now-last)/16.67);last=now;frame+=dt;speed=Math.min(8.5,4+score*.035);
    clouds.forEach(c=>{c.x-=.45*dt;if(c.x<-70)c.x=W+30;});
    player.vy+=.68*dt;player.y+=player.vy*dt;if(player.y>=ground-42){player.y=ground-42;player.vy=0;player.onGround=true;}
    spawnIn-=dt;if(spawnIn<=0){const e=errors[Math.floor(Math.random()*errors.length)];const h=42+Math.random()*22;obstacles.push({x:W+20,y:ground-h,w:46+Math.min(58,e[0].length*1.6),h,label:e[0],color:e[1]});if(Math.random()<.42)tokens.push({x:W+180,y:ground-78-Math.random()*65});spawnIn=85+Math.random()*48-(speed-4)*5;}
    obstacles.forEach(o=>o.x-=speed*dt);tokens.forEach(t=>t.x-=speed*dt);
    obstacles=obstacles.filter(o=>o.x+o.w>-20);tokens=tokens.filter(t=>t.x>-20);
    const px=player.x+9,py=player.y-7,pw=38,ph=36;
    for(const o of obstacles){if(px<o.x+o.w-4&&px+pw>o.x+4&&py<o.y+o.h&&py+ph>o.y){end();draw();return;}}
    tokens=tokens.filter(t=>{if(Math.hypot(t.x-(player.x+20),t.y-(player.y+8))<34){score+=5;return false;}return true;});
    if(frame%7<dt){score++;scoreEl.textContent=score;if(score>best){best=score;bestEl.textContent=best;try{localStorage.setItem('cloudHopperBest',best);}catch(_){}}}
    if(score>0&&score%25===0)statusEl.textContent='SCALING SUCCESSFUL';
    draw();requestAnimationFrame(loop);
  }
  let last=0;
  startBtn.addEventListener('click',e=>{e.stopPropagation();start();});
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;stage.focus();hop();});
  document.addEventListener('keydown',e=>{if(['Space','ArrowUp'].includes(e.code)&&!e.repeat){e.preventDefault();hop();}});
  draw();
})();