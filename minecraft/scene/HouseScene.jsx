import { useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  CanvasTexture,
  SRGBColorSpace,
  LinearFilter,
  NoToneMapping,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import houseUrl from "../assets/models/house.glb?url";

import CameraRig from "../controls/CameraRig";
import portfolio, { preview } from "../data/content";

function House() {
  const { scene } = useLoader(GLTFLoader, houseUrl);
  return <primitive object={scene} dispose={null} />;
}
function Sign({
  position,
  rotation = [0, 0, 0],
  title,
  caption,
  image,
  onClick,
  controller,
}) {
  const [map, setMap] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = image ? 560 : 370;
    const ctx = canvas.getContext("2d");
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    function paint(picture) {
      if (cancelled) return;
      ctx.fillStyle = "#33261a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#b79867";
      ctx.fillRect(18, 18, canvas.width - 36, canvas.height - 36);
      // Quiet plank grain keeps the sign part of the build.
      for (let y = 24; y < canvas.height - 18; y += 62) {
        ctx.fillStyle = "#a28457";
        ctx.fillRect(18, y, canvas.width - 36, 5);
      }
      if (picture) ctx.drawImage(picture, 36, 36, 696, 320);
      let y = image ? 397 : 95;
      ctx.textAlign = "center";
      ctx.fillStyle = "#403321";
      ctx.font = "22px Monocraft, monospace";
      ctx.fillText(caption, 384, y, 665);
      ctx.fillStyle = "#251e14";
      ctx.font = "38px Monocraft, monospace";
      ctx.fillText(title, 384, y + 62, 665);
      ctx.fillStyle = "#403321";
      ctx.font = "24px Monocraft, monospace";
      ctx.fillText("OPEN ↗", 384, y + 112);
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
    document.fonts.load("22px Monocraft").then(
      () => paint(picture?.complete && picture.naturalWidth ? picture : null),
      () => paint(picture?.complete && picture.naturalWidth ? picture : null),
    );
    return () => {
      cancelled = true;
      texture.dispose();
      if (picture) {
        picture.onload = null;
        picture.onerror = null;
      }
    };
  }, [title, caption, image]);
  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        if (!controller.moved && !controller.paused) onClick();
      }}
    >
      <planeGeometry args={[3.2, image ? 2.33 : 1.54]} />
      <meshBasicMaterial
        key={map?.uuid || "loading"}
        map={map}
        color={map ? "white" : "#ede6d5"}
      />
    </mesh>
  );
}
export default function HouseScene({
  controller,
  onChapter,
  onReady,
  onFailure,
  openPanel,
  theme,
}) {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={[1, window.matchMedia("(pointer: coarse)").matches ? 1 : 1.5]}
      camera={{ position: [0, -4.35, 23], fov: 64, near: 0.08, far: 100 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = NoToneMapping;
        gl.outputColorSpace = SRGBColorSpace;
      }}
      fallback={
        <div className="mc-no-webgl">
          3D isn’t available on this device. Choose Read portfolio above.
        </div>
      }
    >
      <color attach="background" args={["#91adf5"]} />
      <fog attach="fog" args={["#b7cef6", 50, 110]} />
      {[
        [0, 22, -40, 38, 9],
        [-24, 19, -10, 14, 26],
        [25, 24, 5, 22, 12],
      ].map(([x, y, z, w, d]) => (
        <mesh key={x} position={[x, y, z]}>
          <boxGeometry args={[w, 1, d]} />
          <meshBasicMaterial color="#edf2ff" />
        </mesh>
      ))}
      <House />
      <Sign
        controller={controller}
        position={[0, 4.45, 1.06]}
        title="RUSSEL’S PLACE"
        caption="A portfolio in blocks"
        onClick={() => openPanel("about")}
      />
      {portfolio.projects.map((p, i) => (
        <Sign
          controller={controller}
          key={p.id}
          position={[-5.7, 2.5, -5.5 - i * 5]}
          rotation={[0, Math.PI / 2, 0]}
          title={p.name}
          caption={`0${i + 1} / SELECTED WORK`}
          image={preview(p, theme)}
          onClick={() => openPanel(`project-${p.id}`)}
        />
      ))}
      {portfolio.experiences.map((e, i) => (
        <Sign
          controller={controller}
          key={i}
          position={[5.7, 2.6, -15.5 - i * 5]}
          rotation={[0, -Math.PI / 2, 0]}
          title={e.company}
          caption={e.period}
          onClick={() => openPanel("experience")}
        />
      ))}
      <Sign
        controller={controller}
        position={[0, 2.5, -28.96]}
        title="LET’S BUILD."
        caption="Every good project starts with hello."
        onClick={() => openPanel("contact")}
      />
      <CameraRig
        controller={controller}
        onChapter={onChapter}
        onReady={onReady}
        onFailure={onFailure}
      />
    </Canvas>
  );
}
