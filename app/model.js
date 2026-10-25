/* ES5 model shared by TV runtime and offline tests. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TVHomeModel = api;
}(this, function () {
  'use strict';
  var known = [
    {id:'org.tizen.netflix-app', name:'Netflix', icon:'netflix', aliases:['RN1MCdNq8t.Netflix','org.tizen.netflixlowmem']},
    {id:'evKhCgZelL.AmazonIgnitionLauncher2',name:'Prime Video',icon:'primevideo',aliases:[]},
    {id:'9Ur5IzDKqV.TizenYouTube',name:'YouTube',icon:'youtube',aliases:['com.samsung.tv.cobalt-yt']}
  ];
  var photoIds=['misty','cove','forest','valley','night','peaks','bridge','ridge','golden','summit','goldcoast','sydney','amber','mint','alpine'];
  function defaults(){return {photo:'valley',favorites:known.map(function(a){return {id:a.id,name:a.name,icon:a.icon};}),dim:45,motion:true};}
  function normalize(raw){
    var result=defaults();
    if(!raw||typeof raw!=='object')return result;
    if(photoIds.indexOf(raw.photo)>=0)result.photo=raw.photo;
    if([30,45,60].indexOf(raw.dim)>=0)result.dim=raw.dim;
    if(typeof raw.motion==='boolean')result.motion=raw.motion;
    if(Array.isArray(raw.favorites)){
      var seen=Object.create(null),valid=[];
      raw.favorites.forEach(function(a){
        if(!a||typeof a.id!=='string'||!a.id||a.id.length>180||typeof a.name!=='string'||!a.name.trim()||seen[a.id])return;
        seen[a.id]=true;
        var k=known.filter(function(x){return x.id===a.id;})[0];
        valid.push({id:a.id,name:k?k.name:a.name.slice(0,80),icon:k?k.icon:null});
      });
      if(valid.length)result.favorites=valid.slice(0,30);
    }
    return result;
  }
  function discover(installed, preferredIds){
    preferredIds=preferredIds||[];
    var result=[],skip=Object.create(null),seen=Object.create(null);
    known.forEach(function(k){
      var present=installed.some(function(a){return a.id===k.id;});
      if(present)result.push({id:k.id,name:k.name,icon:k.icon});
      skip[k.id]=true;k.aliases.forEach(function(id){skip[id]=true;});
    });
    installed.forEach(function(a){
      if(!a||typeof a.id!=='string'||typeof a.name!=='string'||skip[a.id]||seen[a.id]||a.show===false)return;
      var name=a.name.trim();
      if(!name||/^(app|service-application|ui-application)$/i.test(name))return;
      if(/e-manual|privacy|teletext|ug-ttx|settings|emanual/i.test(name)||/^(ug-|ise-)/i.test(a.id))return;
      if(/youtube|netflix|test|demo|screensaver|installer|notification|widget|service/i.test(name))return;
      if(/^(org\.|com\.samsung\.|adplatform\.|lib-)/i.test(a.id)&&a.id!=='org.tizen.browser')return;
      if(a.id==='STVHome001.Home')return;
      seen[a.id]=true;
      result.push({id:a.id,name:name.slice(0,80),icon:null});
    });
    var names=Object.create(null);
    result.forEach(function(a){var key=a.name.toLowerCase().replace(/é/g,'e').replace(/[^a-z0-9]/g,'');var previous=names[key];if(!previous||preferredIds.indexOf(a.id)>=0&&preferredIds.indexOf(previous.id)<0)names[key]=a;});
    result=Object.keys(names).map(function(key){return names[key];});
    result.sort(function(a,b){return a.name.toLowerCase().localeCompare(b.name.toLowerCase());});
    return result;
  }
  function hdmi(info){
    var seen=Object.create(null);
    return ((info&&info.connected)||[]).filter(function(s){
      if(s.type!=='HDMI'||typeof s.number!=='number'||seen[s.number])return false;
      seen[s.number]=true;return true;
    }).sort(function(a,b){return a.number-b.number;});
  }
  function move(items,index,delta){
    var result=items.slice(),next=index+delta;
    if(index<0||index>=result.length||next<0||next>=result.length)return result;
    var item=result[index];result[index]=result[next];result[next]=item;return result;
  }
  return {known:known,defaults:defaults,normalize:normalize,discover:discover,hdmi:hdmi,move:move};
}));
