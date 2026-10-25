/* SamsungTVHome 0.2.0. ES5, local assets, no autostart or Home routing. */
(function () {
'use strict';
var base='vendor/cleanframe/app/assets/';
var model=window.TVHomeModel,onTV=typeof tizen!=='undefined',savedApps={},sources=[],launchBusy=false,launchTimer=null,launchSerial=0,lastHomeId=null,catalogAt=0;
var photos=[['misty','Misty coast'],['cove','Quiet cove'],['forest','Forest mist'],['valley','Mountain valley'],['night','Desert stars'],['peaks','Blue peaks'],['bridge','Bridge at dusk'],['ridge','Sunlit ridges'],['golden','Golden hour'],['summit','Sunlit summits'],['goldcoast','Gold Coast dusk'],['sydney','Sydney Harbour'],['amber','Amber hills'],['mint','Mint wave'],['alpine','Alpine glow']];
var catalog=model.known.map(function(a){return {id:a.id,name:a.name,icon:a.icon};});
var defaults={photo:'valley',favorites:model.known.map(function(a){return a.id;}),dim:45,motion:true};
var prefs=JSON.parse(JSON.stringify(defaults)),state={view:'home',group:'background',app:'org.tizen.netflix-app'},stack=[],lastButton=null,token=0;
var panel=document.getElementById('panel'),gallery=document.getElementById('gallery'),notice=document.getElementById('notice');
try {
 var normalized=model.normalize(JSON.parse(localStorage.getItem('samsungtvhome.preferences.v1')));
 normalized.favorites.forEach(function(a){savedApps[a.id]=a;});
 prefs={photo:normalized.photo,dim:normalized.dim,motion:normalized.motion,favorites:normalized.favorites.map(function(a){return a.id;})};
} catch(e) { /* Invalid/unavailable storage retains usable defaults. */ }
function byId(id){return catalog.filter(function(a){return a.id===id;})[0]||savedApps[id]||{id:id,name:'App niet beschikbaar',icon:null};}
function photoName(){return photos.filter(function(p){return p[0]===prefs.photo;})[0][1];}
function tell(s){var n=document.getElementById('panel-notice');if(n)n.textContent=s;notice.textContent=s;}
function save(next){
 var serialized=JSON.parse(JSON.stringify(next));
 serialized.favorites=next.favorites.map(function(id){var a=byId(id);return {id:id,name:a.name,icon:a.icon||null};});
 try{localStorage.setItem('samsungtvhome.preferences.v1',JSON.stringify(serialized));prefs=next;serialized.favorites.forEach(function(a){savedApps[a.id]=a;});return true;}
 catch(e){tell('Bewaren niet gelukt. Je vorige keuzes blijven behouden.');return false;}
}
function copy(){return JSON.parse(JSON.stringify(prefs));}
function apply(){document.getElementById('wallpaper').src=base+'wallpapers/'+prefs.photo+'.jpg';document.querySelector('.shade').style.background='linear-gradient(180deg,rgba(4,12,16,.25),rgba(4,12,16,'+(prefs.dim/100)+') 62%,rgba(4,12,16,.88))';document.getElementById('scene').classList.toggle('no-motion',!prefs.motion);}
function button(text,fn,cls){var b=document.createElement('button');b.type='button';b.textContent=text;if(cls)b.className=cls;b.onclick=fn;return b;}
function mark(app){if(app.icon){var img=document.createElement('img');img.src=base+'icons/'+app.icon+'.svg';img.alt='';img.className='brand-icon '+app.icon;return img;}var s=document.createElement('span');s.className='initials';s.textContent=app.name.slice(0,3).toUpperCase();return s;}
function renderHome(){var row=document.querySelector('.apps');row.textContent='';prefs.favorites.forEach(function(id,i){var a=byId(id),b=button('',function(){launchApp(a.id,a.name);lastHomeId=a.id;},'app'+(i===0?' selected':''));b.setAttribute('aria-label',a.name);b.disabled=!panel.hidden;var logo=document.createElement('span');logo.className='logo';logo.appendChild(mark(a));var bottom=document.createElement('span');bottom.className='app-bottom';bottom.textContent=a.name;b.appendChild(logo);b.appendChild(bottom);b.onfocus=function(){Array.prototype.forEach.call(row.children,function(x){x.classList.remove('selected');});b.classList.add('selected');};row.appendChild(b);});}
function enter(view){stack.push(JSON.parse(JSON.stringify(state)));state.view=view;token++;renderPanel();}
function close(){token++;panel.hidden=true;Array.prototype.forEach.call(document.querySelectorAll('main button'),function(b){b.disabled=false;});document.querySelector('main').removeAttribute('aria-hidden');state.view='home';stack=[];renderHome();if(lastButton&&document.contains(lastButton))lastButton.focus();}
function back(){token++;if(stack.length){state=stack.pop();if(state.view==='home')close();else renderPanel();}else close();}
document.getElementById('close').onclick=back;
function open(kind,buttonEl){lastButton=buttonEl;state={view:kind,group:'background',app:'org.tizen.netflix-app'};stack=[{view:'home',group:'background',app:'org.tizen.netflix-app'}];token++;panel.hidden=false;Array.prototype.forEach.call(document.querySelectorAll('main button'),function(b){b.disabled=true;});document.querySelector('main').setAttribute('aria-hidden','true');renderPanel();if(kind==='apps')refreshCatalog();}
function renderPanel(){gallery.textContent='';gallery.className='panel-body';document.getElementById('close').textContent='← Terug';document.getElementById('panel-title').textContent=state.view==='apps'?'Alle apps':state.view==='detail'?byId(state.app).name:'Instellingen';document.getElementById('panel-description').textContent=state.view==='apps'?'Kies een app om te openen of aan je startscherm toe te voegen.':state.view==='detail'?'Je startscherm aanpassen verwijdert geen apps van je tv.':'Maak het startscherm van jou.';
if(state.view==='apps')renderApps();else if(state.view==='detail')renderDetail();else renderSettings();
var note=document.createElement('p');note.id='panel-notice';note.className='panel-notice';note.setAttribute('role','status');note.setAttribute('aria-live','polite');gallery.appendChild(note);
document.getElementById('close').focus();}
function renderApps(){var head=document.createElement('div');head.className='catalog-meta';head.textContent=catalog.length+' apps · '+prefs.favorites.length+' op je startscherm';gallery.appendChild(head);var grid=document.createElement('div');grid.className='catalog-grid';catalog.forEach(function(a){var b=button('',function(){state.app=a.id;enter('detail');},'catalog-tile');var logo=document.createElement('span');logo.className='catalog-logo';logo.appendChild(mark(a));var title=document.createElement('span');title.className='catalog-name';title.textContent=a.name;var badge=document.createElement('span');badge.className='favorite-badge';badge.textContent=prefs.favorites.indexOf(a.id)>=0?'★ Op startscherm':'+ Toevoegen';b.appendChild(logo);b.appendChild(title);b.appendChild(badge);grid.appendChild(b);});gallery.appendChild(grid);var note=document.createElement('p');note.className='example-label';note.textContent=onTV?'Geïnstalleerde apps · systeemonderdelen en dubbele vermeldingen worden gefilterd.':'Browservoorbeeld · de appcatalogus wordt op de tv opgehaald.';gallery.appendChild(note);}
function renderDetail(){var a=byId(state.app),wrap=document.createElement('div');wrap.className='app-detail';var art=document.createElement('div');art.className='detail-art';art.appendChild(mark(a));wrap.appendChild(art);var actions=document.createElement('div');actions.className='detail-actions';var h=document.createElement('h3');h.textContent=a.name;actions.appendChild(h);actions.appendChild(button('Openen ↗',function(){launchApp(a.id,a.name);},'primary-action'));var pinned=prefs.favorites.indexOf(a.id)>=0;actions.appendChild(button(pinned?'− Van startscherm verwijderen':'+ Aan startscherm toevoegen',function(){if(pinned&&prefs.favorites.length===1){tell('Bewaar minstens één app op je startscherm.');return;}var next=copy();if(pinned)next.favorites=next.favorites.filter(function(id){return id!==a.id;});else {if(next.favorites.length>=30){tell('Je kunt maximaal 30 favorieten bewaren.');return;}next.favorites.push(a.id);}if(save(next)){renderHome();renderPanel();tell(pinned?'Van startscherm verwijderd. De app blijft geïnstalleerd.':'Aan je startscherm toegevoegd.');}},'secondary-action'));var p=document.createElement('p');p.textContent='Verwijderen van je startscherm wist de app niet.';actions.appendChild(p);wrap.appendChild(actions);gallery.appendChild(wrap);}
function settingShell(){var shell=document.createElement('div');shell.className='settings-shell';var nav=document.createElement('nav');nav.className='settings-nav';nav.setAttribute('aria-label','Instellingengroepen');[['background','Achtergrond'],['appearance','Uiterlijk'],['favorites','Apps op startscherm']].forEach(function(g){var b=button(g[1],function(){state.group=g[0];token++;renderPanel();var selected=gallery.querySelector('.settings-nav .active');if(selected)selected.focus();},state.group===g[0]?'active':'');b.setAttribute('aria-pressed',String(state.group===g[0]));nav.appendChild(b);});var body=document.createElement('div');body.className='settings-content';shell.appendChild(nav);shell.appendChild(body);gallery.appendChild(shell);return body;}
function heading(parent,title,text){var h=document.createElement('h3');h.textContent=title;parent.appendChild(h);var p=document.createElement('p');p.className='setting-description';p.textContent=text;parent.appendChild(p);}
function renderSettings(){var body=settingShell();if(state.group==='background'){heading(body,'Kies je uitzicht','Je huidige foto blijft actief totdat je een andere kiest.');var area=document.createElement('div');area.className='photo-setting';var current=document.createElement('div');current.className='current-photo';var img=document.createElement('img');img.src=base+'wallpapers/'+prefs.photo+'.jpg';img.alt=photoName();current.appendChild(img);var name=document.createElement('span');name.textContent='Huidige foto · '+photoName();current.appendChild(name);area.appendChild(current);var grid=document.createElement('div');grid.className='wallpaper-grid';photos.forEach(function(photo){var b=button('',function(){var expected=++token;var candidate=new Image();tell('Foto laden…');candidate.onload=function(){if(expected!==token||panel.hidden||state.group!=='background')return;var next=copy();next.photo=photo[0];if(save(next)){apply();renderPanel();var active=gallery.querySelector('.wallpaper-grid [aria-pressed=true]');if(active)active.focus();tell('Achtergrond ingesteld op '+photo[1]+'.');}};candidate.onerror=function(){if(expected===token)tell('Foto kon niet geladen worden; je vorige foto blijft behouden.');};candidate.src=base+'wallpapers/'+photo[0]+'.jpg';},'photo-choice');b.setAttribute('aria-label',photo[1]);b.setAttribute('aria-pressed',String(photo[0]===prefs.photo));var t=document.createElement('img');t.src=base+'wallpapers/'+photo[0]+'-thumb.jpg';t.alt='';var s=document.createElement('span');s.textContent=(photo[0]===prefs.photo?'✓ ':'')+photo[1];b.appendChild(t);b.appendChild(s);grid.appendChild(b);});area.appendChild(grid);body.appendChild(area);}
else if(state.group==='appearance'){heading(body,'Rustig en leesbaar','Pas het contrast en de beweging aan.');var label=document.createElement('h4');label.textContent='Foto verduisteren';body.appendChild(label);var choices=document.createElement('div');choices.className='choice-row';[[30,'Licht'],[45,'Gemiddeld'],[60,'Donker']].forEach(function(c){var b=button(c[1],function(){var next=copy();next.dim=c[0];if(save(next)){apply();renderPanel();}},'option');b.setAttribute('aria-pressed',String(prefs.dim===c[0]));choices.appendChild(b);});body.appendChild(choices);var row=document.createElement('div');row.className='setting-row';var text=document.createElement('div');text.innerHTML='<strong>Subtiele beweging</strong><span>Kleine focusovergangen tussen de tegels.</span>';row.appendChild(text);var toggle=button(prefs.motion?'Aan':'Uit',function(){var next=copy();next.motion=!prefs.motion;if(save(next)){apply();renderPanel();}},'option');toggle.setAttribute('aria-pressed',String(prefs.motion));row.appendChild(toggle);body.appendChild(row);}
else{heading(body,'Jouw apps, jouw volgorde','Verplaats favorieten met de knoppen. Verbergen verwijdert de app niet van je tv.');var list=document.createElement('div');list.className='favorite-list';prefs.favorites.forEach(function(id,i){var a=byId(id),row=document.createElement('div');row.className='favorite-row';var n=document.createElement('span');n.className='order';n.textContent=('0'+(i+1)).slice(-2);row.appendChild(n);var title=document.createElement('span');title.className='favorite-title';title.textContent=a.name;row.appendChild(title);[['←',-1],['→',1]].forEach(function(dir){var b=button(dir[0],function(){var next=copy(),j=i+dir[1];next.favorites=model.move(next.favorites,i,dir[1]);if(save(next)){renderHome();renderPanel();var focusRow=gallery.querySelectorAll('.favorite-row')[j];if(focusRow)focusRow.querySelector('button:not(:disabled)').focus();}},'move');b.disabled=i+dir[1]<0||i+dir[1]>=prefs.favorites.length;b.setAttribute('aria-label',a.name+(dir[1]<0?' eerder':' later'));row.appendChild(b);});row.appendChild(button('Verbergen',function(){if(prefs.favorites.length===1){tell('Bewaar minstens één app op je startscherm.');return;}var next=copy();next.favorites.splice(i,1);if(save(next)){renderHome();renderPanel();}},'hide-app'));list.appendChild(row);});body.appendChild(list);body.appendChild(button('+ Apps toevoegen',function(){enter('apps');refreshCatalog();},'secondary-action'));}}
Array.prototype.forEach.call(document.querySelectorAll('[data-panel]'),function(b){b.onclick=function(){open(b.getAttribute('data-panel'),b);};});
document.addEventListener('keydown',function(e){if(e.keyCode===27||e.keyCode===10009){e.preventDefault();if(!panel.hidden)back();else if(onTV){try{tizen.application.getCurrentApplication().exit();}catch(error){fail(error);}}return;}var list=Array.prototype.slice.call((panel.hidden?document.querySelector('main'):panel).querySelectorAll('button:not(:disabled)'));if(!list.length)return;var current=document.activeElement,i=list.indexOf(current);if(e.keyCode===13){e.preventDefault();if(!e.repeat&&document.activeElement&&document.activeElement.tagName==='BUTTON')document.activeElement.click();return;}if(e.keyCode===9&&!panel.hidden){e.preventDefault();list[(i+(e.shiftKey?-1:1)+list.length)%list.length].focus();return;}if([37,38,39,40].indexOf(e.keyCode)<0)return;e.preventDefault();if(i<0){list[0].focus();return;}var r=current.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,best=null,score=Infinity;list.forEach(function(b){if(b===current)return;var q=b.getBoundingClientRect(),dx=q.left+q.width/2-cx,dy=q.top+q.height/2-cy;var horizontal=e.keyCode===37||e.keyCode===39,forward=horizontal?dx:dy,cross=horizontal?dy:dx;if((e.keyCode===37||e.keyCode===38)?forward>=-2:forward<=2)return;var s=Math.abs(forward)+Math.abs(cross)*3;if(s<score){score=s;best=b;}});if(best){best.focus();var bounds=best.getBoundingClientRect();if(bounds.top<0||bounds.bottom>window.innerHeight)best.scrollIntoView(false);}});

function fail(error){launchBusy=false;clearTimeout(launchTimer);tell('Niet gelukt: '+(error&&(error.message||error.name)||'onbekende fout')+'. Probeer opnieuw.');}
function launchApp(id,name){
 if(launchBusy)return;
 if(!onTV){tell('Browservoorbeeld: '+name+' openen werkt alleen op de tv.');return;}
 launchBusy=true;var serial=++launchSerial;
 tell(name+' openen…');
 launchTimer=setTimeout(function(){if(serial!==launchSerial)return;launchBusy=false;tell('Geen bevestiging ontvangen. Controleer de tv en probeer zo nodig opnieuw.');},15000);
 try{tizen.application.launch(id,function(){if(serial!==launchSerial)return;clearTimeout(launchTimer);launchBusy=false;tell('Startopdracht voor '+name+' verzonden.');},function(e){if(serial===launchSerial)fail(e);});}catch(e){fail(e);}
}
function refreshCatalog(){
 if(!onTV){catalog=prefs.favorites.map(byId);if(state.view==='apps')renderPanel();return;}
 if(Date.now()-catalogAt<60000)return;
 try{tizen.application.getAppsInfo(function(installed){
  catalog=model.discover(installed,prefs.favorites);catalogAt=Date.now();
  catalog.forEach(function(a){savedApps[a.id]=a;});
  if(state.view==='apps'&&!panel.hidden)renderPanel();
 },function(e){catalogAt=0;tell('Apps ophalen niet gelukt. Sluit en open Alle apps om opnieuw te proberen.');});}
 catch(e){tell('Apps ophalen niet gelukt: '+(e.message||e.name));}
}
function refreshInputs(){
 var container=document.getElementById('inputs');
 if(!onTV){container.textContent='HDMI-ingangen zijn alleen op de tv beschikbaar.';return;}
 try{tizen.systeminfo.getPropertyValue('VIDEOSOURCE',function(info){
  sources=model.hdmi(info);var previous=document.activeElement&&document.activeElement.getAttribute('data-hdmi');container.textContent='';
  if(!sources.length){container.appendChild(button('Opnieuw zoeken',refreshInputs));var p=document.createElement('p');p.textContent='Geen aangesloten HDMI-ingangen.';container.appendChild(p);return;}
  sources.forEach(function(source){var b=button('',function(){openHDMI(source);});b.setAttribute('data-hdmi',String(source.number));var port=document.createElement('span');port.className='port';port.textContent='↳';var label=document.createElement('span');label.textContent='HDMI '+source.number;var small=document.createElement('small');small.textContent='Aangesloten';label.appendChild(small);var dot=document.createElement('span');dot.className='dot';b.appendChild(port);b.appendChild(label);b.appendChild(dot);if(!panel.hidden)b.disabled=true;container.appendChild(b);});
  if(previous&&panel.hidden){var active=container.querySelector('[data-hdmi="'+previous+'"]');if(active)active.focus();}
 },function(){container.textContent='HDMI ophalen mislukt.';container.appendChild(button('Opnieuw proberen',refreshInputs));});}
 catch(e){container.textContent='HDMI niet beschikbaar: '+(e.message||e.name);}
}
function openHDMI(source){
 if(launchBusy)return;
 launchBusy=true;var serial=++launchSerial;
 tell('HDMI '+source.number+' openen…');
 launchTimer=setTimeout(function(){if(serial===launchSerial){launchBusy=false;tell('HDMI reageert niet. Probeer opnieuw.');}},15000);
 try{tizen.tvwindow.setSource(source,function(){if(serial!==launchSerial)return;clearTimeout(launchTimer);launchBusy=false;launchApp('org.tizen.tv-viewer','HDMI '+source.number);},function(e){if(serial===launchSerial)fail(e);});}catch(e){fail(e);}
}
function clock(){
 var now=new Date(),days=['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'],months=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
 document.getElementById('clock').textContent=('0'+now.getHours()).slice(-2)+':'+('0'+now.getMinutes()).slice(-2);
 document.getElementById('date').textContent=days[now.getDay()]+' '+now.getDate()+' '+months[now.getMonth()];
}
document.addEventListener('visibilitychange',function(){
 if(document.hidden){token++;return;}
 launchSerial++;launchBusy=false;clearTimeout(launchTimer);clock();
 if(panel.hidden&&lastHomeId){var buttons=document.querySelectorAll('main .app');for(var i=0;i<buttons.length;i++){if(prefs.favorites[i]===lastHomeId){buttons[i].focus();break;}}}
 refreshInputs();
});
apply();renderHome();clock();setInterval(clock,30000);refreshCatalog();refreshInputs();
var first=document.querySelector('main .app');if(first)first.focus();
}());
