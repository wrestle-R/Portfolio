# A little world

The alternate Minecraft portfolio is available at `/minecraft`. This folder owns the feature and its production assets; `src/App.jsx` supplies the lazy route.

- `scene/`: curated voxel house, vanilla block materials, framed interactive displays, live sky and lighting presets over baked surface shading.
- `controls/`: finite camera rail input, bounded walking, collision invariants.
- `data/`: house dimensions, chapters, and a snapshot of the current portfolio content.
- `components/`: readable portfolio details, native modal, error recovery.
- `assets/`: original project preview copies and self-hosted Monocraft with its OFL license.

Run `npm run dev`, then open `/minecraft`. Scroll to tour, drag to look, or switch to Explore. On touch, use the Look toggle and walking pad. The keyboard-accessible reading link provides the same content without WebGL and is the default with reduced motion. Page Up / Down navigate the guided route; Enter opens the current chapter’s details. The world has no top/bottom bars or floating chapter cards.

Music is an original 96-second piano/pad loop, played quietly after a click, tap or keypress. The small speaker control remembers mute; hidden tabs and leaving the world stop playback. See `assets/audio/README.md` and `tools/compose_ambient.py`.

Lighting follows `Asia/Kolkata`, regardless of the visitor's timezone: morning 05:00–11:00, afternoon 11:00–17:00, evening 17:00–20:00, and night 20:00–05:00. It refreshes every 30 seconds and on returning to the tab. In development only, use `?time=morning`, `afternoon`, `evening`, or `night` to preview each setting. Production always uses IST.

Validation:

```sh
npm run build
npx eslint minecraft src/App.jsx
node --test minecraft/controls/navigation.test.mjs
node --test minecraft/data/daylight.test.mjs
```

The model is a curated reconstruction of the recorded house using vanilla Minecraft block models and textures. It preserves the snowy stair ravine, pale centerline, layered spruce-and-dark-oak entrance, deepslate hall, gilded band, crimson runner, lanterns and display alcoves. It is not an exact extraction of the world. The browser loads only the compact GLB, never the client JAR, world archive or recording.

The GLB is prebuilt; a normal install/build needs no Python or Minecraft installation. To regenerate it locally:

```sh
python -m pip install -r minecraft/tools/requirements.txt
python minecraft/tools/build_house.py --jar /path/to/26.3.jar
```

One block is one local unit; the doorway is at the origin and the hall runs along negative Z. Keep `controls/navigation.js` boundaries in sync with structural changes to `tools/build_house.py`. The right-hand experience wall is open; the other bays have solid partitions. The readable experience panel also shares a chronological connected timeline.


The local [context pack](../docs/START_HERE.md) and [latest handoff](../docs/HANDOFF.md) are ignored by Git. They include source evidence, design decisions, and browser verification records; preserve them when continuing locally. Production builds are independent of that folder.
