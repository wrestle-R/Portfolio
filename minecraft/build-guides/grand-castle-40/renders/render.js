import * as THREE from '../../renders/exact-40/vendor/three.module.js';

const params = new URLSearchParams(location.search);
const view = params.get('view') || 'exterior';
if(params.has('capture'))document.body.classList.add('capture');
const views = {
  exterior: {title:'Asterfall Castle',note:'Four octagonal towers, pointed roofs and flags, a carved gatehouse and a raised stone terrace.',position:[127,76,-96],target:[28,18,38],fov:31},
  front: {title:'The grand gatehouse',note:'A seven-wide pointed arch beneath the crenellated balcony, flanked by the taller front towers.',position:[28.5,26,-101],target:[28.5,22,28],fov:36},
  upper: {title:'The great trading hall',note:'Twenty librarians on this floor. The seven-wide aisle runs between stone arches, bookshelves, greenery and lanterns.',position:[28.5,14.62,20.5],target:[28.5,16,59],fov:76},
  ground: {title:'The lower trading hall',note:'Twenty librarians beneath the timber deck, with a five-wide rear stair to the upper gallery.',position:[28.5,5.62,20.5],target:[28.5,6,59],fov:76},
  booth: {title:'The working trade counter',note:'Trade through the open gap above the lectern. The glazed header contains the librarian; the door opens onto the service aisle.',position:[28.5,5.62,22.5],target:[23.5,5.62,22.5],fov:66}
};
const config = views[view] || views.exterior;
document.getElementById('title').textContent=config.title;
document.getElementById('note').textContent=config.note;
document.querySelector(`[data-view="${view}"]`)?.setAttribute('aria-current','page');

const [blueprint,assets] = await Promise.all([fetch('blueprint.json').then(r=>r.json()),fetch('models.json').then(r=>r.json())]);
const textureLoader=new THREE.TextureLoader();
const textures=new Map();
await Promise.all(assets.textures.map(async name=>{
  const tex=await textureLoader.loadAsync(`textures/${name}.png`);
  tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestMipmapLinearFilter;
  tex.colorSpace=THREE.SRGBColorSpace;
  textures.set(name,tex);
}));

const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();
scene.background=new THREE.Color('#bedcf0');
const interior=['upper','ground','booth'].includes(view);
scene.add(new THREE.AmbientLight('#e0e5ed',interior?1.4:.85));
scene.add(new THREE.HemisphereLight('#d9edff','#796244',interior?.35:.7));
const sun=new THREE.DirectionalLight('#fff1cd',interior?.85:2.7);
sun.position.set(-30,105,-30);sun.target.position.set(28,0,38);scene.add(sun,sun.target);
sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);
Object.assign(sun.shadow.camera,{left:-90,right:90,top:90,bottom:-90,near:1,far:240});
sun.shadow.bias=-.0002;sun.shadow.normalBias=.035;

function fittedFov(){return interior?config.fov:2*Math.atan(Math.tan(config.fov*Math.PI/360)*Math.max(1,1.6/(innerWidth/innerHeight)))*180/Math.PI}
const camera=new THREE.PerspectiveCamera(fittedFov(),innerWidth/innerHeight,.035,350);
camera.position.fromArray(config.position);camera.lookAt(...config.target);

const fullKeys=new Set(Object.keys(blueprint.catalog).filter(k=>blueprint.catalog[k].full));
const keyAt=(x,y,z)=>`${x},${y},${z}`;
function visible(cell){return true;}
const cells=blueprint.cells.filter(visible);
const map=new Map(cells.map(c=>[keyAt(c.x,c.y,c.z),c]));
const at=(x,y,z)=>map.get(keyAt(x,y,z));
const opaque=(x,y,z)=>fullKeys.has(at(x,y,z)?.key);
const dirs={down:[0,-1,0],up:[0,1,0],north:[0,0,-1],south:[0,0,1],west:[-1,0,0],east:[1,0,0]};
const batches=new Map();
function batch(name){if(!batches.has(name))batches.set(name,{p:[],n:[],uv:[],c:[]});return batches.get(name)}
const radians=THREE.MathUtils.degToRad;
const vec=a=>new THREE.Vector3(...a);
const axes={x:vec([1,0,0]),y:vec([0,1,0]),z:vec([0,0,1])};
function rotate(p,part){
  p.subScalar(.5);
  if(part.x)p.applyAxisAngle(axes.x,-radians(part.x));
  if(part.y)p.applyAxisAngle(axes.y,-radians(part.y));
  return p.addScalar(.5);
}
function faces(from,to){
  const [x,y,z]=from,[X,Y,Z]=to;
  return {
    north:[[X,Y,z],[x,Y,z],[x,y,z],[X,y,z]],
    south:[[x,Y,Z],[X,Y,Z],[X,y,Z],[x,y,Z]],
    west:[[x,Y,z],[x,Y,Z],[x,y,Z],[x,y,z]],
    east:[[X,Y,Z],[X,Y,z],[X,y,z],[X,y,Z]],
    up:[[x,Y,z],[X,Y,z],[X,Y,Z],[x,Y,Z]],
    down:[[x,y,Z],[X,y,Z],[X,y,z],[x,y,z]]
  };
}
function defaultUV(face,from,to){
  const [x,y,z]=from,[X,Y,Z]=to;
  return {down:[x,16-Z,X,16-z],up:[x,z,X,Z],north:[16-X,16-Y,16-x,16-y],south:[x,16-Y,X,16-y],west:[z,16-Y,Z,16-y],east:[16-Z,16-Y,16-z,16-y]}[face];
}
function emit(name,positions,normal,uv,colors=[1,1,1,1]){
  const b=batch(name);
  for(const i of [0,2,1,0,3,2]){
    b.p.push(...positions[i].toArray());b.n.push(...normal.toArray());b.uv.push(...uv[i]);
    b.c.push(colors[i],colors[i],colors[i]);
  }
}
function textureRef(model,ref){
  while(typeof ref==='string'&&ref.startsWith('#'))ref=model.textures[ref.slice(1)];
  return (typeof ref==='object'?ref.sprite:ref).split(':').pop();
}
function ambient(cell,position,normal){
  if(!fullKeys.has(cell.key))return 1;
  const n=normal.toArray().map(Math.round),idx=n.findIndex(v=>v!==0);
  if(idx<0)return 1;
  const tangents=[0,1,2].filter(i=>i!==idx),center=[cell.x+.5,cell.y+.5,cell.z+.5],v=position.toArray();
  const a=[...n],b=[...n],c=[...n];
  a[tangents[0]]=v[tangents[0]]>=center[tangents[0]]?1:-1;
  b[tangents[1]]=v[tangents[1]]>=center[tangents[1]]?1:-1;
  c[tangents[0]]=a[tangents[0]];c[tangents[1]]=b[tangents[1]];
  const solid=o=>Number(opaque(cell.x+o[0],cell.y+o[1],cell.z+o[2]));
  return 1-.11*(solid(a)+solid(b)+solid(c));
}
function blockPart(cell,part){
  const model=assets.models[part.model.split(':').pop()];
  for(const el of model.elements||[]){
    const facePositions=faces(el.from.map(v=>v/16),el.to.map(v=>v/16));
    for(const [face,spec]of Object.entries(el.faces)){
      const normal=vec(dirs[face]);
      if(el.rotation)normal.applyAxisAngle(axes[el.rotation.axis],radians(el.rotation.angle));
      if(part.x)normal.applyAxisAngle(axes.x,-radians(part.x));
      if(part.y)normal.applyAxisAngle(axes.y,-radians(part.y));
      if(spec.cullface){
        const d=rotate(vec(dirs[spec.cullface]).addScalar(.5),part).subScalar(.5).toArray().map(Math.round);
        if(opaque(cell.x+d[0],cell.y+d[1],cell.z+d[2]))continue;
      }
      const positions=facePositions[face].map(p=>{
        let v=vec(p);
        if(el.rotation){
          const r=el.rotation,origin=vec(r.origin.map(v=>v/16));
          v.sub(origin).applyAxisAngle(axes[r.axis],radians(r.angle));
          if(r.rescale){for(const k of ['x','y','z'])if(k!==r.axis)v[k]/=Math.cos(radians(r.angle));}
          v.add(origin);
        }
        return rotate(v,part).add(vec([cell.x,cell.y,cell.z]));
      });
      const name=textureRef(model,spec.texture),tex=textures.get(name),frame=Math.min(1,tex.image.width/tex.image.height);
      const [u,v,U,V]=spec.uv||defaultUV(face,el.from,el.to);
      let uv=[[u/16,1-v/16*frame],[U/16,1-v/16*frame],[U/16,1-V/16*frame],[u/16,1-V/16*frame]];
      const offset=(spec.rotation||0)/90;
      if(offset)uv=uv.map((_,i)=>uv[(i+offset)%4]);
      emit(name,positions,normal,uv,positions.map(p=>ambient(cell,p,normal)));
    }
  }
}
function stateOf(cell){
  const id=blueprint.catalog[cell.key].id;
  const [block,props]=id.split('['),state=Object.fromEntries((props?.replace(']','')||'').split(',').filter(Boolean).map(p=>p.split('=')));
  if(blueprint.catalog[cell.key].connection)for(const direction of ['north','south','east','west']){
    const d=dirs[direction],other=at(cell.x+d[0],cell.y,cell.z+d[2]);
    state[direction]=String(fullKeys.has(other?.key)||other?.key===cell.key);
  }
  return {block:block.split(':').pop(),state};
}
function matches(condition,state){
  if(condition.OR)return condition.OR.some(c=>matches(c,state));
  if(condition.AND)return condition.AND.every(c=>matches(c,state));
  return Object.entries(condition).every(([k,v])=>String(v).split('|').includes(state[k]));
}
for(const cell of cells){
  const {block,state}=stateOf(cell),definition=assets.states[block];
  let parts=[];
  if(definition.variants){
    const match=Object.entries(definition.variants).find(([key])=>matches(Object.fromEntries(key.split(',').filter(Boolean).map(p=>p.split('='))),state));
    if(!match)throw new Error(`No block model for ${block} ${JSON.stringify(state)}`);
    parts=[match[1]];
  }else parts=definition.multipart.filter(p=>!p.when||matches(p.when,state)).map(p=>p.apply);
  for(let part of parts){if(Array.isArray(part))part=part[0];blockPart(cell,part)}
}

// Static villagers use the installed game's atlas and adult VillagerModel dimensions.
// Their positions are the tutorial's standing cells, one entity per booth.
const skin=document.createElement('canvas');skin.width=skin.height=64;
const skinContext=skin.getContext('2d');skinContext.imageSmoothingEnabled=false;
for(const name of ['entity/villager/villager','entity/villager/type/plains','entity/villager/profession/librarian'])skinContext.drawImage(textures.get(name).image,0,0);
const villagerTexture=new THREE.CanvasTexture(skin);villagerTexture.colorSpace=THREE.SRGBColorSpace;villagerTexture.magFilter=villagerTexture.minFilter=THREE.NearestFilter;
textures.set('villager-composite',villagerTexture);
function villagerBox(booth,from,size,uvOrigin,{inflate=0,offset=[0,0,0],angle=0}={}){
  const [u,v]=uvOrigin,[w,h,d]=size;
  const uvRects={west:[u,v+d,u+d,v+d+h],north:[u+d,v+d,u+d+w,v+d+h],east:[u+d+w,v+d,u+2*d+w,v+d+h],south:[u+2*d+w,v+d,u+2*d+2*w,v+d+h],up:[u+d,v,u+d+w,v+d],down:[u+d+w,v,u+d+2*w,v+d]};
  const lower=from.map((p,i)=>p-inflate),upper=from.map((p,i)=>p+size[i]+inflate);
  const raw=faces(lower,upper);
  const yaw=booth.side==='left'?-Math.PI/2:Math.PI/2;
  for(const [face,points]of Object.entries(raw)){
    const positions=points.map(p=>{
      const a=vec(p).applyAxisAngle(axes.x,angle).add(vec(offset));
      // Minecraft entity model coordinates have Y pointing down.
      a.y=24-a.y;
      return a.multiplyScalar(1/16).applyAxisAngle(axes.y,yaw).add(vec([booth.standing+.5,booth.base+1,booth.z+.5]));
    });
    // The Y reflection reverses winding; reverse the corners and their UVs together.
    const [a,b,A,B]=uvRects[face];let uv=[[a/64,1-villagerV(face,b,B,0)/64],[A/64,1-villagerV(face,b,B,0)/64],[A/64,1-villagerV(face,b,B,1)/64],[a/64,1-villagerV(face,b,B,1)/64]];
    const n=vec(dirs[face]).applyAxisAngle(axes.x,angle);n.y=-n.y;n.applyAxisAngle(axes.y,yaw);
    emit('villager-composite',[positions[0],positions[3],positions[2],positions[1]],n,[uv[0],uv[3],uv[2],uv[1]]);
  }
}
function villagerV(face,top,bottom,lower){return face==='up'||face==='down'?(lower?bottom:top):(lower?top:bottom)}
let villagers=0;
for(const b of blueprint.booths){
  villagers++;
  villagerBox(b,[-4,-10,-4],[8,10,8],[0,0]);
  villagerBox(b,[-4,-10,-4],[8,10,8],[32,0],{inflate:.51});
  villagerBox(b,[-1,-1,-6],[2,4,2],[24,0],{offset:[0,-2,0]});
  villagerBox(b,[-4,0,-3],[8,12,6],[16,20]);
  villagerBox(b,[-4,0,-3],[8,20,6],[0,38],{inflate:.5});
  villagerBox(b,[-8,-2,-2],[4,8,4],[44,22],{offset:[0,3,-1],angle:-.75});
  villagerBox(b,[4,-2,-2],[4,8,4],[44,22],{offset:[0,3,-1],angle:-.75});
  villagerBox(b,[-4,2,-2],[8,4,4],[40,38],{offset:[0,3,-1],angle:-.75});
  villagerBox(b,[-2,0,-2],[4,12,4],[0,22],{offset:[-2,12,0]});
  villagerBox(b,[-2,0,-2],[4,12,4],[0,22],{offset:[2,12,0]});
}

for(const [name,b]of batches){
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(b.n,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(b.c,3));
  const material=new THREE.MeshLambertMaterial({map:textures.get(name),vertexColors:true,alphaTest:.075,side:THREE.DoubleSide});
  if(name==='block/oak_leaves')material.color=new THREE.Color('#80ae52');
  if(name==='block/lantern'){material.emissive=new THREE.Color('#e09235');material.emissiveMap=textures.get(name);material.emissiveIntensity=.8;}
  const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=name!=='block/glass'&&name!=='block/glass_pane_top';mesh.receiveShadow=true;scene.add(mesh);
}

for(const b of blueprint.booths){
  const sign=document.createElement('canvas');sign.width=640;sign.height=256;
  const ctx=sign.getContext('2d');ctx.clearRect(0,0,640,256);ctx.fillStyle='#18100a';ctx.textAlign='center';
  ctx.font='bold 36px monospace';ctx.fillText(`LIBRARIAN ${String(b.id).padStart(2,'0')}`,320,66);
  ctx.font='bold 34px monospace';ctx.fillText(b.label[0].toUpperCase(),320,133);
  ctx.font='bold 34px monospace';ctx.fillText(`LEVEL ${b.label[1]}`,320,198);
  const tex=new THREE.CanvasTexture(sign);tex.colorSpace=THREE.SRGBColorSpace;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(.93,.39),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));
  const left=b.side==='left';mesh.position.set(b.sign+(left?.106:.894),b.base+4+8.3333/16,b.z+.5);mesh.rotation.y=left?Math.PI/2:-Math.PI/2;scene.add(mesh);
}

for(const cell of cells.filter(c=>['lantern','lamp'].includes(c.key))){
  if(!interior||Math.abs(cell.y-camera.position.y)>10||Math.abs(cell.z-camera.position.z)>42)continue;
  const light=new THREE.PointLight('#ffba58',18,9,2);light.position.set(cell.x+.5,cell.y+.6,cell.z+.5);scene.add(light);
}

const grass=textures.get('block/grass_block_top').clone();grass.wrapS=grass.wrapT=THREE.RepeatWrapping;grass.repeat.set(2000,2000);grass.needsUpdate=true;
const ground=new THREE.Mesh(new THREE.PlaneGeometry(2000,2000),new THREE.MeshLambertMaterial({map:grass,color:'#7ba753'}));
ground.rotation.x=-Math.PI/2;ground.position.set(28.5,-.015,39.5);ground.receiveShadow=true;scene.add(ground);

function render(){renderer.render(scene,camera)}
render();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.fov=fittedFov();camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);render()});
window.setCamera=(position,target,fov=config.fov)=>{camera.position.fromArray(position);camera.fov=fov;camera.lookAt(...target);camera.updateProjectionMatrix();render()};
window.RENDER_STATS={sourceBlocks:blueprint.cells.length,visibleBlocks:cells.length,totalBooths:blueprint.booths.length,renderedVillagers:villagers,view,sourceSha256:blueprint.sourceSha256,triangles:renderer.info.render.triangles};
window.RENDER_READY=true;
document.getElementById('loading').classList.add('hidden');
