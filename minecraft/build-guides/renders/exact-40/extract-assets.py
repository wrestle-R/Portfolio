"""Resolve the installed game's block models for this blueprint's exact states."""
import json
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parent
JAR = Path('/home/rdp/.minecraft/versions/26.3/26.3.jar')
blueprint = json.loads((ROOT / 'blueprint.json').read_text())
models, states, textures, render_models = {}, {}, set(), set()

def name(ref):
    return ref.split(':')[-1]

with ZipFile(JAR) as jar:
    def resolve(ref):
        key = name(ref)
        if key in models:
            return models[key]
        own = json.loads(jar.read(f'assets/minecraft/models/{key}.json'))
        parent = resolve(own['parent']) if 'parent' in own else {}
        model = {**parent, **own, 'textures': {**parent.get('textures', {}), **own.get('textures', {})}}
        models[key] = model
        return model

    for item in blueprint['catalog'].values():
        block = name(item['id'].split('[')[0])
        state = json.loads(jar.read(f'assets/minecraft/blockstates/{block}.json'))
        states[block] = state
        for variant in list(state.get('variants', {}).values()) + [v['apply'] for v in state.get('multipart', [])]:
            for part in variant if isinstance(variant, list) else [variant]:
                resolve(part['model'])
                render_models.add(name(part['model']))

    for key in render_models:
        model = models[key]
        for element in model.get('elements', []):
            for face in element['faces'].values():
                texture = face['texture']
                if isinstance(texture, dict):
                    texture = texture['sprite']
                while texture.startswith('#'):
                    texture = model['textures'][texture[1:]]
                    if isinstance(texture, dict):
                        texture = texture['sprite']
                textures.add(name(texture))
    textures.update(['block/grass_block_top', 'block/dirt', 'entity/villager/villager', 'entity/villager/type/plains', 'entity/villager/profession/librarian'])
    for texture in sorted(textures):
        target = ROOT / 'textures' / (texture + '.png')
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(jar.read(f'assets/minecraft/textures/{texture}.png'))

(ROOT / 'models.json').write_text(json.dumps({'gameVersion': '26.3', 'models': models, 'states': states, 'textures': sorted(textures)}, separators=(',', ':')))
print(json.dumps({'models': len(models), 'states': len(states), 'textures': len(textures)}))
