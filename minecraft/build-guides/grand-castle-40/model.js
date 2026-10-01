/* Asterfall Castle. Every visible architectural detail belongs to this block map. */
window.GRAND_CASTLE_DATA = (() => {
  const W=57,D=79,H=50,baseFloors=[3,12];
  const C={};
  const material=(key,id,name,color,extra={})=>C[key]={id:`minecraft:${id}`,name,color,...extra};
  material('bricks','stone_bricks','Stone Bricks','#89979e',{full:true});
  material('smooth','smooth_stone','Smooth Stone','#c7cec8',{full:true});
  material('deep','deepslate_bricks','Deepslate Bricks','#46505b',{full:true});
  material('plank','dark_oak_planks','Dark Oak Planks','#785034',{full:true});
  material('log','dark_oak_log[axis=y]','Dark Oak Log','#483626',{full:true});
  material('beam','dark_oak_log[axis=x]','Dark Oak Log','#584231',{full:true});
  material('books','bookshelf','Bookshelf','#ad7651',{full:true});
  material('barrel','barrel[facing=up,open=false]','Barrel','#957547',{full:true});
  material('leaves','oak_leaves[persistent=true]','Oak Leaves','#638046');
  material('blue','blue_wool','Blue Wool','#36589e',{full:true});
  material('white','white_wool','White Wool','#f0eae0',{full:true});
  material('pane','glass_pane','Glass Pane','#9bcfd2',{connection:'pane'});
  material('bars','iron_bars','Iron Bars','#6a7d86',{connection:'pane'});
  material('fence','dark_oak_fence','Dark Oak Fence','#aa794d',{connection:'fence'});
  material('lantern','lantern[hanging=true]','Lantern','#f5bb58');
  material('lamp','lantern[hanging=false]','Lantern','#ffd67a');
  material('stoneSlab','stone_brick_slab[type=bottom]','Stone Brick Slab','#a6b0b3');
  material('oakSlab','dark_oak_slab[type=bottom]','Dark Oak Slab','#a37a4d');
  for(const [short,dir] of [['E','east'],['W','west'],['N','north'],['S','south']]){
    material(`oak${short}`,`dark_oak_stairs[facing=${dir},half=bottom,shape=straight]`,'Dark Oak Stairs','#8c6742');
    material(`stone${short}`,`stone_brick_stairs[facing=${dir},half=bottom,shape=straight]`,'Stone Brick Stairs','#aebac0');
    material(`arch${short}`,`stone_brick_stairs[facing=${dir},half=top,shape=straight]`,'Stone Brick Stairs','#b7c3c7');
    material(`roof${short}`,`deepslate_brick_stairs[facing=${dir},half=bottom,shape=straight]`,'Deepslate Brick Stairs','#64717f');
    material(`ladder${short}`,`ladder[facing=${dir}]`,'Ladder','#b39465');
  }
  for(const [side,dir,hinge] of [['East','east','right'],['West','west','left']]){
    material(`lectern${side}`,`lectern[facing=${dir}]`,'Lectern','#d6ac70');
    for(const [part,half] of [['Low','lower'],['High','upper']])material(`door${side}${part}`,`dark_oak_door[facing=${dir},half=${half},hinge=${hinge},open=false]`,'Dark Oak Door','#987044');
    material(`sign${side}`,`dark_oak_wall_sign[facing=${dir}]`,'Dark Oak Sign','#e5ba79');
  }
  const layers=Array.from({length:H},()=>Array(W*D).fill(null));
  const at=(x,y,z)=>layers[y]?.[z*W+x]||null;
  const put=(x,y,z,key,why)=>{
    if(x<0||x>=W||y<0||y>=H||z<0||z>=D||!C[key])throw Error(`Invalid block ${x},${y},${z}: ${key}`);
    layers[y][z*W+x]={key,why};
  };
  const clear=(x,y,z)=>{layers[y][z*W+x]=null};
  const fill=(x1,x2,y,z1,z2,key,why)=>{for(let z=z1;z<=z2;z++)for(let x=x1;x<=x2;x++)put(x,y,z,key,why)};
  const box=(x1,x2,y1,y2,z1,z2,key,why)=>{for(let y=y1;y<=y2;y++)fill(x1,x2,y,z1,z2,key,why)};
  const oct=(dx,dz,r)=>Math.max(Math.abs(dx),Math.abs(dz))<=r&&Math.abs(dx)+Math.abs(dz)<=Math.floor(r*1.5);
  const rim=(dx,dz,r)=>oct(dx,dz,r)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>!oct(dx+a,dz+b,r));
  const inward=(dx,dz)=>Math.abs(dx)>Math.abs(dz)?(dx<0?'E':'W'):(dz<0?'S':'N');
  const archOpen=(offset,y,bottom,width,height)=>{
    const a=Math.abs(offset),top=bottom+height-1;
    return a<=width&&y>=bottom&&y<=top-Math.max(0,a-1);
  };

  // Raised terrace, hollow between its continuous foundation and upper pavement.
  fill(2,54,0,4,76,'deep','Continuous castle foundation');
  for(const y of [1,2])for(let z=4;z<=76;z++)for(let x=2;x<=54;x++)if(x===2||x===54||z===4||z===76)put(x,y,z,y===1?'deep':'bricks','Raised terrace retaining wall');
  fill(2,54,3,4,76,'bricks','Raised terrace pavement / ground floor');
  for(let z=0;z<=3;z++){
    for(let y=0;y<z;y++)fill(22,34,y,z,z,'bricks','Grand entrance stair support');
    fill(22,34,z,z,z,'stoneS','Thirteen-wide entrance stair');
    for(const x of [21,35])put(x,z+1,z,'stoneSlab','Entrance stair side coping');
  }
  for(let z=4;z<=76;z++)for(const x of [2,54]){
    put(x,4,z,'bricks','Terrace parapet');if(z%2===0)put(x,5,z,'stoneSlab','Terrace merlon');
  }
  for(const z of [4,76])for(let x=3;x<54;x++)if(z!==4||x<22||x>34){
    put(x,4,z,'bricks','Terrace parapet');if(x%2===0)put(x,5,z,'stoneSlab','Terrace merlon');
  }
  for(const z of [6,20,36,52,68,74])for(const x of [3,53]){put(x,4,z,'bricks','Lantern pedestal');put(x,5,z,'lamp','Terrace lantern');}

  // Main keep: two storeys, pointed window bays, horizontal trim and a stepped gable.
  fill(15,41,3,20,71,'smooth','Ground-floor hall pavement');
  for(let y=4;y<=22;y++)for(let z=19;z<=72;z++)for(const x of [14,42])put(x,y,z,[4,12,22].includes(y)?'smooth':'bricks','Keep outer wall / belt course');
  for(const z of [19,72])box(15,41,4,22,z,z,'bricks','Keep front / rear facade');
  for(let y=15;y<=21;y++)for(let x=24;x<=32;x++){
    if(archOpen(x-28,y,15,3,7))put(x,y,72,'pane','Grand rear hall lancet window');
    else put(x,y,72,'smooth','Grand rear window carved surround');
  }
  for(const center of [24,32,40,48,56,64])for(const x of [14,42])for(const bottom of [6,15]){
    for(let y=bottom;y<=bottom+4;y++)for(let dz=-2;dz<=2;dz++){
      if(archOpen(dz,y,bottom,1,5))put(x,y,center+dz,'pane','Tall arched keep window');
      else put(x,y,center+dz,'smooth','Carved arched window surround');
    }
    put(x,bottom+4,center-1,'archS','Pointed window arch');put(x,bottom+4,center+1,'archN','Pointed window arch');
  }
  for(const x of [13,43])for(const z of [20,28,36,44,52,60,70]){
    const outer=x<28?x-1:x+1;
    box(Math.min(x,outer),Math.max(x,outer),4,8,z-1,z+1,'bricks','Broad buttress base');
    box(x,x,9,21,z,z,'smooth','Tall stone buttress');
    put(outer,9,z,x<28?'stoneE':'stoneW','Buttress lower slope');
    put(outer,21,z,x<28?'stoneE':'stoneW','Buttress crown corbel');
    put(outer,22,z,'stoneSlab','Buttress crown');
    put(outer,10,z,'lamp','Buttress lantern');
  }
  for(const x of [13,43])for(const y of [12,22])for(let z=20;z<=71;z++)put(x,y,z,'stoneSlab','Projecting keep belt course');

  // Gate arch: a broad open tunnel with a crenellated balcony above it.
  for(let z=6;z<=18;z++)for(let y=4;y<=11;y++)for(let x=17;x<=39;x++){
    if(archOpen(x-28,y,4,3,8))continue;
    if(z<=8||x<=19||x>=37)put(x,y,z,'smooth','Seven-wide pointed gate arch / side pier');
  }
  fill(17,39,12,6,18,'smooth','Walkable gate balcony');
  for(let x=17;x<=39;x++){put(x,13,6,'bricks','Balcony parapet');if(x%2===1)put(x,14,6,'bricks','Balcony crenellation');}
  for(const x of [17,39])for(let z=7;z<=18;z++){put(x,13,z,'bricks','Balcony side parapet');if(z%2===0)put(x,14,z,'stoneSlab','Balcony side merlon');}
  for(const x of [20,36]){put(x,14,7,'bricks','Gate balcony lamp pedestal');put(x,15,7,'lamp','Gate balcony lantern');}
  for(let x=25;x<=31;x++)for(const y of [9,10])if(!at(x,y,6))put(x,y,6,'bars','Raised portcullis fringe; passage below remains open');
  for(const x of [19,28,37])for(let dy=0;dy<4;dy++)for(let dx=-1;dx<=1;dx++)put(x+dx,(x===28?14:8)-dy,5,dy===1?'white':'blue','Blue and white gate standard');
  // Carve both entries through the facade after its stonework is complete.
  for(const bottom of [4,13])for(let y=bottom;y<bottom+7;y++)for(let x=25;x<=31;x++)if(archOpen(x-28,y,bottom,3,7))clear(x,y,19);
  for(const x of [18,24,32,38])box(x,x,4,22,18,18,'smooth','Front facade stone pilaster');
  for(const z of [18,73])for(let x=12;x<=44;x++){
    const roofY=23+Math.min(x-12,44-x);
    if(x>=14&&x<=42)for(let y=23;y<roofY;y++)put(x,y,z,'bricks','Pointed stone gable');
    put(x,roofY,z,x===28?'stoneSlab':x<28?'roofE':'roofW','Dark stone gable outline');
  }
  for(const z of [18,73])for(let y=26;y<=32;y++)for(let x=25;x<=31;x++)if(archOpen(x-28,y,26,3,7))put(x,y,z,'pane','Grand gable lancet window');
  // Main pitched roof; each row moves one X inward and one Y upward.
  for(let x=12;x<=44;x++)for(let z=19;z<=72;z++){
    const y=23+Math.min(x-12,44-x);
    put(x,y-1,z,'plank','Keep roof sheathing');
    put(x,y,z,x===28?'oakSlab':x<28?'oakE':'oakW','Steep dark oak keep roof');
  }
  for(const z of [20,32,44,56,70]){put(28,40,z,'fence','Roof ridge finial');put(28,41,z,'lamp','Ridge lantern');}
  // Six real gabled dormers break up the roof's long slopes.
  for(const center of [32,48,64])for(const left of [true,false]){
    const outer=left?16:40,inner=left?22:34,x1=Math.min(outer,inner),x2=Math.max(outer,inner);
    for(let x=x1;x<=x2;x++)for(let dz=-2;dz<=2;dz++){
      const y=23+Math.min(x-12,44-x);
      if(at(x,y,center+dz)?.why==='Steep dark oak keep roof')clear(x,y,center+dz);
      if(at(x,y-1,center+dz)?.why==='Keep roof sheathing')clear(x,y-1,center+dz);
    }
    fill(x1,x2,27,center-2,center+2,'plank','Dormer floor');
    for(const z of [center-2,center+2])box(x1,x2,28,33,z,z,'plank','Dormer timber cheek');
    for(let dz=-2;dz<=2;dz++)for(let y=28;y<36-Math.abs(dz);y++)put(outer,y,center+dz,'bricks','Dormer stone gable');
    for(let dz=-1;dz<=1;dz++)for(let y=29;y<=33;y++)if(archOpen(dz,y,29,1,5))put(outer,y,center+dz,'pane','Arched dormer glazing');
    for(let dz=-3;dz<=3;dz++){
      const y=36-Math.abs(dz);
      for(let x=x1;x<=x2;x++){put(x,y-1,center+dz,'plank','Dormer roof sheathing');put(x,y,center+dz,dz===0?'oakSlab':dz<0?'oakS':'oakN','Dormer pitched roof');}
      put(outer+(left?-1:1),y,center+dz,dz===0?'stoneSlab':dz<0?'roofS':'roofN','Dormer dark stone outline');
    }
  }

  // Four hollow octagonal towers, with floors, ladders, cornices and high pointed roofs.
  const towers=[{cx:10,cz:12,r:6,top:27,roof:29,roofR:8},{cx:46,cz:12,r:6,top:27,roof:29,roofR:8},{cx:10,cz:68,r:5,top:23,roof:25,roofR:7},{cx:46,cz:68,r:5,top:23,roof:25,roofR:7}];
  for(const t of towers){
    const {cx,cz,r,top,roof,roofR}=t;
    for(let y=1;y<=top;y++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)if(rim(dx,dz,r)){
      const trim=[1,2,3,12,21,top-1,top].includes(y),corner=Math.abs(dx)+Math.abs(dz)>=Math.floor(r*1.5)-1;
      put(cx+dx,y,cz+dz,y<4?'deep':trim||corner?'smooth':'bricks','Octagonal tower wall / carved stone course');
    }
    for(const y of [3,12,21,top+1])if(y<=top+1)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++)if(oct(dx,dz,r))put(cx+dx,y,cz+dz,'plank','Tower floor / roof deck');
    for(const bottom of [6,15])for(const dir of ['N','S','E','W'])for(let side=-1;side<=1;side++)for(let y=bottom;y<=bottom+4;y++){
      const dx=dir==='E'?r:dir==='W'?-r:side,dz=dir==='N'?-r:dir==='S'?r:side;
      put(cx+dx,y,cz+dz,archOpen(side,y,bottom,1,5)?'pane':'smooth','Tower arched window');
    }
    for(let dz=-r-1;dz<=r+1;dz++)for(let dx=-r-1;dx<=r+1;dx++)if(rim(dx,dz,r+1))put(cx+dx,top+1,cz+dz,'stoneSlab','Projecting tower cornice');
    for(let i=0;i<=roofR*2;i++){
      const rr=roofR-Math.floor(i/2),y=roof+i;
      for(let dz=-rr;dz<=rr;dz++)for(let dx=-rr;dx<=rr;dx++)if(rim(dx,dz,rr)||rr===0)put(cx+dx,y,cz+dz,i%2===0&&rr>0?`oak${inward(dx,dz)}`:'plank','Stepped pointed turret roof');
    }
    const peak=roof+roofR*2;
    for(let y=peak+1;y<=peak+4;y++)put(cx,y,cz,'fence','Turret flagpole');
    for(let y=peak+1;y<=peak+3;y++)for(let dx=1;dx<=3;dx++)if(!(y===peak+1&&dx===3))put(cx+dx,y,cz,y===peak+2?'white':'blue','Turret royal flag');
    const east=cx<28,ladderX=cx+(east?r-1:-r+1);
    for(let y=4;y<=top+1;y++)put(ladderX,y,cz+1,east?'ladderW':'ladderE','Tower ladder through the floor openings');
    // Open short passageways into the gate balcony or rear of the keep.
    for(const floor of [3,12]){
      const frontTower=cz===12,x1=east?cx+r-1:frontTower?36:39,x2=east?(frontTower?20:17):cx-r+1;
      for(let y=floor+1;y<=floor+3;y++)for(let z=cz-1;z<=cz;z++)for(let x=x1;x<=x2;x++)clear(x,y,z);
      fill(x1,x2,floor,cz-1,cz,'smooth','Tower connecting passage threshold');
    }
  }

  // Trading floors and the separate rear stair route.
  fill(15,41,12,20,61,'plank','Upper trading-floor deck');
  fill(26,37,12,71,71,'plank','Upper stair landing');
  fill(34,37,12,62,70,'plank','Upper stair return gallery');
  for(let z=62;z<=70;z++){
    const y=z-58;
    for(let support=4;support<y;support++)fill(26,30,support,z,z,'bricks','Grand stair support');
    fill(26,30,y,z,z,'stoneS','Five-wide rear staircase');
    for(const x of [25,31]){box(x,x,4,y,z,z,'bricks','Stone staircase balustrade');put(x,y+1,z,'stoneSlab','Stair balustrade coping');}
  }
  for(const x of [33,38])for(let z=62;z<=70;z++)put(x,13,z,'fence','Upper stair-gallery guardrail');
  for(const base of baseFloors){
    for(let z=20;z<=61;z++)for(let x=25;x<=31;x++)put(x,base,z,[26,30].includes(x)?'deep':'smooth','Seven-wide inlaid trading aisle');
    for(const z of [20,28,36,44,52,60]){
      if(base===12)fill(15,41,22,z,z,'beam','Upper hall crossbeam');
      put(28,base===3?11:21,z,'lantern','Central aisle hanging lantern');
    }
  }
  const labels=[['Protection',4],['Fire Protection',4],['Feather Falling',4],['Blast Protection',4],['Projectile Protection',4],['Respiration',3],['Aqua Affinity',1],['Thorns',3],['Depth Strider',3],['Sharpness',5],['Smite',5],['Bane of Arthropods',5],['Knockback',2],['Fire Aspect',2],['Looting',3],['Sweeping Edge',3],['Efficiency',5],['Silk Touch',1],['Unbreaking',3],['Fortune',3],['Power',5],['Punch',2],['Flame',1],['Infinity',1],['Luck of the Sea',3],['Lure',3],['Loyalty',3],['Impaling',5],['Riptide',3],['Channeling',1],['Multishot',1],['Quick Charge',3],['Piercing',4],['Density',5],['Breach',4],['Lunge',3],['Curse of Binding',1],['Curse of Vanishing',1],['Frost Walker',2],['Mending',1]];
  const booths=[];
  for(const floor of [0,1])for(let row=0;row<10;row++)for(const side of ['left','right']){
    const base=baseFloors[floor],z=22+row*4,left=side==='left',rear=left?18:38,front=left?24:32,sign=front+(left?1:-1),standing=front+(left?-1:1),id=floor*20+row*2+(left?1:2);
    const lo=Math.min(rear,front),hi=Math.max(rear,front);
    booths.push({id,floor,base,side,z,rear,front,job:front,standing,sign,label:labels[id-1]});
    for(const divider of [z-2,z+2])for(let y=base+1;y<=base+2;y++)fill(lo,hi,y,divider,divider,'plank','Two-high booth side divider');
    for(const edge of [z-1,z+1])for(const x of [rear,front])box(x,x,base+1,base+3,edge,edge,'bricks','Booth stone pilaster');
    for(const x of [rear,front]){put(x,base+3,z,'pane','Glazed booth header above the trading gap');fill(x,x,base+4,z-1,z+1,'plank','Booth timber lintel / sign support');}
    put(rear,base+1,z,left?'doorWestLow':'doorEastLow','Rear service door: fit after moving the librarian');
    put(rear,base+2,z,left?'doorWestHigh':'doorEastHigh','Rear service door upper half');
    put(front,base+1,z,left?'lecternEast':'lecternWest','One aisle-facing lectern; fit during villager setup');
    // The air immediately above this lectern is the working trade opening.
    put(front,base+3,z-1,'archS','Booth arch corbel');put(front,base+3,z+1,'archN','Booth arch corbel');
    put(sign,base+4,z,left?'signEast':'signWest','Label the locked book trade');
    for(const bookZ of [z-1,z+1])for(const y of [base+1,base+2])put(rear+(left?1:-1),y,bookZ,'books','Booth bookshelf backing');
    put(sign,base+1,z+1,'barrel','Aisle planter barrel');put(sign,base+2,z+1,'leaves','Aisle planter leaves');
    put(sign,base+4,z-1,'fence','Booth lantern bracket');put(sign,base+3,z-1,'lantern','Booth hanging lantern');
  }
  // Low landscape borders and doorway lights are part of the build, not render props.
  for(const x of [7,49])for(const z of [25,33,41,49,57]){
    put(x,4,z,'barrel','Terrace planter');put(x,5,z,'leaves','Terrace planter foliage');
    put(x,4,z+2,'bricks','Garden lamp pedestal');put(x,5,z+2,'lamp','Garden walkway lantern');
  }
  for(const x of [22,34]){put(x,4,10,'bricks','Entrance lamp pedestal');put(x,5,10,'lamp','Entrance lantern');}

  // Validate the playable trading hall, its count and the stair headroom.
  if(booths.length!==40)throw Error('The castle must contain exactly 40 booths');
  for(const b of booths){
    if(at(b.standing,b.base+1,b.z)||at(b.standing,b.base+2,b.z))throw Error(`Librarian ${b.id} standing cell is blocked`);
    if(at(b.front,b.base+2,b.z))throw Error(`Librarian ${b.id} trading gap is blocked`);
    if(!at(b.job,b.base+1,b.z)?.key.startsWith('lectern'))throw Error(`Librarian ${b.id} needs a lectern`);
    for(let x=25;x<=31;x++)if(at(x,b.base+2,b.z)&&x>=26&&x<=30)throw Error('Central aisle is blocked');
  }
  for(let z=62;z<=70;z++){const stepY=z-58;for(let y=stepY+1;y<=stepY+3;y++)if(at(28,y,z))throw Error(`Stair headroom blocked at ${z}`);}
  for(let z=4;z<=20;z++)for(const y of [4,5,6])if(at(28,y,z))throw Error(`Main entry is blocked at ${z}`);
  const notes=Array.from({length:H},(_,y)=>{
    if(y===0)return 'Mark the 57 × 79 footprint. North is Z=0. Lay the foundation and the first entrance stair.';
    if(y<=2)return 'Raise the terrace retaining wall and support the entrance steps. Empty interior spaces stay hollow.';
    if(y===3)return 'Lay the raised terrace and ground-floor hall. This is the ground-floor walking surface.';
    if(y===4||y===13)return 'Build booth frames and the counter lecterns. Leave rear door openings clear until one librarian is ready for each booth.';
    if(y===5||y===14)return 'Finish the two-high booth dividers and doors. Keep the trading gap above each lectern empty.';
    if(y===6||y===15)return 'Add glazed booth headers, stone arch corbels and hanging booth lanterns after their brackets are built.';
    if(y===7||y===16)return 'Finish booth lintels, sign boards and lantern brackets. Labels and lecterns are completed during villager setup.';
    if(y<=10)return 'Raise the gate arch, tower windows and carved keep windows. Follow the stairs shown on this slice.';
    if(y===11)return 'Hang the lower central lamps after the second-floor deck is in place. Complete the high gate arch.';
    if(y===12)return 'Lay the upper trading floor and gate balcony. Keep the rear stairwell open; the return gallery is on the east.';
    if(y<=20)return 'Continue upper stonework, lancet windows, tower passages and the rear staircase.';
    if(y===21)return 'Hang the upper aisle lanterns after their crossbeams exist. Complete tower belt courses.';
    if(y===22)return 'Place the hall crossbeams and projecting stone cornice.';
    if(y<=28)return 'Build pointed stone gables and the first roof rows. Cap rear towers and begin their pointed roofs.';
    if(y<=38)return 'Continue the inward roof rows, six gabled dormers, dark stone trim and pointed turret roofs.';
    if(y===39)return 'Finish the main dark oak ridge and rear turret peaks.';
    if(y<=43)return 'Place ridge finials and rear flags. Continue the taller front turret roofs.';
    if(y<=45)return 'Finish the front turret points.';
    return 'Finish the front flagpoles and blue-and-white royal flags.';
  });
  return {name:'Asterfall Castle',width:W,depth:D,height:H,layers,catalog:C,booths,baseFloors,notes};
})();
