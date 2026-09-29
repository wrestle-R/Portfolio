# House model source

The entrance and hall are authored with Minecraft block geometry, tiled pixel textures, per-corner ambient occlusion, and a baked warm lantern field. Runtime lighting adds the four IST time-of-day settings.

Reference: https://github.com/andrewwoan/woan-minecraft-folio — its baked materials informed the surface treatment; its house model and baked textures were not copied.

To rebuild, install requirements in a Python virtual environment, then run:

```sh
python minecraft/model-source/build_house.py --jar /path/to/minecraft/client.jar
```

The generator uses the Minecraft 26.3 client assets. It updates `minecraft/assets/models/house.glb`, `lanterns.json`, and a local build report. The client JAR is not included.

You can import `house.glb` into Blender through File → Import → glTF 2.0. This is a GLB model, not a Blender source file. The interactive nameplate and exhibit text are drawn by `scene/DisplayBoard.jsx` at runtime.
