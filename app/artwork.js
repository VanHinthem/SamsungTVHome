/* Read-only Samsung artwork loader. Never reads outside the app-icon cache. */
(function (root, factory) {
  if (typeof module==='object'&&module.exports) module.exports=factory;
  else root.TVArtwork=factory(typeof tizen!=='undefined'?tizen.filesystem:null);
}(this,function (filesystem) {
  'use strict';
  var cache=Object.create(null),pending=Object.create(null),total=0;
  function allowed(path){return typeof path==='string'&&/^\/opt\/share\/webappservice\/apps_icon\/(FirstScreen|Panel|all)\/[A-Za-z0-9]{1,40}\/(250x250|304x304)\.png$/.test(path);}
  function load(path,success,failure){
    if(!allowed(path)||!filesystem){failure();return;}
    if(cache[path]){success(cache[path]);return;}
    if(pending[path]){pending[path].push([success,failure]);return;}
    pending[path]=[[success,failure]];
    var finished=false;
    var timer=setTimeout(function(){finish(null);},4000);
    function finish(uri){
      if(finished)return;
      finished=true;clearTimeout(timer);
      var callbacks=pending[path]||[];delete pending[path];
      if(uri){if(total+uri.length>2097152){cache=Object.create(null);total=0;}cache[path]=uri;total+=uri.length;}
      callbacks.forEach(function(pair){if(uri)pair[0](uri);else pair[1]();});
    }
    try{
      filesystem.resolve(path,function(file){
        if(finished)return;
        if(!file.isFile||typeof file.fileSize!=='number'||file.fileSize<1||file.fileSize>262144){finish(null);return;}
        try{file.openStream('r',function(stream){
          if(finished){try{stream.close();}catch(ignore){}return;}
          var data=null;
          try{data=stream.readBase64(file.fileSize);}catch(error){}
          try{stream.close();}catch(ignore){}
          finish(data?'data:image/png;base64,'+data:null);
        },function(){finish(null);});}catch(error){finish(null);}
      },function(){finish(null);},'r');
    }catch(error){finish(null);}
  }
  return {allowed:allowed,load:load};
}));
