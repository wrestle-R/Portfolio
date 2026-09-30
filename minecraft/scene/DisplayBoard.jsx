import { useEffect, useState } from "react";
import { CanvasTexture, SRGBColorSpace, LinearMipmapLinearFilter } from "three";

export default function DisplayBoard({
  position,
  rotation = [0, 0, 0],
  title,
  caption,
  image,
  logo,
  subtitle,
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
    canvas.width = 2560;
    canvas.height = (entrance ? 408 : image ? 980 : 600) * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.anisotropy = 8;
    function paint(picture) {
      if (cancelled) return;
      const w = 1280,
        h = canvas.height / 2;
      ctx.fillStyle = entrance ? "#e8d9b5" : "#1d2926";
      ctx.fillRect(0, 0, w, h);
      // Understated inlay; all text remains inside a generous safe area.
      ctx.strokeStyle = "#716449";
      ctx.lineWidth = 3;
      if (entrance) ctx.strokeRect(24, 24, w - 48, h - 48);
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
        ctx.fillStyle = "#b9ad91";
        ctx.font = "24px Monocraft, monospace";
        ctx.fillText(caption, 65, 85);
        ctx.fillStyle = "#111a19";
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
        ctx.fillStyle = "#eee7d7";
        ctx.font = "600 58px Inter, sans-serif";
        ctx.fillText(title, 65, 820, 1090);
        ctx.fillStyle = "#b5bdaf";
        ctx.font = "25px Monocraft, monospace";
        ctx.fillText("Explore project", 65, 903);
        ctx.textAlign = "right";
        ctx.fillStyle = "#c9ae7c";
        ctx.font = "42px Monocraft, monospace";
        ctx.fillText("↗", 1200, 906);
      } else {
        ctx.textAlign = "center";
        if (logo && picture) {
          const scale = Math.min(450 / picture.width, 100 / picture.height);
          ctx.drawImage(picture, (w - picture.width * scale) / 2, 64, picture.width * scale, picture.height * scale);
        }
        ctx.fillStyle = "#c9ae7c";
        ctx.font = "26px Monocraft, monospace";
        ctx.fillText(caption.toUpperCase(), w / 2, logo ? 225 : 135, 1100);
        ctx.fillStyle = "#eee7d7";
        ctx.font = "600 57px Inter, sans-serif";
        ctx.fillText(title, w / 2, logo ? 325 : 306, 1110);
        if (subtitle) {
          ctx.fillStyle = "#b5bdaf";
          ctx.font = "30px Inter, sans-serif";
          ctx.fillText(subtitle, w / 2, 392, 1110);
        }
      }
      texture.needsUpdate = true;
      setMap(texture);
    }
    let picture;
    if (image || logo) {
      picture = new Image();
      picture.onload = () => paint(picture);
      picture.onerror = () => paint();
      picture.src = image || logo;
    }
    paint();
    Promise.all([document.fonts.load("32px Monocraft"), document.fonts.load("600 58px Inter")]).then(
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
  }, [title, caption, image, logo, subtitle, entrance]);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.16, height + 0.16, 0.16]} />
        <meshStandardMaterial color="#292a25" roughness={0.9} />
      </mesh>
      {[
        [-width / 2 - 0.055, 0, 0.055, height + 0.15],
        [width / 2 + 0.055, 0, 0.055, height + 0.15],
        [0, height / 2 + 0.055, width + 0.16, 0.055],
        [0, -height / 2 - 0.055, width + 0.16, 0.055],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.065]} castShadow>
          <boxGeometry args={[w, h, 0.12]} />
          <meshStandardMaterial
            color={entrance ? "#937244" : hovered ? "#6c7666" : "#3a4138"}
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>
      ))}
      {entrance && [-1, 1].flatMap((x) =>
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
        userData={{ onActivate: onClick }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(event) => {
          event.stopPropagation();
          if (!controller.locked && !controller.moved && !controller.paused) onClick();
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
