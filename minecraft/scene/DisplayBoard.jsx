import { useEffect, useState } from "react";
import { CanvasTexture, SRGBColorSpace, LinearFilter } from "three";

export default function DisplayBoard({
  position,
  rotation = [0, 0, 0],
  title,
  caption,
  image,
  onClick,
  controller,
  kind = "journal",
}) {
  const [map, setMap] = useState(null);
  const [hovered, setHovered] = useState(false);
  const entrance = kind === "entrance";
  const width = entrance ? 5.5 : image ? 3.05 : 3.5;
  const height = entrance ? 1.75 : image ? 2.35 : 1.65;
  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = entrance ? 408 : image ? 980 : 600;
    const ctx = canvas.getContext("2d");
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.anisotropy = 4;
    function paint(picture) {
      if (cancelled) return;
      const w = canvas.width,
        h = canvas.height;
      ctx.fillStyle = entrance ? "#e8d9b5" : "#192526";
      ctx.fillRect(0, 0, w, h);
      // Understated inlay; all text remains inside a generous safe area.
      ctx.strokeStyle = "#716449";
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, w - 48, h - 48);
      ctx.textAlign = "left";
      if (entrance) {
        ctx.fillStyle = "#796343";
        ctx.font = "22px Monocraft, monospace";
        ctx.textAlign = "center";
        ctx.fillText("WELCOME TO", w / 2, 74);
        ctx.fillStyle = "#30291f";
        ctx.font = "100px Monocraft, monospace";
        ctx.fillText("RUSSEL", w / 2, 192);
        ctx.font = "76px Monocraft, monospace";
        ctx.fillText("DANIEL PAUL", w / 2, 282);
        ctx.fillStyle = "#796343";
        ctx.font = "22px Monocraft, monospace";
        ctx.fillText("EXPLORE     BUILD     LEARN", w / 2, 352);
      } else if (image) {
        ctx.fillStyle = "#ad9873";
        ctx.font = "24px Monocraft, monospace";
        ctx.fillText(caption, 65, 85);
        ctx.fillStyle = "#0c1416";
        ctx.fillRect(60, 125, 1160, 600);
        if (picture) {
          const scale = Math.min(1160 / picture.width, 600 / picture.height);
          const iw = picture.width * scale,
            ih = picture.height * scale;
          ctx.drawImage(
            picture,
            60 + (1160 - iw) / 2,
            125 + (600 - ih) / 2,
            iw,
            ih,
          );
        }
        ctx.fillStyle = "#f2e5c9";
        ctx.font = "52px Monocraft, monospace";
        ctx.fillText(title, 65, 820, 1090);
        ctx.fillStyle = "#bbaa88";
        ctx.font = "25px Monocraft, monospace";
        ctx.fillText("Explore project", 65, 903);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ddbf7e";
        ctx.font = "42px Monocraft, monospace";
        ctx.fillText("↗", 1200, 906);
      } else {
        ctx.textAlign = "center";
        ctx.fillStyle = "#b9a078";
        ctx.font = `${entrance ? 22 : 30}px Monocraft, monospace`;
        ctx.fillText(caption.toUpperCase(), w / 2, entrance ? 83 : 135, 1100);
        ctx.fillStyle = "#f5e7c9";
        ctx.font = `${entrance ? 66 : 54}px Monocraft, monospace`;
        const words = title.split(" ");
        const lines = [];
        let line = "";
        for (const word of words) {
          const next = line ? line + " " + word : word;
          if (ctx.measureText(next).width > 1080 && line) {
            lines.push(line);
            line = word;
          } else line = next;
        }
        lines.push(line);
        const baseline = entrance ? 191 : lines.length > 1 ? 270 : 306;
        lines.forEach((text, i) =>
          ctx.fillText(text, w / 2, baseline + i * 74, 1100),
        );
        ctx.fillStyle = "#b9a078";
        ctx.font = `${entrance ? 21 : 28}px Monocraft, monospace`;
        ctx.fillText(
          entrance
            ? "DEVELOPER  /  BUILDER  /  EXPLORER"
            : "Read the story  ↗",
          w / 2,
          entrance ? 262 : 485,
        );
      }
      texture.needsUpdate = true;
      setMap(texture);
    }
    let picture;
    if (image) {
      picture = new Image();
      picture.onload = () => paint(picture);
      picture.onerror = () => paint();
      picture.src = image;
    }
    paint();
    document.fonts.load("32px Monocraft").then(
      () => paint(picture?.complete && picture.naturalWidth ? picture : null),
      () => paint(),
    );
    return () => {
      cancelled = true;
      texture.dispose();
      if (picture) {
        picture.onload = null;
        picture.onerror = null;
      }
    };
  }, [title, caption, image, entrance]);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.3, height + 0.3, 0.2]} />
        <meshStandardMaterial color="#30241b" roughness={0.9} />
      </mesh>
      {[
        [-width / 2 - 0.055, 0, 0.11, height + 0.15],
        [width / 2 + 0.055, 0, 0.11, height + 0.15],
        [0, height / 2 + 0.055, width + 0.22, 0.11],
        [0, -height / 2 - 0.055, width + 0.22, 0.11],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.065]} castShadow>
          <boxGeometry args={[w, h, 0.12]} />
          <meshStandardMaterial
            color={hovered ? "#c5a56b" : "#937244"}
            roughness={0.65}
            metalness={0.25}
          />
        </mesh>
      ))}
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((y) => (
          <mesh
            key={`${x}-${y}`}
            position={[x * (width / 2 + 0.05), y * (height / 2 + 0.05), 0.14]}
          >
            <boxGeometry args={[0.045, 0.045, 0.025]} />
            <meshStandardMaterial
              color="#e1c387"
              metalness={0.4}
              roughness={0.45}
            />
          </mesh>
        )),
      )}
      <mesh
        position={[0, 0, 0.055]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(event) => {
          event.stopPropagation();
          if (!controller.moved && !controller.paused) onClick();
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          key={map?.uuid || "loading"}
          map={map}
          color={map ? "#ffffff" : "#192526"}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
