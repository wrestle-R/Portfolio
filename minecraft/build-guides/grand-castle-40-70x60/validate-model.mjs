import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),window={};
new Function('window',fs.readFileSync(path.join(root,'model.js'),'utf8'))(window);
const d=window.GRAND_CASTLE_DATA,{width:W,depth:D,layers,catalog:C}=d;
const at=(x,y,z)=>layers[y]?.[z*W+x]||null;
const cells=layers.flat().filter(Boolean);
const items=name=>cells.filter(c=>C[c.key].name===name).length;
assert.equal(d.booths.length,40);
assert.equal(W,60);
assert.equal(D,70);
assert.equal(d.height,50);
assert.equal(layers.length,50);
assert(layers.every(l=>l.length===W*D),'Every layer must fit the 70 × 60 plot');
assert.equal(items('Lectern'),40);
assert.equal(items('Dark Oak Door'),80);
assert.equal(items('Dark Oak Sign'),40);
assert.equal(new Set(d.booths.map(b=>b.id)).size,40);
for(const base of d.baseFloors){
  // Open service doors while evaluating the route used to install each librarian.
  const passable=(x,z)=>x>=0&&x<W&&z>=0&&z<D&&at(x,base,z)&&[base+1,base+2].every(y=>!at(x,y,z)||at(x,y,z).key.startsWith('door'));
  const start=[28,16],queue=[start],seen=new Set([start.join(',')]);
  assert(passable(...start));
  for(let i=0;i<queue.length;i++){
    const [x,z]=queue[i];
    for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,nz=z+dz,key=`${nx},${nz}`;
      if(!seen.has(key)&&passable(nx,nz)){seen.add(key);queue.push([nx,nz]);}
    }
  }
  for(const b of d.booths.filter(b=>b.base===base)){
    assert(seen.has(`${b.standing},${b.z}`),`Rear access to librarian ${b.id} is blocked`);
    assert(seen.has(`${b.rear+(b.side==='left'?-1:1)},${b.z}`),`Service aisle for librarian ${b.id} is blocked`);
    assert(!at(b.front,base+2,b.z),`Trade opening for librarian ${b.id} is blocked`);
    assert(at(b.front,base+3,b.z)?.key==='pane',`Librarian ${b.id} needs its containment header`);
  }
  for(let z=16;z<=57;z++)for(let x=26;x<=30;x++)assert(seen.has(`${x},${z}`),'The public aisle must stay connected');
  if(base===12)assert(seen.has('39,61'),'Upper stair landing must connect to every booth');
}
assert.equal(d.stairSteps.length,9);
for(const step of d.stairSteps){
  assert.equal(at(step.x,step.y,step.z)?.key,step.key);
  for(let y=step.y+1;y<=step.y+3;y++)assert(!at(step.x,y,step.z),`Stair headroom at ${step.x},${step.z} is blocked`);
}
for(const x of [31,32])for(const z of [59,60,61,62]){
  assert(at(x,8,z),'The staircase needs a turning landing');
  for(const y of [9,10,11])assert(!at(x,y,z),'Turning landing needs three blocks of headroom');
}
// Follow the full route, including both corners, from ground floor to the upper floor.
const route=[[28,3,57],...d.stairSteps.slice(0,5).map(s=>[s.x,s.y,s.z]),[29,8,62],[30,8,62],[31,8,62],[32,8,62],...d.stairSteps.slice(5).map(s=>[s.x,s.y,62]),[37,12,62],[38,12,62],[39,12,62],[39,12,61],[39,12,60],[39,12,59],[39,12,58],[39,12,57]];
for(let i=0;i<route.length;i++){
  const [x,y,z]=route[i];assert(at(x,y,z),'Stair route needs continuous support');
  for(const airY of [y+1,y+2,y+3])assert(!at(x,airY,z),'The complete stair route needs three blocks of headroom');
  if(i){const [px,py,pz]=route[i-1];assert.equal(Math.abs(x-px)+Math.abs(z-pz),1,'Stair route must stay adjacent');assert(Math.abs(y-py)<=1,'A stair cannot rise more than one block per step');}
}
for(let z=4;z<=16;z++)for(let y=4;y<=6;y++)assert(!at(28,y,z),'The gate passage must stay open');
console.log('PASS: 70 × 60 plot, 40 booths, exact lectern/door/sign counts, both public aisles, all rear-access routes, trade openings, entrance and continuous turning staircase with three blocks of headroom.');
