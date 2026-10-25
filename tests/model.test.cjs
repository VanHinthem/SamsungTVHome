const test=require('node:test');
const assert=require('node:assert/strict');
const m=require('../app/model.js');
test('discovery keeps verified launch IDs and excludes aliases and system apps',()=>{
 const apps=m.discover([{id:'org.tizen.netflix-app',name:'Netflix'},{id:'RN1MCdNq8t.Netflix',name:'Netflix'},{id:'org.tizen.netflixlowmem',name:'Netflix'},{id:'9Ur5IzDKqV.TizenYouTube',name:'YouTube'},{id:'com.samsung.tv.cobalt-yt',name:'Youtube'},{id:'com.samsung.tv.cobalt-yttv',name:'YoutubeTV'},{id:'com.samsung.tv.cobalt-app-1566',name:'YouTubeTestSuite'},{id:'evKhCgZelL.AmazonIgnitionLauncher2',name:'Prime Video'},{id:'org.tizen.menu',name:'menu'},{id:'adplatform.ADPlayer',name:''},{id:'rJeHak5zRg.Spotify',name:'Spotify'},{id:'hidden.app',name:'Secret',show:false}]);
 assert.deepEqual(apps.map(a=>a.id).sort(),['org.tizen.netflix-app','9Ur5IzDKqV.TizenYouTube','evKhCgZelL.AmazonIgnitionLauncher2','rJeHak5zRg.Spotify'].sort());
});
test('missing installed services are not invented in catalog',()=>assert.deepEqual(m.discover([]),[]));
test('preferences validate corrupt fields and preserve a usable home',()=>{
 const p=m.normalize({photo:'../../secret',dim:NaN,motion:'yes',favorites:[null,{id:'',name:'bad'}]});
 assert.equal(p.photo,'valley');assert.equal(p.dim,45);assert.equal(p.motion,true);assert.equal(p.favorites.length,3);
});
test('saved unknown favorite survives failed discovery and names are treated as text',()=>{
 const p=m.normalize({favorites:[{id:'user.app',name:'<b>My app</b>'},{id:'user.app',name:'Duplicate'}]});
 assert.equal(p.favorites.length,1);assert.equal(p.favorites[0].name,'<b>My app</b>');
 assert.equal(p.favorites[0].icon,null);
});
test('known favorite identity ignores stored name or icon tampering',()=>{
 const p=m.normalize({favorites:[{id:'org.tizen.netflix-app',name:'Wrong',icon:'../../key'}]});
 assert.equal(p.favorites[0].name,'Netflix');assert.equal(p.favorites[0].icon,'netflix');
});
test('favorite move preserves all IDs and cannot move past edges',()=>{
 const ids=['n','p','y'];assert.deepEqual(m.move(ids,2,-1),['n','y','p']);assert.deepEqual(ids,['n','p','y']);assert.deepEqual(m.move(ids,0,-1),ids);
});
test('HDMI includes connected sources only, deduplicates and sorts',()=>{
 const info={connected:[{type:'HDMI',number:4},{type:'TV',number:0},{type:'HDMI',number:2},{type:'HDMI',number:2}],disconnected:[{type:'HDMI',number:1}]};
 assert.deepEqual(m.hdmi(info).map(s=>s.number),[2,4]);assert.deepEqual(m.hdmi(null),[]);
});
test('favorite persistence has a bounded valid length',()=>{
 const p=m.normalize({favorites:Array.from({length:45},(_,i)=>({id:'user.'+i,name:'App '+i}))});
 assert.equal(p.favorites.length,30);
});

test('TV utilities excluded and duplicate service keeps the favorite ID',()=>{
 const apps=m.discover([{id:'OjBS9h5ZF9.emanual',name:'e-Manual'},{id:'jLU2jKvbyN.PrivacyChoices',name:'PrivacyChoices'},{id:'w2VwCK465D.OTApp',name:'Samsung TV Plus Privacy Settings'},{id:'ug-ttxUG-efl',name:'ug-ttxUG-efl'},{id:'old.Pathe',name:'Pathe Thuis'},{id:'new.Pathe',name:'Pathé Thuis'}],['old.Pathe']);
 assert.deepEqual(apps.map(a=>a.id),['old.Pathe']);
});

test('original local icon retained without changing verified launch identity',()=>{
 const apps=m.discover([{id:'org.tizen.netflix-app',name:'Netflix',iconPath:'/opt/apps/netflix.png'},{id:'user.app',name:'Other',iconPath:'file:///opt/apps/other.png'}]);
 assert.equal(apps.find(a=>a.name==='Netflix').id,'org.tizen.netflix-app');assert.equal(apps.find(a=>a.name==='Netflix').iconPath,'/opt/apps/netflix.png');assert.equal(apps.find(a=>a.name==='Other').iconPath,'file:///opt/apps/other.png');
});
test('store alias can supply artwork while native Netflix remains launch target',()=>{
 const apps=m.discover([{id:'org.tizen.netflix-app',name:'Netflix'},{id:'RN1MCdNq8t.Netflix',name:'Netflix',iconPath:'/opt/apps/store-netflix.png'}]);
 assert.equal(apps.length,1);assert.equal(apps[0].id,'org.tizen.netflix-app');assert.equal(apps[0].iconPath,'/opt/apps/store-netflix.png');
});
test('icon sources cannot trigger remote downloads or script URLs',()=>{
 for(const path of ['https://example.com/icon.png','//example.com/icon.png','javascript:alert(1)','data:image/png;base64,AAAA',null])assert.equal(m.iconPath(path),null);
});

test('Samsung artwork uses store IDs verified on the 2018 firmware',()=>{
 assert.equal(m.artworkSources({id:'org.tizen.netflix-app',icon:'netflix'})[0],'/opt/share/webappservice/apps_icon/FirstScreen/11101200001/250x250.png');
 assert.equal(m.artworkSources({id:'evKhCgZelL.AmazonIgnitionLauncher2',icon:'primevideo'})[0],'/opt/share/webappservice/apps_icon/FirstScreen/3201512006785/250x250.png');
});
test('Samsung cache candidates exclude generic packaged streaming icons',()=>{
 const paths=m.artworkSources({id:'9Ur5IzDKqV.TizenYouTube',icon:'youtube',iconPath:'/opt/apps/generic-tizen.png'});
 assert.equal(paths.length,3);assert.equal(paths[1],'/opt/share/webappservice/apps_icon/Panel/111299001912/250x250.png');assert.equal(paths.includes('/opt/apps/generic-tizen.png'),false);
});
test('unknown app can use its local icon after cache or as sole candidate',()=>{
 assert.deepEqual(m.artworkSources({id:'user.app',iconPath:'/opt/apps/user.png'}),['/opt/apps/user.png']);
 assert.deepEqual(m.artworkSources({id:'user.app',iconPath:'https://example.com/icon.png'}),[]);
});

test('HDMI names migrate safely and stay bounded to real ports',()=>{
 assert.deepEqual(m.normalize({}).hdmiNames,{});
 assert.deepEqual(m.normalize({hdmiNames:{1:'  PlayStation  ',2:'',3:42,4:'a'.repeat(40),5:'invalid'}}).hdmiNames,{1:'PlayStation',4:'a'.repeat(30)});
 assert.equal(m.normalize({hdmiNames:{2:'Ziggo\u0000'}}).hdmiNames[2],'Ziggo');
});

test('photo rotation defaults to fixed and accepts only supported choices',()=>{assert.equal(m.normalize({}).rotation,0);for(const mode of [0,'start',5,15,60])assert.equal(m.normalize({rotation:mode}).rotation,mode);for(const mode of ['5',true,-1,2,null])assert.equal(m.normalize({rotation:mode}).rotation,0);});

test('undo restores the removed app at its original position without discarding other changes',()=>{assert.deepEqual(m.restoreFavorite(['a','c','new'],{id:'b',index:1}),['a','b','c','new']);assert.deepEqual(m.restoreFavorite(['a'],{id:'z',index:8}),['a','z']);assert.deepEqual(m.restoreFavorite(['b'],{id:'a',index:0}),['a','b']);assert.equal(m.restoreFavorite(['a'],{id:'a',index:0}),null);assert.equal(m.restoreFavorite(Array.from({length:30},(_,i)=>String(i)),{id:'extra',index:1}),null);});
