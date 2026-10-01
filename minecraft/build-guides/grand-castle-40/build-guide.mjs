import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const model=fs.readFileSync(path.join(root,'model.js'),'utf8');
const html=fs.readFileSync(path.join(root,'guide-template.html'),'utf8').replace('__CASTLE_MODEL__',model);
fs.writeFileSync(path.resolve(root,'../grand-librarian-castle-40.html'),html);
const window={};new Function('window',model)(window);
const data=window.GRAND_CASTLE_DATA,cells=[];
for(let y=0;y<data.height;y++)for(let z=0;z<data.depth;z++)for(let x=0;x<data.width;x++){
  const cell=data.layers[y][z*data.width+x];if(cell)cells.push({x,y,z,...cell});
}
const blueprint={...data,layers:undefined,cells,source:'grand-librarian-castle-40.html',sourceSha256:crypto.createHash('sha256').update(html).digest('hex')};
fs.writeFileSync(path.join(root,'renders/blueprint.json'),JSON.stringify(blueprint));
console.log(`${data.name}: ${cells.length.toLocaleString()} placed spaces, ${data.booths.length} librarians, ${data.height} layers.`);
