"""Build the curated portfolio house with vanilla block geometry and baked shading.

Run: python minecraft/model-source/build_house.py --jar /path/to/client.jar
Requires numpy and Pillow. Neither the client JAR nor reference world ships to browsers.
Coordinates match data/layout.js: floor=0, entrance z=0, hall runs toward -Z.
"""
import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path
import numpy as np
import block_models as models

ROOT = Path(__file__).resolve().parents[1]
DOCS = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--jar', required=True)
args = parser.parse_args()
models.set_jar(args.jar)
blocks = {}
extras = []
lamps = []

def put(x, y, z, name, **props):
    blocks[(x, y, z)] = models.state(name, **props)

def fill(x0, x1, y0, y1, z0, z1, name, **props):
    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            for z in range(z0, z1 + 1):
                put(x, y, z, name, **props)

def detail(x, y, z, name, scale=(1,1,1), **props):
    extras.append(((x,y,z), models.state(name, **props), scale))

def lantern(x, y, z, soul=False, hanging=True, size=1):
    detail(x-.5*size,y,z-.5*size,'soul_lantern' if soul else 'lantern',scale=(size,size,size),hanging=str(hanging).lower())
    lamps.append((x,y+.4*size,z,soul))

# Snowy ravine: irregular stepped banks hug the staircase, with exposed stone.
fill(-22,21,-8,-7,-34,29,'stone')
fill(-22,21,-7,-7,16,29,'snow_block')
for side in (-1,1):
    for x in range(4,23):
        for z in range(-32,24):
            if x < 7 and z < 4: continue
            ramp = max(-6, min(0, -(z-4)/2))
            height = int(ramp + 1 + (x-4)*.68 + .8*math.sin(z*.32+x*.7))
            # Keep the landing open beneath the trees.
            if x < 9 and z < 4: height = max(0,height-2)
            wx = x if side > 0 else -x-1
            fill(wx,wx,-7,height-1,z,z,'stone')
            put(wx,height,z,'snow_block')
            if height > ramp+2: put(wx,height-1,z,'snow_block')

# White paving and a three-block crimson runner as in the recording.
fill(-6,5,-1,-1,-29,3,'smooth_stone')
for z in range(-28,1):
    
    for x in (-1,0): put(x,-1,z,'crimson_planks')
    for x in (-2,1): put(x,-1,z,'nether_bricks')
# The runner and passage share the same centerline.

# Polished stone walls with the distinctive gilded band and a dark tiled ceiling.
for x in (-7,6):
    fill(x,x,0,4,-29,-1,'polished_deepslate')
    fill(x,x,3,3,-28,-1,'gilded_blackstone')
fill(-6,5,0,4,-30,-30,'polished_deepslate')
fill(-6,5,3,3,-30,-30,'gilded_blackstone')
fill(-7,6,5,5,-30,0,'deepslate_tiles')
# Each bay is framed by thick log pillars. Low headers keep the long hall visible.
for z in (-3,-8,-13,-18,-23,-28):
    for x in (-4,3):
        if x == 3 and z in (-18,-23): continue
        fill(x,x,0,4,z,z,'dark_oak_log',axis='y')
    # The experience wall stays open so its connected timeline reads as one run.
    fill(-6,-5,0,4,z,z,'polished_deepslate')
    if z not in (-18,-23): fill(4,5,0,4,z,z,'polished_deepslate')
    fill(-3,2,4,4,z,z,'deepslate_tile_slab',type='top')
    for x in (-2.4,2.4):
        detail(x-.1,4.1,z+.4,'iron_chain',scale=(.5,.7,.5),axis='y')
        lantern(x,3.35,z+.5)
# Pale bay ceiling insets, like the side rooms in the recording.
for z in range(-28,-3):
    for x in (-6,-5,4,5): put(x,5,z,'smooth_stone')

# Layered alpine gateway: deep timber eaves, stone buttresses and hanging details.
# Every decorative solid stays outside the six-block central passage.
for side in (-1,1):
    x=-4 if side<0 else 3
    fill(x,x,0,5,0,1,'dark_oak_log',axis='y')
    for wx in ((-6,-5) if side<0 else (4,5)):
        fill(wx,wx,0,4,0,1,'polished_deepslate')
    for z in (1,2):
        detail(side*4.15-.55,0,z,'deepslate_bricks',scale=(1.1,1,1))
        detail(side*4.15-.6,1,z,'deepslate_brick_wall',scale=(1.2,1,1),north='low',south='low',up='true')
    detail(side*3.55-.38,1,1.7,'dark_oak_log',scale=(.76,4.5,.76),axis='y')
    # Carved corbels support the projecting roof, with a second lower ledge.
    detail(side*4.7-.7,4.2,1.2,'spruce_stairs',scale=(1.4,1.4,1.4),facing='north',half='top',shape='straight')
    detail(side*4.7-.9,5.2,1,'spruce_slab',scale=(1.8,1,2.4),type='bottom')
    detail(side*5.35-.6,2.45,1.3,'spruce_slab',scale=(1.2,1,1.65),type='bottom')
    detail(side*5.35-.25,2,1.5,'dark_oak_fence',scale=(.5,1,1))
    # A pair of cooler hanging lanterns sits just inside the warm facade lights.
    detail(side*2.9-.12,4.55,2.35,'iron_chain',scale=(.24,1.15,.24),axis='y')
    lantern(side*2.9,3.65,2.47,soul=True)
    detail(side*5.5-.12,3.7,2.25,'iron_chain',scale=(.24,.9,.24),axis='y')
    lantern(side*5.5,2.8,2.37)

# Steep alpine gable with a dark slate roof, snow caps and exposed timber ribs.
for x in range(-7,7):
    peak=5+int((6.5-abs(x+.5))*.92)
    fill(x,x,5,peak,-1,1,'spruce_planks')
    detail(x,peak+.5,-1.2,'deepslate_tile_slab',scale=(1,1,4.8),type='bottom')
    detail(x,peak+1,-1.2,'snow',scale=(1,1,4.8),layers='2')
    detail(x,peak,3.0,'deepslate_bricks',scale=(1,.75,.65))
    detail(x,peak+.75,3.0,'snow',scale=(1,1,.65),layers='2')
    # End-grain rafters give every stepped roof course depth.
    detail(x+.12,peak-.5,2.85,'dark_oak_log',scale=(.76,.65,.8),axis='z')
    detail(x+.15,peak-.46,3.6,'oak_trapdoor',scale=(.7,.7,.3),facing='south',half='bottom',open='true')
# A continuous tie beam and king post make the gable read as architecture.
detail(-6.8,5.45,2.9,'dark_oak_log',scale=(13.6,.45,.55),axis='x')
detail(-.22,5.5,2.9,'dark_oak_log',scale=(.44,5.25,.5),axis='y')
for side in (-1,1):
    for step in range(5):
        detail(side*(.7+step*.65)-.2,9.25-step*.65,2.95,'dark_oak_log',scale=(.5,.65,.48),axis='y')
    detail(side*3.5-.18,5.5,2.9,'dark_oak_log',scale=(.36,2.25,.5),axis='y')
    # Substantial stone feet and inset timber pillars frame the open doorway.
    detail(side*3.55-.55,0,2.25,'stone_bricks',scale=(1.1,1.3,1.1))
    detail(side*3.55-.65,1.25,2.15,'stone_brick_slab',scale=(1.3,1,1.3),type='bottom')
    detail(side*4.25-.65,4.5,3.8,'dark_oak_log',scale=(1.3,.18,.25),axis='x')
# A warm pendant sits above the broad parchment name plaque.
detail(-.3,10.75,2.9,'oak_trapdoor',scale=(.6,.6,.3),facing='south',half='bottom',open='true')
detail(-2.95,3.3,3.65,'dark_oak_planks',scale=(5.9,2.1,.24))
for x in (-2.2,2.2): detail(x-.08,5.3,3.8,'iron_chain',scale=(.16,.6,.16),axis='y')

# Clean carved timber shoulders, with no planted blocks on the roof.
for side in (-1,1):
    for y in (1.5,2.1,2.7):
        detail(side*5.05-.5,y,2.85,'spruce_stairs',scale=(1,.6,.9),facing='north',half='top',shape='straight')
detail(-.1,7.2,3.5,'iron_chain',scale=(.2,1,.2),axis='y')
lantern(0,6.25,3.6)

# Half-unit treads retain the shared navigation slope. Real stair models give
# the white center strip a continuous riser rather than disconnected thin lines.
for i in range(24):
    z=4+i*.5
    y=-(i+1)*.25
    for x in range(-4,3):
        detail(x+.5,y-.25,z,'smooth_quartz_stairs' if x==-1 else 'polished_deepslate_stairs',
               scale=(1,.5,.5),facing='north',half='bottom',shape='straight')
    for x in (-4.5,3.5):
        detail(x,y,z,'polished_blackstone_brick_wall',scale=(1,1,.5),north='low',south='low',east='none',west='none',up='true')
        detail(x+.18,y+.98,z,'snow',scale=(.64,1,.5),layers='1')
    if i % 6 == 2:
        # One centered fixture definition, mirrored in X. No side-specific offsets.
        for side in (-1,1):
            post_x=side*4.05
            lamp_x=side*3.5
            detail(post_x-.16,y+.7,z+.09,'dark_oak_log',scale=(.32,1.8,.32),axis='y')
            detail(side*3.82-.6,y+2.4,z-.08,'dark_oak_log',scale=(1.2,.22,.65),axis='x')
            detail(post_x-.25,y+2.62,z-.02,'spruce_slab',scale=(.5,.35,.55),type='bottom')
            detail(lamp_x-.09,y+1.94,z+.16,'iron_chain',scale=(.18,.55,.18),axis='y')
            lantern(lamp_x,y+1.1,z+.25,soul=(i%12==8),size=1.15)
# Landing's centerline continues to the first step.
for z in range(1,4): detail(-.5,-1,z,'smooth_quartz')

# Broad-crowned dark oaks behind the gateway: thick trunks, branching limbs,
# overlapping irregular leaf clusters, rather than conical spruce silhouettes.
for side in (-1,1):
    x = -11 if side < 0 else 9
    z = -6
    fill(x,x+1,0,15,z,z+1,'dark_oak_log',axis='y')
    clusters = [(.5,17,.5,3.6,2.6),(-2.5,14.5,1,2.8,2),
                (3,15.5,0,3,2.2),(-1.5,19,-.5,2.8,1.8),
                (2,18,2,2.7,2),(.5,14,-2.5,3,2)]
    for branch, (dx,cy,dz,rx,ry) in enumerate(clusters):
        for step in range(4):
            f=step/3
            put(round(x+.5+dx*f),round(11+(cy-13)*f),round(z+.5+dz*f),'dark_oak_log',axis='y' if step<2 else 'x')
        for ox in range(-4,5):
            for oy in range(-3,4):
                for oz in range(-4,5):
                    distance=(ox/rx)**2+(oy/ry)**2+(oz/(rx*.85))**2
                    irregular=.12*math.sin(ox*3+oz*7+branch)
                    if distance > 1+irregular: continue
                    pos=(round(x+dx+ox),round(cy+oy),round(z+dz+oz))
                    if pos not in blocks: put(*pos,'dark_oak_leaves',persistent='true',distance='1')
    # Small hanging lights on the outer branches echo the entrance lanterns.
    lx=side*13
    detail(lx-.1,12,-4,'iron_chain',scale=(.2,1.4,.2),axis='y')
    lantern(lx,11,-3.9,size=1.15)

# A restrained teal-and-cherry feature at the end of the corridor.
for x in (-5,4):
    put(x,0,-28,'dark_oak_planks')
    put(x,1,-28,'flowering_azalea_leaves',persistent='true',distance='1')
    put(x,2,-28,'cherry_leaves',persistent='true',distance='1')
for x in range(-3,3): put(x,-1,-28,'warped_planks')
for x in (-2,1): lantern(x+.5,.1,-28,soul=True,hanging=False)

# Frame backings and the connected in-world experience timeline.
for z in (-5,-10,-15,-20,-25):
    detail(-6.02,1.2,z-1.7,'dark_oak_planks',scale=(.3,2.6,3.4))
for z in (-15.5,-20.5,-25.5):
    detail(5.72,1.7,z-1.7,'dark_oak_planks',scale=(.3,1.8,3.4))
    detail(5.65,1.1,z-.13,'gold_block',scale=(.12,.26,.26))
    detail(5.68,1.3,z-.04,'dark_oak_log',scale=(.1,.4,.08),axis='y')
detail(5.7,1.18,-25.5,'dark_oak_log',scale=(.1,.1,10),axis='z')

# Bake Minecraft-style directional light and per-corner occlusion. A restrained
# warm block-light field provides soft pools under lanterns without point-light cost.
groups=defaultdict(lambda:{'pos':[],'normal':[],'uv':[],'color':[]})

def emit(p,state,scale=(1,1,1),grid=False):
    name=models.resource(state['Name'])
    for verts,norm,uv,texture,tint,cull in models.geometry(state['Name'],tuple(sorted(state['Properties'].items()))):
        if grid and cull:
            neighbor=blocks.get(tuple(p[i]+cull[i] for i in range(3)))
            if neighbor and models.full_cube(neighbor): continue
        if 'dark_oak_leaves' in texture: tint=(91,126,57,255)
        g=groups[(texture,tint)]
        world=verts*np.array(scale)+np.array(p)
        luminous=any(n in texture for n in ('lantern','glowstone'))
        base=1 if luminous else 1 if norm[1]>.5 else .66 if norm[1]<-.5 else .82 if abs(norm[0])>.5 else .9
        for i in (0,1,2,0,2,3):
            v=world[i]
            shade=base
            if grid and not luminous and np.max(np.abs(norm))>.99:
                axes=[a for a in range(3) if abs(norm[a])<.1]
                off=np.rint(norm).astype(int)
                offsets=[]
                for axis in axes:
                    o=np.zeros(3,dtype=int);o[axis]=1 if verts[i][axis]>.5 else -1;offsets.append(o)
                near=[blocks.get(tuple(np.array(p)+off+o)) for o in (offsets[0],offsets[1],offsets[0]+offsets[1])]
                shade*=1-.075*sum(1 for n in near if n and models.full_cube(n))
            warm=0
            if v[2]<4 and v[1]<8.5 and not luminous:
                closest=min(((v[0]-x)**2+(v[1]-y)**2+(v[2]-z)**2 for x,y,z,soul in lamps if not soul),default=100)
                warm=math.exp(-closest/7)
                daylight=math.exp(min(0,v[2])/6)*.1
                shade*=min(1,.75+warm*.26+daylight)
            srgb=[min(1,shade*(1+warm*.16)),shade*(1-warm*.035),shade*(1-warm*.23)]
            linear=[((c+.055)/1.055)**2.4 if c>.04045 else c/12.92 for c in srgb]
            face_uv = uv[i]
            if any(part in name for part in ('planks','log','slab')):
                u_scale = scale[2] if abs(norm[0]) > .5 else scale[0]
                v_scale = scale[2] if abs(norm[1]) > .5 else scale[1]
                face_uv = [uv[i][0]*max(1,u_scale), uv[i][1]*max(1,v_scale)]
            g['pos'].append(v);g['normal'].append(norm);g['uv'].append(face_uv);g['color'].append(linear)

for p,s in blocks.items(): emit(p,s,grid=True)
for p,s,scale in extras: emit(p,s,scale)
for x,y,z,soul in lamps:
    if z > 0 and abs(x) > 1e-6:
        assert any(abs(mx+x)<1e-6 and abs(my-y)<1e-6 and abs(mz-z)<1e-6 and ms==soul for mx,my,mz,ms in lamps), f'Unpaired lantern at {(x,y,z)}'
out=ROOT/'assets/models/house.glb'
models.GLB().save(out,groups)
report={'source':'Minecraft 26.3 client block models/textures; authored house based on user recording',
        'blocks':len(blocks),'detailModels':len(extras),'materials':len(groups),
        'triangles':sum(len(g['pos'])//3 for g in groups.values()),'bytes':out.stat().st_size,
        'sha256':hashlib.sha256(out.read_bytes()).hexdigest()}
(ROOT/'assets/models/lanterns.json').write_text(json.dumps([{'position':[x,y+.1,z],'soul':soul} for x,y,z,soul in lamps],separators=(',',':'))+'\n')
(DOCS/'house-build.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
