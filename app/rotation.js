/* ES5 timer: counts only time spent on visible Home. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.TVPhotoRotation=factory;}(this,function(options){
'use strict';
var schedule=options.setTimeout||setTimeout,cancel=options.clearTimeout||clearTimeout,now=options.now||Date.now;
var mode=0,active=false,timer=null,remaining=0,started=0;
function stop(){if(timer!==null){cancel(timer);timer=null;remaining=Math.max(0,remaining-(now()-started));}}
function arm(){if(!active||typeof mode!=='number'||mode===0||timer!==null)return;started=now();timer=schedule(function(){timer=null;remaining=mode*60000;options.next();arm();},remaining);}
return {setMode:function(value){stop();mode=[0,'start',5,15,60].indexOf(value)>=0?value:0;remaining=typeof mode==='number'?mode*60000:0;arm();},setActive:function(value){if(active===value)return;stop();active=value;arm();},start:function(){if(mode==='start')options.next();}};
}));
