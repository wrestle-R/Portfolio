import { useMemo } from "react";
import { BackSide, Color } from "three";

export default function WorldLighting({ preset }) {
  const skyUniforms = useMemo(
    () => ({
      zenith: { value: new Color(preset.sky) },
      horizon: { value: new Color(preset.horizon) },
      cloudStrength: { value: preset.stars ? 0.08 : 0.55 },
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
      <mesh>
        <sphereGeometry args={[90, 24, 16]} />
        <shaderMaterial
          side={BackSide}
          depthWrite={false}
          uniforms={skyUniforms}
          vertexShader={`varying vec3 direction; void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
          fragmentShader={`
            uniform vec3 zenith; uniform vec3 horizon; uniform float cloudStrength;
            varying vec3 direction;
            float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
            float noise(vec2 p) {
              vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
              return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
            }
            void main(){
              vec3 d=normalize(direction);
              float t=smoothstep(-.1,.65,d.y);
              vec3 sky=mix(horizon,zenith,t);
              vec2 p=d.xz/max(d.y+.25,.1)*2.6;
              float n=noise(p)*.55+noise(p*2.1)*.28+noise(p*4.3)*.17;
              float clouds=smoothstep(.48,.72,n)*smoothstep(.02,.3,d.y)*cloudStrength;
              gl_FragColor=vec4(mix(sky,horizon*1.12,clouds),1.);
              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }`}

        />
      </mesh>
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
