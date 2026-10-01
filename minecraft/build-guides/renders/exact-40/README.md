# Renders of the 40-librarian tutorial

Open [the render viewer](http://127.0.0.1:8765/renders/exact-40/) on the same persistent server as the tutorial.

| Image | View |
| --- | --- |
| `01-finished-exterior.png` | Complete exterior |
| `02-two-floor-cutaway.png` | Both floors, with roof, east hall half and upper front wall removed for visibility |
| `03-upper-trading-aisle.png` | Upper aisle, beneath the pitched roof |
| `04-ground-trading-aisle.png` | Ground aisle, beneath the second-floor deck |
| `05-librarian-booth.png` | Glass front, lectern, librarian and rear door |

The geometry comes directly from `librarian-castle-40.html`: 7,955 placed block spaces, 40 booths, 40 lecterns and 40 doors. Block shapes and textures are resolved from the installed Minecraft Java 26.3 assets. One static adult plains librarian is shown at each booth's specified standing cell.

These are blueprint renders, not Minecraft world screenshots. Terrain, lighting, sign typography and villager poses are illustrative. The final appearance also depends on your resource pack, shaders and location. The original concept images include decoration absent from the coordinate plan.

To refresh the blueprint and local game assets after editing the tutorial:

```bash
node minecraft/build-guides/renders/exact-40/export-blueprint.mjs
python3 minecraft/build-guides/renders/exact-40/extract-assets.py
```

The `sourceSha256` value in `blueprint.json` records the HTML snapshot. The viewer's `window.RENDER_STATS` reports source and visible block counts, booth count and rendered villagers. Image captures use an 1800 × 1125 viewport with `?view=exterior&capture=1`, substituting `cutaway`, `upper`, `ground` or `booth` for the other views.
