/* Design preview only: no Tizen calls, installation or startup behavior. */
(function () {
'use strict';
var photos=[
['misty','Misty coast'],['cove','Quiet cove'],['forest','Forest mist'],['valley','Mountain valley'],['night','Desert stars'],['peaks','Blue peaks'],['bridge','Bridge at dusk'],['ridge','Sunlit ridges'],['golden','Golden hour'],['summit','Sunlit summits'],['goldcoast','Gold Coast dusk'],['sydney','Sydney Harbour'],['amber','Amber hills'],['mint','Mint wave'],['alpine','Alpine glow']];
var selected='valley',lastButton=null;
var panel=document.getElementById('panel'),gallery=document.getElementById('gallery'),notice=document.getElementById('notice');
try{var saved=localStorage.getItem('samsungtvhome.design.wallpaper');if(photos.some(function(p){return p[0]===saved;})){selected=saved;}}catch(e){}
function applyPhoto(id){document.getElementById('wallpaper').src='assets/cleanframe/app/assets/wallpapers/'+id+'.jpg';}
applyPhoto(selected);
function close(){panel.hidden=true;if(lastButton)lastButton.focus();}
document.getElementById('close').onclick=close;
function show(kind,button){lastButton=button;gallery.textContent='';panel.hidden=false;
document.getElementById('panel-title').textContent=kind==='apps'?'Alle apps':'Achtergrond kiezen';
document.getElementById('panel-description').textContent=kind==='apps'?'Ontwerpvoorbeeld: jouw tv-apps komen hier.':'15 foto’s uit de CleanFrame-collectie';
if(kind==='apps'){var p=document.createElement('p');p.textContent='Netflix · Prime Video · YouTube';gallery.appendChild(p);}
else photos.forEach(function(photo){var b=document.createElement('button');b.className='photo-choice';b.setAttribute('aria-pressed',String(photo[0]===selected));var img=document.createElement('img');img.src='assets/cleanframe/app/assets/wallpapers/'+photo[0]+'-thumb.jpg';img.alt='';var s=document.createElement('span');s.textContent=photo[1];b.appendChild(img);b.appendChild(s);b.onclick=function(){var candidate=new Image();candidate.onload=function(){selected=photo[0];applyPhoto(selected);try{localStorage.setItem('samsungtvhome.design.wallpaper',selected);}catch(e){notice.textContent='Foto gekozen; voorkeur kon niet worden bewaard.';}close();};candidate.onerror=function(){document.getElementById('panel-description').textContent='Foto kon niet geladen worden. Probeer opnieuw.';};candidate.src='assets/cleanframe/app/assets/wallpapers/'+photo[0]+'.jpg';};gallery.appendChild(b);});
document.getElementById('close').focus();}
Array.prototype.forEach.call(document.querySelectorAll('[data-panel]'),function(b){b.onclick=function(){show(b.getAttribute('data-panel'),b);};});
Array.prototype.forEach.call(document.querySelectorAll('[data-app]'),function(b){b.onfocus=function(){Array.prototype.forEach.call(document.querySelectorAll('.app'),function(a){a.classList.remove('selected');});b.classList.add('selected');};b.onclick=function(){notice.textContent=b.getAttribute('data-app')+' openen — alleen een ontwerpvoorbeeld.';};});
Array.prototype.forEach.call(document.querySelectorAll('[data-input]'),function(b){b.onclick=function(){notice.textContent=b.getAttribute('data-input')+' kiezen — voorbeeld, geen echte verbinding.';};});
document.addEventListener('keydown',function(e){if(e.keyCode===27||e.keyCode===10009){e.preventDefault();close();return;}var list=Array.prototype.slice.call(panel.hidden?document.querySelectorAll('main button'):panel.querySelectorAll('button'));var i=list.indexOf(document.activeElement);var next=i;if(e.keyCode===37)next=i-1;else if(e.keyCode===39)next=i+1;else if(e.keyCode===38)next=i-(panel.hidden?3:5);else if(e.keyCode===40)next=i+(panel.hidden?3:5);else if(e.keyCode===9&&!panel.hidden){next=e.shiftKey?i-1:i+1;}else return;e.preventDefault();if(e.keyCode===9)next=(next+list.length)%list.length;list[Math.max(0,Math.min(next,list.length-1))].focus();});
}());
