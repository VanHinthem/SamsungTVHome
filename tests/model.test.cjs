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
