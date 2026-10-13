import { useEffect, useState } from "react";
import { CanvasTexture, SRGBColorSpace, LinearMipmapLinearFilter } from "three";
const EMPTY_TECH = [];

function paintBlock(ctx, x, y, size, top, left, right) {
  const face = (points, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach(([px, py], index) => index ? ctx.lineTo(px, py) : ctx.moveTo(px, py));
    ctx.closePath();
    ctx.fill();
  };
  face([[x, y], [x + size, y + size / 2], [x, y + size], [x - size, y + size / 2]], top);
  face([[x - size, y + size / 2], [x, y + size], [x, y + size * 2], [x - size, y + size * 1.5]], left);
  face([[x, y + size], [x + size, y + size / 2], [x + size, y + size * 1.5], [x, y + size * 2]], right);
}

function paintPosterArt(ctx, experience) {
  ctx.fillStyle = "#24382f";
  ctx.fillRect(898, 132, 306, 336);
  ctx.strokeStyle = "#d4b77a18";
  ctx.lineWidth = 1;
  for (let x = 910; x < 1204; x += 24) {
    for (let y = 144; y < 468; y += 24) ctx.strokeRect(x, y, 24, 24);
  }
  // Block-built silhouettes keep the illustration native to the house.
  if (experience) {
    ctx.strokeStyle = "#be9b5c";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(953, 364); ctx.lineTo(953, 320); ctx.lineTo(1050, 320);
    ctx.lineTo(1050, 240); ctx.lineTo(1150, 240); ctx.lineTo(1150, 364);
    ctx.stroke();
    paintBlock(ctx, 1050, 170, 67, "#e4c88b", "#9a7847", "#c19a5c");
    paintBlock(ctx, 953, 341, 36, "#a8c5aa", "#527b65", "#70987b");
    paintBlock(ctx, 1150, 341, 36, "#a8c5aa", "#527b65", "#70987b");
    ctx.fillStyle = "#fff0c2";
    ctx.fillRect(1041, 201, 18, 18);
  } else {
    paintBlock(ctx, 1050, 216, 108, "#dcbe83", "#765337", "#a27a4b");
    // The three-by-three crafting grid follows the top face's perspective.
    ctx.strokeStyle = "#765337";
    ctx.lineWidth = 5;
    for (const offset of [1 / 3, 2 / 3]) {
      ctx.beginPath();
      ctx.moveTo(1050 - 108 * offset, 216 + 54 * offset);
      ctx.lineTo(1158 - 108 * offset, 270 + 54 * offset);
      ctx.moveTo(1050 + 108 * offset, 216 + 54 * offset);
      ctx.lineTo(942 + 108 * offset, 270 + 54 * offset);
      ctx.stroke();
    }
    ctx.fillStyle = "#d1ad70";
    ctx.fillRect(969, 323, 16, 63);
    ctx.fillRect(993, 339, 16, 63);
    ctx.fillStyle = "#513d29";
    ctx.fillRect(1093, 327, 40, 40);
    ctx.fillStyle = "#dfc38a";
    ctx.fillRect(1016, 158, 12, 12);
    ctx.fillRect(1104, 181, 16, 16);
    ctx.fillRect(1147, 141, 8, 8);
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "#c7b48b";
  ctx.font = "18px Monocraft, monospace";
  ctx.fillText(experience ? "REAL-WORLD BUILDS" : "ONE BLOCK AT A TIME", 1050, 451);
}

export default function DisplayBoard({
  position,
  rotation = [0, 0, 0],
  title,
  caption,
  image,
  logo,
  subtitle,
  tech = EMPTY_TECH,
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
        const experience = kind === "experience";
        // Treat the wall signs as illustrated posters, readable from the tour path.
        ctx.fillStyle = "#d6bb7e08";
        for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 1);
        ctx.strokeStyle = "#75674b";
        ctx.lineWidth = 2;
        ctx.strokeRect(28, 28, w - 56, h - 56);
        ctx.strokeStyle = "#34453c";
        ctx.strokeRect(38, 38, w - 76, h - 76);
        ctx.fillStyle = "#d5b87c";
        for (const x of [28, w - 40]) {
          for (const y of [28, h - 40]) ctx.fillRect(x, y, 12, 12);
        }
        paintPosterArt(ctx, experience);
        ctx.textAlign = "left";
        ctx.fillStyle = "#c9ae7c";
        ctx.font = "30px Monocraft, monospace";
        ctx.fillText(experience ? caption.toUpperCase() : "HAVE AN IDEA?", 76, 101, 1128);
        ctx.fillStyle = "#c9ae7c";
        ctx.fillRect(76, 126, 72, 5);
        if (experience) {
          if (picture) {
            const scale = Math.min(340 / picture.width, 76 / picture.height);
            ctx.drawImage(picture, 76, 158 + (76 - picture.height * scale) / 2, picture.width * scale, picture.height * scale);
          }
          ctx.fillStyle = "#f2ead8";
          ctx.font = "600 76px Inter, sans-serif";
          if (ctx.measureText(title).width > 760) {
            const words = title.split(" ");
            ctx.fillText(words.slice(0, -1).join(" "), 76, 315, 760);
            ctx.fillText(words.at(-1), 76, 394, 760);
          } else {
            ctx.fillText(title, 76, 330, 760);
          }
          ctx.fillStyle = "#c7d0c0";
          ctx.font = "30px Inter, sans-serif";
          ctx.fillText(subtitle || "", 76, 449, 760);
        } else {
          ctx.fillStyle = "#f2ead8";
          ctx.font = "112px Monocraft, monospace";
          ctx.fillText("LET’S", 72, 259);
          ctx.fillStyle = "#e0c184";
          ctx.fillText("BUILD.", 72, 385);
          ctx.fillStyle = "#c7d0c0";
          ctx.font = "30px Inter, sans-serif";
          ctx.fillText("Good things start with a hello.", 76, 449, 760);
        }
        ctx.fillStyle = "#e0c184";
        ctx.fillRect(40, 490, w - 80, 70);
        ctx.fillStyle = "#29382d";
        ctx.font = "26px Monocraft, monospace";
        ctx.fillText(experience ? "EXPLORE EXPERIENCE" : "OPEN THE WORKBENCH", 76, 535, 750);
        ctx.textAlign = "right";
        ctx.font = "36px Monocraft, monospace";
        ctx.fillText("↗", 1185, 538);
        if (experience && tech.length) {
          ctx.font = "18px Inter, sans-serif";
          ctx.fillText(tech.slice(0, 3).join(" / "), 1125, 535, 440);
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
  }, [title, caption, image, logo, subtitle, tech, kind, entrance]);
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
            color={entrance ? "#937244" : hovered ? "#b99b62" : "#716044"}
            roughness={0.65}
            metalness={0.05}
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
