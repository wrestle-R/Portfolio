"""Build the curated portfolio house with vanilla block geometry and baked shading.

Run: python minecraft/tools/build_house.py --jar /path/to/client.jar
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

def lantern(x, y, z, soul=False, hanging=True):
    detail(x-.5,y,z-.5,'soul_lantern' if soul else 'lantern',hanging=str(hanging).lower())
    lamps.append((x,y+.4,z,soul))

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

# Compact entrance: dark-oak lintel, stone shoulders and a stepped timber awning.
for x in (-4,3): fill(x,x,0,4,0,0,'dark_oak_log',axis='y')
for x in (-6,-5,4,5): fill(x,x,0,4,0,0,'polished_deepslate')
fill(-4,3,4,4,0,0,'dark_oak_planks')
for level in range(3):
    fill(-5+level,4-level,5+level,5+level,-1,1,'dark_oak_planks')
    for x in range(-5+level,5-level):
        put(x,6+level,1,'dark_oak_slab',type='bottom')
for x in (-3,3): lantern(x,3.3,1.6,soul=True)

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
        for side in (-1,1):
            x=side*4
            detail(x-.125,y+1,z,'dark_oak_fence',scale=(.5,1,1),north='false',south='false',east='false',west='false')
            detail(x-.125,y+2,z,'dark_oak_fence',scale=(.5,1,1),north='false',south='false',east='false',west='false')
            detail(x-(.1 if side<0 else .8),y+2.65,z,'dark_oak_slab',scale=(1,1,.75),type='bottom')
            lantern(x-side*.55,y+1.9,z+.25,soul=(i%12==8))
# Landing's centerline continues to the first step.
fill(-1,-1,-1,-1,1,3,'smooth_quartz')

# Tall trunks and small irregular crowns, matching the two trees above the stairs.
for x,z in ((-8,2),(7,1)):
    fill(x,x,0,7,z,z,'dark_oak_log',axis='y')
    for y,r in ((6,2),(7,2),(8,1),(9,1)):
        for dx in range(-r,r+1):
            for dz in range(-r,r+1):
                if abs(dx)==r and abs(dz)==r: continue
                put(x+dx,y,z+dz,'spruce_leaves',persistent='true',distance='1')
                if y==9: put(x+dx,y+1,z+dz,'snow',layers='1')
# A restrained teal-and-cherry feature at the end of the corridor.
for x in (-5,4):
    put(x,0,-28,'dark_oak_planks')
    put(x,1,-28,'flowering_azalea_leaves',persistent='true',distance='1')
    put(x,2,-28,'cherry_leaves',persistent='true',distance='1')
for x in range(-3,3): put(x,-1,-28,'warped_planks')
for x in (-2,1): lantern(x+.5,.1,-28,soul=True,hanging=False)
# Frame backings and the connected in-world experience timeline.
for z in (-5.5,-10.5,-15.5,-20.5,-25.5):
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
        if 'spruce_leaves' in texture: tint=(95,130,98,255)
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
            if v[2]<0 and v[1]<5.1 and not luminous:
                closest=min(((v[0]-x)**2+(v[1]-y)**2+(v[2]-z)**2 for x,y,z,soul in lamps if not soul),default=100)
                warm=math.exp(-closest/10)
                daylight=math.exp(v[2]/6)*.14
                shade*=min(1,.83+warm*.15+daylight)
            srgb=[min(1,shade*(1+warm*.035)),shade,shade*(1-warm*.06)]
            linear=[((c+.055)/1.055)**2.4 if c>.04045 else c/12.92 for c in srgb]
            g['pos'].append(v);g['normal'].append(norm);g['uv'].append(uv[i]);g['color'].append(linear)

for p,s in blocks.items(): emit(p,s,grid=True)
for p,s,scale in extras: emit(p,s,scale)
out=ROOT/'assets/models/house.glb'
models.GLB().save(out,groups)
report={'source':'Minecraft 26.3 client block models/textures; authored house based on user recording',
        'blocks':len(blocks),'detailModels':len(extras),'materials':len(groups),
        'triangles':sum(len(g['pos'])//3 for g in groups.values()),'bytes':out.stat().st_size,
        'sha256':hashlib.sha256(out.read_bytes()).hexdigest()}
(ROOT/'assets/models/house-build.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
