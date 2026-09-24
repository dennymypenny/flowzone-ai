/* The 2.5s FlowZone intro reel on the homepage.

   Two 4K renders: 3840x2160 for desktop and 2160x3840 for phones, picked by
   the screen's shape. The head script in layout.tsx puts fz-intro-on on
   <html> before first paint (homepage only, not for crawlers). Everything
   below is plain HTML and one inline script, so it starts while the page is
   still parsing and never waits on React.

   If a device will not play the video (Low Power Mode on iPhone, a decoder
   that refuses 4K portrait, a slow first byte), the same reel runs live in
   the page instead: the stage below is the board the video was rendered
   from, driven by the same render(t). Either way the viewer sees the reel. */

const SRC_DESKTOP = "/assets/flowzone-intro-desktop.mp4";
const SRC_PHONE = "/assets/flowzone-intro-phone.mp4";

const HTML = `
<video class="fzi-video" muted playsinline webkit-playsinline preload="auto" disableremoteplayback aria-hidden="true" tabindex="-1"></video>
<div class="fzi-stage" aria-hidden="true">
  <div class="fzi-glow"></div>
  <div class="fzi-bar"></div>
  <div class="fzi-lockup">
    <svg class="fzi-mark" viewBox="0 0 58 18" overflow="visible">
      <line class="fzi-l1" x1="10.5" y1="9" x2="10.5" y2="9" stroke="#DDEEFB" stroke-width="1.2"/>
      <line class="fzi-l2" x1="34.5" y1="9" x2="34.5" y2="9" stroke="#DDEEFB" stroke-width="1.2"/>
      <circle class="fzi-d1" cx="6" cy="9" r="5.6" fill="#1E3A8A" stroke="#4C7BE8" stroke-width="0.5" transform="scale(0)"/>
      <circle class="fzi-d2" cx="29" cy="9" r="5.6" fill="#5B9BF9" transform="scale(0)"/>
      <circle class="fzi-d3" cx="52" cy="9" r="5.6" fill="#C6E4F8" transform="scale(0)"/>
    </svg>
    <span class="fzi-clip"><span class="fzi-name">FlowZone</span></span>
  </div>
  <div class="fzi-tag"><b>You imagine it.</b> We get it <i>moving.</i></div>
</div>
<script>(function(){try{
var h=document.documentElement;if(!h.classList.contains('fz-intro-on'))return;
var box=document.getElementById('fz-intro'),v=box.querySelector('.fzi-video'),st=box.querySelector('.fzi-stage');
var P=innerHeight>innerWidth,done=false,live=false;
function leave(){if(done)return;done=true;h.classList.add('fz-intro-out');setTimeout(function(){h.classList.remove('fz-intro-on','fz-intro-out');try{v.pause();v.removeAttribute('src');v.load()}catch(e){}},600)}
var q=function(c){return st.querySelector(c)},clamp=function(x){return x<0?0:x>1?1:x},seg=function(t,a,b){return clamp((t-a)/(b-a))},
eo=function(x){return 1-Math.pow(1-x,3)},eb=function(x){return 1-Math.pow(1-x,4)},
back=function(x){var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)},lerp=function(a,b,x){return a+(b-a)*x};
function render(t){
var W=P?1080:1920,H=P?1920:1080,markH=P?150:96,lock=q('.fzi-lockup'),name=q('.fzi-name'),clip=q('.fzi-clip'),tag=q('.fzi-tag');
var amb=eo(seg(t,0,.6))*(1-seg(t,2.1,2.5));
q('.fzi-glow').style.background='radial-gradient('+(P?'70% 45%':'55% 60%')+' at '+lerp(38,52,seg(t,0,2.5))+'% 50%, rgba(76,123,232,'+(.10*amb)+') 0%, rgba(76,123,232,0) 70%)';
var bw=eo(seg(t,0,.55)),br=eo(seg(t,2.1,2.45)),bar=q('.fzi-bar');bar.style.left=(br*100)+'%';bar.style.width=((1-br)*100*bw)+'%';
[.08,.2,.32].forEach(function(a,i){var p=seg(t,a,a+.34),s=p<=0?0:back(p),cx=[6,29,52][i];q('.fzi-d'+(i+1)).setAttribute('transform','translate('+cx+' 9) scale('+s+') translate('+(-cx)+' -9)')});
var c1=eo(seg(t,.24,.46)),c2=eo(seg(t,.36,.58));q('.fzi-l1').setAttribute('x2',lerp(10.5,23.5,c1));q('.fzi-l2').setAttribute('x2',lerp(34.5,46.5,c2));
var nr=eb(seg(t,.55,1.1)),nw=name.offsetWidth,ex=Math.pow(seg(t,2,2.5),2.4),dx=ex*W*.12,fade=1-eo(seg(t,2.05,2.45)),tr;
if(P){clip.style.width=nw+'px';clip.style.clipPath='inset(0 '+((1-nr)*100)+'% 0 0)';name.style.transform='translateX('+((1-nr)*-40)+'px)';
var lift=eb(seg(t,.52,1.05)),full=lock.offsetHeight;tr='translate(-50%,'+(lerp((full-markH)/2,0,lift)-full/2-90)+'px)'}
else{clip.style.width=(nw*nr)+'px';name.style.transform='translateX('+((1-nr)*-60)+'px)';lock.style.gap=(markH*.42*nr)+'px';tr='translate(-50%, calc(-50% - 62px))'}
name.style.opacity=nr>0?1:0;lock.style.transform=tr+' translateX('+dx+'px)';lock.style.opacity=fade;
var tg=eb(seg(t,.95,1.4));tag.style.top=(H/2+(P?190:40))+'px';tag.style.opacity=tg*fade;tag.style.transform='translate(calc(-50% + '+((1-tg)*-50)+'px),0) translateX('+(dx*1.15)+'px)';
}
function fit(){var W=P?1080:1920,H=P?1920:1080,s=Math.max(innerWidth/W,innerHeight/H);st.style.width=W+'px';st.style.height=H+'px';st.style.transform='translate(-50%,-50%) scale('+s+')'}
function goLive(){if(live||done)return;live=true;try{v.pause()}catch(e){}v.style.display='none';
if(P){st.classList.add('fzi-p');q('.fzi-tag').innerHTML='<b>You imagine it.</b><br>We get it <i>moving.</i>'}
fit();st.style.display='block';render(0);var s0=null;
function f(now){if(s0===null)s0=now;var t=(now-s0)/1000;render(Math.min(t,2.5));if(t>=2.05)leave();if(t<2.6)requestAnimationFrame(f)}requestAnimationFrame(f)}
v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.src=P?'${SRC_PHONE}':'${SRC_DESKTOP}';
v.addEventListener('timeupdate',function(){if(!live&&v.currentTime>=2.05)leave()});
v.addEventListener('ended',leave);v.addEventListener('error',goLive);
var pr=v.play();if(pr&&pr.catch)pr.catch(goLive);
setTimeout(function(){if(!live&&!done&&(v.paused||v.currentTime<.05))goLive()},900);
setTimeout(leave,4200);
}catch(e){try{document.documentElement.classList.remove('fz-intro-on')}catch(_){}}})();</script>`;

export default function Intro() {
  return <div id="fz-intro" className="fz-intro" dangerouslySetInnerHTML={{ __html: HTML }} />;
}
