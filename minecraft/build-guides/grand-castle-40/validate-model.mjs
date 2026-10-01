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
assert.equal(items('Lectern'),40);
assert.equal(items('Dark Oak Door'),80);
assert.equal(items('Dark Oak Sign'),40);
assert.equal(new Set(d.booths.map(b=>b.id)).size,40);
for(const base of d.baseFloors){
  // Open service doors while evaluating the route used to install each librarian.
  const passable=(x,z)=>x>=0&&x<W&&z>=0&&z<D&&at(x,base,z)&&[base+1,base+2].every(y=>!at(x,y,z)||at(x,y,z).key.startsWith('door'));
  const start=[28,20],queue=[start],seen=new Set([start.join(',')]);
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
  for(let z=20;z<=61;z++)for(let x=26;x<=30;x++)assert(seen.has(`${x},${z}`),'The public aisle must stay connected');
}
for(let z=62;z<=70;z++){
  const step=z-58;assert.equal(at(28,step,z)?.key,'stoneS');
  for(let y=step+1;y<=step+3;y++)assert(!at(28,y,z),`Stair headroom at Z=${z} is blocked`);
}
for(let z=4;z<=20;z++)for(let y=4;y<=6;y++)assert(!at(28,y,z),'The gate passage must stay open');
console.log('PASS: 40 booths, exact lectern/door/sign counts, both public aisles, all rear-access routes, trade openings, entrance and stair headroom.');
