import { useEffect, useMemo, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  CanvasTexture,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  MeshStandardMaterial,
  AdditiveBlending,
  NearestFilter,
  DoubleSide,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import lanterns from "../assets/models/lanterns.json";
import houseUrl from "../assets/models/house.glb?url";

import DisplayBoard from "./DisplayBoard";
import WorldLighting from "./WorldLighting";
import useDaylight from "./useDaylight";
import CameraRig from "../controls/CameraRig";
import portfolio, { preview } from "../data/content";

function House() {
  const { scene } = useLoader(GLTFLoader, houseUrl);
  const world = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((mesh) => {
      if (!mesh.isMesh) return;
      const source = mesh.material;
      const luminous = /lantern|glowstone/.test(source.name);
      mesh.castShadow = !luminous;
      mesh.receiveShadow = true;
      // Keep luminous pixels bright; all structural materials now receive real light.
      mesh.material = luminous
        ? source.clone()
        : new MeshStandardMaterial({
            map: source.map,
            color: source.color,
            vertexColors: true,
            roughness: 0.94,
            metalness: 0,
            alphaTest: source.alphaTest,
            side: /chain|flower|daisy/.test(source.name)
              ? DoubleSide
              : source.side,
          });
      if (luminous) {
        mesh.material.toneMapped = false;
        mesh.material.side = DoubleSide;
      }
    });
    return copy;
  }, [scene]);
  useEffect(
    () => () =>
      world.traverse((mesh) => {
        if (mesh.isMesh) mesh.material.dispose();
      }),
    [world],
  );
  return <primitive object={world} dispose={null} />;
}
function EntranceDetails({ preset }) {
  const [maps, setMaps] = useState(null);
  useEffect(() => {
    const banner = document.createElement("canvas");
    banner.width = 32;
    banner.height = 80;
    const ctx = banner.getContext("2d");
    ctx.fillStyle = "#343536";
    ctx.fillRect(0, 0, 32, 80);
    ctx.fillStyle = "#a9a292";
    ctx.fillRect(2, 0, 2, 80);
    ctx.fillRect(28, 0, 2, 80);
    ctx.fillStyle = "#eee1c7";
    for (let y = 0; y < 5; y++) ctx.fillRect(5 + y, y, 22 - y * 2, 1);
    for (let y = 0; y < 25; y++) {
      const half = Math.floor(y / 2);
      ctx.fillRect(15 - half, 35 + y, 4, 1);
      ctx.fillRect(13 + half, 35 + y, 4, 1);
    }
    ctx.fillRect(14, 19, 4, 12);
    ctx.fillRect(10, 23, 12, 4);
    // Notched cloth foot, with a crisp pixel silhouette.
    for (let y = 0; y < 12; y++) ctx.clearRect(15 - y, 68 + y, 2 + y * 2, 1);
    const cloth = new CanvasTexture(banner);
    cloth.colorSpace = SRGBColorSpace;
    cloth.magFilter = NearestFilter;
    const glow = document.createElement("canvas");
    glow.width = glow.height = 64;
    const light = glow.getContext("2d");
    const gradient = light.createRadialGradient(32, 32, 1, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,0.65)");
    gradient.addColorStop(0.22, "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    light.fillStyle = gradient;
    light.fillRect(0, 0, 64, 64);
    const halo = new CanvasTexture(glow);
    setMaps({ cloth, halo });
    return () => {
      cloth.dispose();
      halo.dispose();
    };
  }, []);
  if (!maps) return null;
  return (
    <>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 4.25, 3.15, 4.08]}>
          <planeGeometry args={[1.05, 2.6]} />
          <meshBasicMaterial
            map={maps.cloth}
            transparent
            alphaTest={0.5}
            side={DoubleSide}
          />
        </mesh>
      ))}
      {lanterns
        .filter(
          (lamp) =>
            lamp.position[2] > 0 || Math.round(lamp.position[2]) % 10 === -2,
        )
        .map((lamp, i) => (
          <sprite key={i} position={lamp.position} scale={[1.4, 1.4, 1.4]}>
            <spriteMaterial
              map={maps.halo}
              color={lamp.soul ? "#76ddff" : "#ffb54a"}
              transparent
              opacity={preset.glow}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        ))}
    </>
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
  const { period, preset } = useDaylight();
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <Canvas
      shadows="soft"
      data-time-of-day={period}
      frameloop={visible ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, -4.35, 23], fov: 64, near: 0.08, far: 100 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.outputColorSpace = SRGBColorSpace;
      }}
      fallback={
        <div className="mc-no-webgl">
          3D isn’t available on this device. Use the accessible portfolio link.
        </div>
      }
    >
      <WorldLighting preset={preset} />
      <House />
      <EntranceDetails preset={preset} />
      <DisplayBoard
        controller={controller}
        position={[0, 4.35, 4.05]}
        kind="entrance"
        title="RUSSEL DANIEL PAUL"
        caption="Welcome to my corner of the world"
        onClick={() => openPanel("about")}
      />
      {portfolio.projects.map((p, i) => (
        <DisplayBoard
          controller={controller}
          key={p.id}
          position={[-5.7, 2.5, -5 - i * 5]}
          rotation={[0, Math.PI / 2, 0]}
          title={p.name}
          caption={`0${i + 1} / SELECTED WORK`}
          image={preview(p, theme)}
          onClick={() => openPanel(`project-${p.id}`)}
        />
      ))}
      <group position={[5.63, 1.32, -15.5]}>
        <mesh position={[0, 0, -5]}>
          <boxGeometry args={[0.055, 0.06, 10]} />
          <meshStandardMaterial color="#c6ad78" roughness={0.8} />
        </mesh>
        {[0, -5, -10].map((z, index) => (
          <group key={z} position={[0, 0, z]}>
            <mesh position={[0, 0.25, 0]}><boxGeometry args={[0.055, 0.5, 0.055]} /><meshStandardMaterial color="#c6ad78" /></mesh>
            <mesh><boxGeometry args={[0.09, 0.23, 0.23]} /><meshStandardMaterial color="#e8d5a4" /></mesh>
            {index < 2 && <mesh position={[0, 0, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.19, 0.4, 3]} /><meshStandardMaterial color="#e8d5a4" />
            </mesh>}
          </group>
        ))}
      </group>
      {portfolio.experiences.map((e, i) => (
        <DisplayBoard
          controller={controller}
          key={i}
          position={[5.7, 2.6, -15.5 - i * 5]}
          rotation={[0, -Math.PI / 2, 0]}
          title={e.company}
          logo={e.logo}
          subtitle={e.role}
          kind="experience"
          caption={`0${i + 1} / ${e.period}`}
          onClick={() => openPanel(e.id)}
        />
      ))}
      <DisplayBoard
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
        openPanel={openPanel}
      />
    </Canvas>
  );
}
