import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const directory=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.resolve(directory,'../../librarian-castle-40.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const data=new Function('window',script.slice(0,script.indexOf('const $=id=>'))+'return window.LIBRARIAN_CASTLE_DATA;')({});
const cells=[];
for(let y=0;y<data.height;y++)for(let z=0;z<data.depth;z++)for(let x=0;x<data.width;x++){
  const cell=data.layers[y][z*data.width+x];
  if(cell)cells.push({x,y,z,...cell});
}
const blueprint={width:data.width,depth:data.depth,height:data.height,source:'librarian-castle-40.html',sourceSha256:crypto.createHash('sha256').update(html).digest('hex'),cells,catalog:data.catalog,booths:data.booths};
fs.writeFileSync(path.join(directory,'blueprint.json'),JSON.stringify(blueprint));
console.log(`${cells.length} placed block spaces; ${data.booths.length} librarian booths.`);
