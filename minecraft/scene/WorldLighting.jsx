import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Color } from "three";

export default function WorldLighting({ preset }) {
  const sky = useRef(null);
  useFrame(({ camera }) => {
    if (sky.current) sky.current.position.copy(camera.position);
  });
  const skyUniforms = useMemo(
    () => ({
      zenith: { value: new Color(preset.sky) },
      horizon: { value: new Color(preset.horizon) },
    }),
    [preset],
  );
  const stars = useMemo(() => {
    let seed = 9126;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const points = [];
    for (let i = 0; i < 180; i++) {
      const theta = random() * Math.PI * 2,
        y = 0.15 + random() * 0.8;
      const r = Math.sqrt(1 - y * y);
      points.push(Math.cos(theta) * r * 82, y * 82, Math.sin(theta) * r * 82);
    }
    return new Float32Array(points);
  }, []);
  return (
    <>
      <color attach="background" args={[preset.sky]} />
      <fog attach="fog" args={[preset.fog, 42, 100]} />
      <mesh ref={sky} renderOrder={-1}>
        <sphereGeometry args={[65, 24, 16]} />
        <shaderMaterial
          side={BackSide}
          depthWrite={false}
          depthTest={false}
          uniforms={skyUniforms}
          vertexShader={`varying vec3 direction; void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
          fragmentShader={`
            uniform vec3 zenith; uniform vec3 horizon;
            varying vec3 direction;
            void main(){
              float t=smoothstep(-.1,.65,normalize(direction).y);
              gl_FragColor=vec4(mix(horizon,zenith,t),1.);
              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }`}

        />
      </mesh>
      {/* Shallow voxel clouds: broad tops, stepped outlines, shaded undersides. */}
      {[
        [-29, 29, -22, 12, 8], [-19, 29, -26, 8, 5], [-35, 29, -15, 8, 6],
        [22, 32, -30, 14, 7], [32, 32, -25, 9, 9], [16, 32, -27, 6, 5],
        [-7, 35, -48, 13, 8], [3, 35, -46, 10, 5],
        [30, 30, 10, 10, 7], [-32, 32, 14, 13, 8],
      ].map(([x, y, z, w, d], index) => (
        <mesh key={index} position={[x, y, z]}>
          <boxGeometry args={[w, 1.1, d]} />
          <meshStandardMaterial color={preset.stars ? "#55627c" : "#f4f3e9"} roughness={1} />
        </mesh>
      ))}
      {preset.stars && (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[stars, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#dee9ff"
            size={0.17}
            transparent
            opacity={0.8}
            depthWrite={false}
            fog={false}
            toneMapped={false}
          />
        </points>
      )}
      <hemisphereLight
        args={[preset.ambientSky, preset.ground, preset.ambient]}
      />
      <directionalLight
        position={[0, 10, 20]}
        color={preset.sun}
        intensity={preset.ambient * 0.3}
      />
      <directionalLight
        position={preset.sunPosition}
        color={preset.sun}
        intensity={preset.sunPower}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-19}
        shadow-camera-right={19}
        shadow-camera-top={18}
        shadow-camera-bottom={-19}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0003}
        shadow-normalBias={0.035}
        shadow-radius={3}
      />
      <pointLight
        position={[0, 4.7, 4.7]}
        color="#ffc273"
        intensity={preset.lampPower}
        distance={17}
        decay={2}
      />
      {[-3.5, 3.5].flatMap((x) =>
        [
          [0.91, 5.25],
          [-0.59, 8.25],
          [-2.09, 11.25],
          [-3.59, 14.25],
        ].map(([y, z], row) => (
          <pointLight
            key={`${x}-${z}`}
            position={[x, y, z]}
            color={row % 2 ? "#75d5ef" : "#ffce91"}
            intensity={preset.lampPower * (row % 2 ? 0.16 : 0.32)}
            distance={8}
            decay={2}
          />
        )),
      )}
      {[-4, -14, -24].map((z) => (
        <pointLight
          key={z}
          position={[0, 3.5, z]}
          color="#ffd09a"
          intensity={28}
          distance={14}
          decay={2}
        />
      ))}
    </>
  );
}
