# Asterfall Castle

Guide: [grand-librarian-castle-40-70x60.html](../grand-librarian-castle-40-70x60.html), served by the existing persistent server at [localhost:8765](http://127.0.0.1:8765/grand-librarian-castle-40-70x60.html).

The page contains three sections: the fullscreen layer builder, previews of the finished castle, and the complete item list at the bottom. It remembers the selected layer. X grows east, Z grows south, Y grows upward. Stair arrows use the map's orientation; selecting a block shows its full vanilla ID and state.

The castle fits a 70 × 60 block plot: X=0–59 runs east–west, Z=0–69 runs north–south, and Y=0–49. The north entrance, four original tower sizes, roof height, six dormers, booth dimensions and four-block booth spacing are retained. A shorter approach and a turning rear staircase reduce the length. Four octagonal towers, six dormers, carved window bays, a pointed gate arch, stone balcony and terrace are all included in the coordinate model. The hall holds exactly 40 librarians, 20 per floor. Trade counters have an opening above their lecterns and glazed containment headers. The rear service doors stay separate from the public aisle. The rear staircase has five south-facing steps, a level turning landing and four east-facing steps, with a guarded opening in the upper deck.

`model.js` is the source of the block map, item counts and previews. `build-guide.mjs` embeds it into the HTML and exports the identical coordinates to `renders/blueprint.json`. The renderer uses block models and textures from the installed Minecraft Java 26.3 jar. Stair corners follow the installed game's automatic connection rules.

```bash
node minecraft/build-guides/grand-castle-40-70x60/build-guide.mjs
node minecraft/build-guides/grand-castle-40-70x60/validate-model.mjs
python3 minecraft/build-guides/grand-castle-40-70x60/renders/extract-assets.py
```

Verification covers 40 distinct booths, 40 lecterns, 40 door items, 40 signs, reachable service routes to every booth on both floors, clear trading gaps, a clear entrance, the complete continuous stair route and three blocks of stair and landing headroom. Browser checks cover native and fallback fullscreen, keyboard progression, coordinate inspection and desktop/mobile fitting. The castle has not been assembled in a Minecraft world.

Previews are deterministic renders of the guide's final coordinates. Lighting, generic terrain, sign typography and stationary plains librarian poses are illustrative. Regenerate PNGs from the render page at 1920 × 1200 using `?view=exterior&capture=1`, `front`, and `upper` after changing the model.
