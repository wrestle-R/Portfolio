"""Offline Minecraft block-model reader, adapted from the local minecraft project.

The client JAR is an offline build input only. Runtime uses the compact house GLB.
"""
import io
import json
import math
import struct
import zipfile
from functools import lru_cache
import numpy as np
from PIL import Image

jar = None

def set_jar(path):
    global jar
    jar = zipfile.ZipFile(path)

@lru_cache(None)
def asset(path):
    return json.loads(jar.read('assets/minecraft/' + path))

def resource(name):
    return name.removeprefix('minecraft:')

@lru_cache(None)
def model(name):
    data = asset('models/' + resource(name) + '.json')
    parent = model(data['parent']) if 'parent' in data and not data['parent'].startswith('builtin/') else {}
    return {**parent, **data, 'textures': {**parent.get('textures', {}), **data.get('textures', {})}}

def matches(condition, props):
    if 'OR' in condition:
        return any(matches(c, props) for c in condition['OR'])
    if 'AND' in condition:
        return all(matches(c, props) for c in condition['AND'])
    return all(str(props.get(k, 'false')) in str(v).split('|') for k, v in condition.items())

def variants(state):
    name = resource(state['Name'])
    if name in ('lava', 'water'):
        return [{'fluid': name}]
    definition = asset('blockstates/' + name + '.json')
    # 26.3 omits properties when the block uses its vanilla default state.
    props = {'facing':'north','half':'bottom','shape':'straight','waterlogged':'false',
             'type':'bottom','axis':'y','snowy':'false','layers':'1','hanging':'false',
             'powered':'false','open':'false','face':'wall','in_wall':'false',
             'north':'none','east':'none','south':'none','west':'none','up':'true'}
    if name.endswith(('_fence','_pane')):
        props.update(north='false',south='false',east='false',west='false')
    if name=='nether_portal':props['axis']='x'
    props.update(state.get('Properties', {}))
    result = []
    for key, val in definition.get('variants', {}).items():
        cond = dict(p.split('=') for p in key.split(',')) if key else {}
        if matches(cond, props):
            result.append(val[0] if isinstance(val, list) else val)
            break
    for part in definition.get('multipart', []):
        if matches(part.get('when', {}), props):
            val = part['apply']
            result.append(val[0] if isinstance(val, list) else val)
    if not result:
        raise ValueError(f'No model for {state}')
    return result

def rotation(axis, degrees):
    a = math.radians(degrees)
    c, s = math.cos(a), math.sin(a)
    if axis == 'x': return np.array([[1,0,0],[0,c,-s],[0,s,c]])
    if axis == 'y': return np.array([[c,0,s],[0,1,0],[-s,0,c]])
    return np.array([[c,-s,0],[s,c,0],[0,0,1]])

NORMALS = {'east':(1,0,0),'west':(-1,0,0),'up':(0,1,0),'down':(0,-1,0),'south':(0,0,1),'north':(0,0,-1)}

def face_vertices(side, a, b):
    x,y,z=a; X,Y,Z=b
    # Each quad is clockwise as seen from inside (outward normals).
    return {
        'north':[(X,Y,z),(X,y,z),(x,y,z),(x,Y,z)],
        'south':[(x,Y,Z),(x,y,Z),(X,y,Z),(X,Y,Z)],
        'west':[(x,Y,z),(x,y,z),(x,y,Z),(x,Y,Z)],
        'east':[(X,Y,Z),(X,y,Z),(X,y,z),(X,Y,z)],
        'up':[(x,Y,z),(x,Y,Z),(X,Y,Z),(X,Y,z)],
        'down':[(x,y,Z),(x,y,z),(X,y,z),(X,y,Z)],
    }[side]

def default_uv(side,a,b):
    x,y,z=a;X,Y,Z=b
    return {'up':[x,z,X,Z],'down':[x,16-Z,X,16-z],
            'north':[16-X,16-Y,16-x,16-y],'south':[x,16-Y,X,16-y],
            'west':[z,16-Y,Z,16-y],'east':[16-Z,16-Y,16-z,16-y]}[side]

def state(name, **props): return {'Name':'minecraft:'+name,'Properties':props}

class GLB:
    def __init__(self):
        self.blob=bytearray()
        self.doc={'asset':{'version':'2.0','generator':'Portfolio house / Minecraft block models'},'scene':0,'scenes':[{'nodes':[0]}],
                  'extensionsUsed':['KHR_materials_unlit'],
                  'nodes':[{'mesh':0}],'meshes':[{'primitives':[]}],'accessors':[],'bufferViews':[],
                  'materials':[],'textures':[],'images':[],
                  'samplers':[{'magFilter':9728,'minFilter':9986,'wrapS':10497,'wrapT':10497}]}
        self.materials={}
    def view(self, data):
        while len(self.blob)%4:self.blob.append(0)
        index=len(self.doc['bufferViews'])
        self.doc['bufferViews'].append({'buffer':0,'byteOffset':len(self.blob),'byteLength':len(data)})
        self.blob.extend(data)
        return index
    def accessor(self,data,kind):
        arr=np.array(data,dtype='<f4')
        idx=len(self.doc['accessors'])
        item={'bufferView':self.view(arr.tobytes()),'componentType':5126,'count':len(arr),'type':kind}
        if kind=='VEC3': item.update(min=arr.min(axis=0).tolist(),max=arr.max(axis=0).tolist())
        self.doc['accessors'].append(item)
        return idx
    def material(self, texture, tint):
        key=(texture,tint)
        if key in self.materials:return self.materials[key]
        im=Image.open(io.BytesIO(jar.read('assets/minecraft/textures/'+resource(texture)+'.png'))).convert('RGBA')
        if im.height>im.width:im=im.crop((0,0,im.width,im.width))
        if tint:
            color=Image.new('RGBA',im.size, tint)
            from PIL import ImageChops
            im=ImageChops.multiply(im,color)
        if 'leaves' in texture:
            # Solid foliage interiors, matching Minecraft's fast leaf rendering.
            backing = Image.new('RGBA', im.size, (28, 47, 30, 255) if 'spruce' in texture else (76, 88, 49, 255))
            backing.alpha_composite(im)
            im = backing
        b=io.BytesIO();im.save(b,format='PNG')
        index=len(self.doc['materials']); ti=len(self.doc['textures']); ii=len(self.doc['images'])
        self.doc['images'].append({'bufferView':self.view(b.getvalue()),'mimeType':'image/png'})
        self.doc['textures'].append({'source':ii,'sampler':0})
        m={'name':texture,'pbrMetallicRoughness':{'baseColorTexture':{'index':ti},'metallicFactor':0,'roughnessFactor':1},'doubleSided':False,'extensions':{'KHR_materials_unlit':{}}}
        if im.getextrema()[3][0]<255:m.update(alphaMode='MASK',alphaCutoff=0.1)
        if 'stained_glass' in texture:
            m.update(alphaMode='BLEND');m.pop('alphaCutoff',None)
        self.doc['materials'].append(m);self.materials[key]=index
        return index
    def save(self,path,groups):
        for (texture,tint),g in groups.items():
            self.doc['meshes'][0]['primitives'].append({'attributes':{
                'POSITION':self.accessor(g['pos'],'VEC3'),'NORMAL':self.accessor(g['normal'],'VEC3'),
                'TEXCOORD_0':self.accessor(g['uv'],'VEC2'),'COLOR_0':self.accessor(g['color'],'VEC3')},'material':self.material(texture,tint)})
        while len(self.blob)%4:self.blob.append(0)
        self.doc['buffers']=[{'byteLength':len(self.blob)}]
        header=json.dumps(self.doc,separators=(',',':')).encode()
        header+=b' '*((-len(header))%4)
        path.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(header)+len(self.blob))+struct.pack('<I4s',len(header),b'JSON')+header+struct.pack('<I4s',len(self.blob),b'BIN\0')+self.blob)

@lru_cache(None)
def geometry(name, props):
    s={'Name':name,'Properties':dict(props)}
    result=[]
    for v in variants(s):
        if 'fluid' in v:
            texture='block/'+v['fluid']+'_still'
            height=16
            m={'textures':{'all':texture,'flow':'block/'+v['fluid']+'_flow'},'elements':[{'from':[0,0,0],'to':[16,height,16],
                'faces':{d:{'texture':'#all' if d in ('up','down') else '#flow','cullface':d} for d in NORMALS}}]}
        else:m=model(v['model'])
        transform=rotation('y',-v.get('y',0)) @ rotation('x',-v.get('x',0))
        for element in m.get('elements',[]):
            a=element['from'];b=element['to']
            for side,face in element.get('faces',{}).items():
                tex=face['texture']
                seen=set()
                while isinstance(tex,str) and tex.startswith('#'):
                    if tex in seen:raise ValueError('Texture cycle')
                    seen.add(tex);tex=m['textures'][tex[1:]]
                if isinstance(tex,dict):tex=tex['sprite']
                verts=np.array(face_vertices(side,a,b),dtype=float)
                norm=np.array(NORMALS[side],dtype=float)
                if 'rotation' in element:
                    r=element['rotation'];mat=rotation(r['axis'],r['angle']);center=np.array(r['origin'])
                    verts=(verts-center) @ mat.T+center;norm=mat@norm
                    if r.get('rescale'):
                        scale=np.ones(3)/math.cos(math.radians(r['angle']));scale['xyz'.index(r['axis'])]=1
                        verts=(verts-center)*scale+center
                verts=(verts-8) @ transform.T+8
                norm=transform@norm
                cull=tuple(int(round(t)) for t in transform@np.array(NORMALS[face['cullface']])) if 'cullface' in face else None
                u0,v0,u1,v1=face.get('uv',default_uv(side,a,b))
                uv=[(u0/16,v0/16),(u0/16,v1/16),(u1/16,v1/16),(u1/16,v0/16)]
                n=face.get('rotation',0)//90
                uv=uv[n:]+uv[:n]
                if v.get('uvlock') and 'rotation' not in element:
                    worldside=max(NORMALS,key=lambda side:np.dot(norm,NORMALS[side]))
                    uv=[]
                    for vx,vy,vz in verts:
                        u,w={'up':(vx,vz),'down':(vx,16-vz),'north':(16-vx,16-vy),'south':(vx,16-vy),'west':(vz,16-vy),'east':(16-vz,16-vy)}[worldside]
                        uv.append((u/16,w/16))
                tint=(128,174,80,255) if 'tintindex' in face else None
                result.append((verts/16,norm,uv,tex,tint,cull))
    return result

def full_cube(s):
    n=resource(s['Name'])
    if n in ('grass_block','snow_block'):return True
    return not any(t in n for t in ('stairs','slab','wall','fence','pane','button','trapdoor','portal','lantern','lava','water','grass_block','dirt_path','snow','glass'))

