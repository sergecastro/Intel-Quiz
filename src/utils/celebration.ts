/* eslint-disable @typescript-eslint/no-explicit-any */
type CelebrateOpts = { title?: string; sub?: string; flag?: string; onDone?: () => void };
declare global { interface Window { lottie:any; confetti:any; Howl:any; } }

let overlayEl: HTMLDivElement | null = null;
let confettiCreator: any = null;
let lottieInstance: any = null;
let onDoneCb: (() => void) | null = null;

function ensureStyles() {
  if (document.getElementById('celebration-styles')) return;
  const css = `
  #celebration-overlay{
    position:fixed;inset:0;display:none;align-items:center;justify-content:center;
    background:rgba(10,12,16,.55);backdrop-filter:blur(6px);
    z-index:2147483647 !important; /* sit above EVERYTHING */
  }
  #celebration-overlay.show{display:flex}
  #celebration-card{
    position:relative;width:min(620px,92vw);padding:28px 24px;border-radius:22px;
    background:linear-gradient(180deg,#1b2230,#141925);
    box-shadow:0 18px 60px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.06);
    color:#eaf0ff;text-align:center
  }
  #celebration-flag{width:72px;height:auto;margin:0 auto 10px;display:none;border-radius:8px}
  #champagne-anim{width:200px;height:200px;margin:0 auto 12px auto}
  #celebration-title{font-size:clamp(24px,3.2vw,34px);margin:6px 0 4px}
  #celebration-sub{opacity:.9;margin:0 0 16px 0}
  #celebration-close{
    display:inline-block;padding:12px 18px;border:0;border-radius:14px;cursor:pointer;
    background:linear-gradient(90deg,#33d17a,#64f3a4);color:#0b1320;font-weight:700;
    box-shadow:0 8px 24px rgba(50,230,150,.35);
    transition:transform .12s ease, filter .12s ease
  }
  #celebration-close:hover{transform:translateY(-1px);filter:brightness(1.05)}
  #celebration-close:active{transform:translateY(0);filter:brightness(.95)}
  #confetti-canvas{position:absolute;inset:0;pointer-events:none}
  @media (prefers-reduced-motion: reduce){#confetti-canvas{display:none}}
  `;
  const style = document.createElement('style');
  style.id = 'celebration-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

function ensureDom() {
  if (overlayEl) return;
  overlayEl = document.createElement('div');
  overlayEl.id = 'celebration-overlay';
  overlayEl.innerHTML = `
    <div id="celebration-card" role="dialog" aria-modal="true">
      <img id="celebration-flag" alt="">
      <div id="champagne-anim" aria-hidden="true"></div>
      <h2 id="celebration-title">You did it!</h2>
      <p id="celebration-sub">Perfect match!</p>
      <button id="celebration-close">Continue</button>
    </div>
    <canvas id="confetti-canvas"></canvas>
  `;
  document.body.appendChild(overlayEl);

  const closeBtn = overlayEl.querySelector<HTMLButtonElement>('#celebration-close')!;
  closeBtn.addEventListener('click', hide);

  // Click outside to close
  overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) hide(); });
}

function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (!confettiCreator) {
    confettiCreator = (window as any).confetti.create(canvas, { resize:true, useWorker:true });
  }
  const burst = (ratio:number, opts:any) =>
    confettiCreator(Object.assign({
      origin:{y:0.6}, spread:70, startVelocity:52, decay:0.92, scalar:1.0, ticks:220
    }, opts, { particleCount:Math.floor(300*ratio) }));

  burst(0.25,{spread:26,startVelocity:55});
  burst(0.2,{spread:60});
  burst(0.35,{spread:100,decay:0.91,scalar:1.1});
  burst(0.1,{spread:120,startVelocity:35});
  burst(0.1,{spread:140,scalar:1.2});

  const end = Date.now()+1200;
  (function frame(){
    confettiCreator({particleCount:4,angle:60,spread:55,origin:{x:0}});
    confettiCreator({particleCount:4,angle:120,spread:55,origin:{x:1}});
    if(Date.now()<end) requestAnimationFrame(frame);
  })();
}

export function celebrateWin(opts: CelebrateOpts = {}) {
  ensureStyles();
  ensureDom();

  // lock scroll
  document.body.style.overflow = 'hidden';

  (document.getElementById('celebration-title') as HTMLElement).textContent = opts.title || 'You did it!';
  (document.getElementById('celebration-sub') as HTMLElement).textContent = opts.sub || 'Perfect match!';

  const flagEl = document.getElementById('celebration-flag') as HTMLImageElement;
  if (opts.flag) { flagEl.src = opts.flag; flagEl.style.display = 'block'; flagEl.alt = 'Flag'; }
  else { flagEl.style.display = 'none'; }

  // remember post-close action
  onDoneCb = typeof opts.onDone === 'function' ? opts.onDone : null;

  // sounds
  try { new (window as any).Howl({ src:['assets/audio/pop.mp3'], volume:0.7 }).play(); } catch {}
  setTimeout(() => { try { new (window as any).Howl({ src:['assets/audio/win.mp3'], volume:0.6 }).play(); } catch {} }, 120);

  // lottie
  if (lottieInstance) { lottieInstance.destroy(); lottieInstance = null; }
  const animEl = document.getElementById('champagne-anim') as HTMLElement;
  lottieInstance = (window as any).lottie.loadAnimation({
    container:animEl, renderer:'svg', loop:false, autoplay:true, path:'assets/anim/champagne.json'
  });

  fireConfetti();
  overlayEl!.classList.add('show');
}

export function hide() {
  if (!overlayEl) return;
  overlayEl.classList.remove('show');

  // restore scroll
  document.body.style.overflow = '';

  if (lottieInstance) { lottieInstance.destroy(); lottieInstance = null; }

  // run follow-up
  if (onDoneCb) {
    const cb = onDoneCb;
    onDoneCb = null;
    cb();
  }
}
