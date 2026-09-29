# Production asset provenance

- `fonts/Monocraft.ttf`: Idrees Hassan / Monocraft contributors, https://github.com/IdreesInc/Monocraft, downloaded 2026-09-28 from `dist/Monocraft-ttf/Monocraft.ttf`. License: `fonts/OFL.txt` (SIL Open Font License 1.1).
- `textures/*preview*.png`: unchanged copies of this repository's existing project screenshots from `public/Projects/`, used with the matching local portfolio data. Originals remain unchanged.
- `models/house.glb`: curated house authored against the user's recorded build. Uses the installed Minecraft 26.3 client block models and vanilla texture frames (Mojang/Microsoft assets). Geometry is built offline by `tools/build_house.py`, adapted from the user's local Minecraft project's block-model exporter. It is not an exact world extraction. The build report records the output hash, sizes, and counts.
- Vertex colors preserve directional face shading, local corner occlusion, and a restrained warm lantern field. Runtime structural materials receive soft directional shadows, sky fill, and warm/cool lantern lights, with sRGB output and ACES tone mapping. Four presets follow India Standard Time; luminous blocks and readable display faces keep their own brightness.
- `audio/snowfall.mp3`: original synthesized ambient instrumental, composed by `tools/compose_ambient.py`, with no third-party samples. See `audio/README.md`.
- Banner artwork and lantern halos are original procedural canvas assets.
- Sign artwork is generated at runtime in `scene/DisplayBoard.jsx`; project screenshots retain their existing provenance.

Vite manages all production image/font/model URLs. The client JAR, reference recordings and world saves are offline inputs only and are never loaded by the website.
