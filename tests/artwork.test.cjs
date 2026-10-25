const test=require('node:test');
const assert=require('node:assert/strict');
const create=require('../app/artwork.js');
const path='/opt/share/webappservice/apps_icon/Panel/11101200001/250x250.png';
test('only fixed PNG files inside the Samsung icon cache can be read',()=>{
 let reads=0;const loader=create({resolve(){reads++;}});
 for(const bad of ['/etc/passwd',path+'/../secret','https://example.com/a.png','/opt/share/webappservice/apps_icon/Panel/../250x250.png']){
  let failed=false;loader.load(bad,()=>assert.fail('unexpected read'),()=>{failed=true;});assert.ok(failed);
 }
 assert.equal(reads,0);
});
test('cache file is read in read-only mode and stream is closed',()=>{
 let reads=0,closed=0;
 const loader=create({resolve(p,ok,fail,mode){reads++;assert.equal(mode,'r');ok({isFile:true,fileSize:3,openStream(mode,ok){assert.equal(mode,'r');ok({readBase64(n){assert.equal(n,3);return 'YWJj';},close(){closed++;}});}});}});
 let value;loader.load(path,v=>{value=v;},()=>assert.fail('read failed'));
 assert.equal(value,'data:image/png;base64,YWJj');assert.equal(closed,1);
 loader.load(path,v=>assert.equal(v,value),()=>assert.fail('cache failed'));assert.equal(reads,1);
});
test('simultaneous consumers share one read',()=>{
 let reads=0,resolveFile,count=0;
 const loader=create({resolve(p,ok){reads++;resolveFile=ok;}});
 loader.load(path,()=>count++,()=>assert.fail('failed'));loader.load(path,()=>count++,()=>assert.fail('failed'));
 assert.equal(reads,1);
 resolveFile({isFile:true,fileSize:3,openStream(mode,ok){ok({readBase64(){return 'YWJj';},close(){}});}});
 assert.equal(count,2);
});
test('oversized or directory entries do not open a stream',()=>{
 for(const file of [{isFile:false,fileSize:3},{isFile:true,fileSize:262145},{isFile:true,fileSize:0}]){
  file.openStream=()=>assert.fail('must not open');let failed=false;
  create({resolve(p,ok){ok(file);}}).load(path,()=>assert.fail('must not succeed'),()=>{failed=true;});assert.ok(failed);
 }
});
test('read errors close the stream and preserve fallback',()=>{
 let closed=0,failed=false;
 create({resolve(p,ok){ok({isFile:true,fileSize:3,openStream(mode,ok){ok({readBase64(){throw Error('Denied');},close(){closed++;}});}});}}).load(path,()=>assert.fail('unexpected success'),()=>{failed=true;});
 assert.equal(closed,1);assert.ok(failed);
});
test('absent filesystem fails without touching device resources',()=>{
 let failed=false;create(null).load(path,()=>assert.fail('unexpected success'),()=>{failed=true;});assert.ok(failed);
});
