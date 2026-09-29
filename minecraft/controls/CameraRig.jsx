import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Euler, Quaternion, Vector3 } from "three";
import { chapterAt, chapters, sampleRail } from "../data/layout";
import { floorAt, moveWalker } from "./navigation";

export default function CameraRig({
  controller,
  onChapter,
  onReady,
  onFailure,
  openPanel,
}) {
  const { camera, gl, size } = useThree();
  useEffect(() => {
    camera.fov = size.width < 700 ? 73 : 58;
    camera.updateProjectionMatrix();
  }, [camera, size.width]);
  const scratch = useRef({
    target: new Vector3(),
    position: new Vector3(),
    quaternion: new Quaternion(),
    offset: new Quaternion(),
    euler: new Euler(0, 0, 0, "YXZ"),
    chapter: -1,
    mode: "tour",
    frames: 0,
  });
  useEffect(() => {
    const canvas = gl.domElement,
      host = canvas.parentElement;
    canvas.setAttribute(
      "aria-label",
      "Interactive Minecraft house. Scroll to tour, drag to look, or use Page Up and Page Down. Enter opens chapter details.",
    );
    canvas.tabIndex = 0;
    const reset = () => {
      controller.keys.clear();
      controller.drag = null;
    };
    const wheel = (e) => {
      if (controller.paused) return;
      e.preventDefault();
      if (controller.mode === "tour")
        controller.target = Math.max(
          0,
          Math.min(
            1,
            controller.target +
              (e.deltaY *
                (e.deltaMode === 1
                  ? 16
                  : e.deltaMode === 2
                    ? window.innerHeight
                    : 1)) /
                (window.innerHeight * 6),
          ),
        );
    };
    const down = (e) => {
      if (controller.paused || e.button > 0) return;
      canvas.focus({ preventScroll: true });
      controller.moved = false;
      controller.drag = {
        x: e.clientX,
        y: e.clientY,
        startX: e.clientX,
        startY: e.clientY,
        id: e.pointerId,
        touch: e.pointerType === "touch",
      };
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      const d = controller.drag;
      if (!d || d.id !== e.pointerId || controller.paused) return;
      const dx = e.clientX - d.x,
        dy = e.clientY - d.y;
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 8)
        controller.moved = true;
      if (d.touch && controller.mode === "tour" && !controller.lookTouch)
        controller.target = Math.max(
          0,
          Math.min(1, controller.target - dy / (window.innerHeight * 3)),
        );
      else {
        const limit = controller.mode === "tour" ? 0.96 : Infinity;
        controller.yaw = Math.max(
          -limit,
          Math.min(limit, controller.yaw - dx * 0.003),
        );
        controller.pitch = Math.max(
          -1.3,
          Math.min(1.3, controller.pitch - dy * 0.003),
        );
        if (controller.mode === "tour")
          controller.pitch = Math.max(-0.44, Math.min(0.44, controller.pitch));
      }
      d.x = e.clientX;
      d.y = e.clientY;
    };
    const up = () => {
      controller.drag = null;
    };
    const key = (e) => {
      if (controller.paused || e.target !== canvas) return;
      const k = e.key.toLowerCase();
      if (k === "enter") {
        e.preventDefault();
        openPanel(chapters[Math.max(1, chapterAt(controller.progress))].id);
        return;
      }
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowleft",
          "arrowright",
          "arrowup",
          "arrowdown",
          "pageup",
          "pagedown",
          "home",
          "end",
        ].includes(k)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
      controller.keys.add(k);
      if (controller.mode === "tour") {
        if (k === "home") controller.target = 0;
        if (k === "end") controller.target = 1;
        if (!e.repeat && ["pageup", "pagedown"].includes(k))
          controller.target =
            chapters[
              Math.max(
                0,
                Math.min(
                  chapters.length - 1,
                  chapterAt(controller.target) + (k === "pageup" ? -1 : 1),
                ),
              )
            ].progress;
      }
    };
    const keyup = (e) => controller.keys.delete(e.key.toLowerCase());
    const lost = (e) => {
      e.preventDefault();
      onFailure(
        "The 3D view lost its graphics connection. Your portfolio is still available below.",
      );
    };
    host.addEventListener("wheel", wheel, { passive: false });
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", reset);
    canvas.addEventListener("keydown", key);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      reset();
      host.removeEventListener("wheel", wheel);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", reset);
      canvas.removeEventListener("keydown", key);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      canvas.removeEventListener("webglcontextlost", lost);
    };
  }, [camera, gl, controller, onFailure, openPanel]);
  useFrame((state, delta) => {
    const s = scratch.current,
      c = controller;
    if (document.hidden || c.paused) return;
    const dt = Math.min(delta, 0.05),
      alpha = 1 - Math.exp(-7 * dt);
    if (s.mode !== c.mode) {
      c.keys.clear();
      c.drag = null;
      if (c.mode === "explore") {
        c.saved = c.target;
        c.position = [camera.position.x, camera.position.y, camera.position.z];
        c.position[1] = (floorAt(c.position[0], c.position[2]) ?? 0) + 1.65;
        s.euler.setFromQuaternion(camera.quaternion, "YXZ");
        c.yaw = s.euler.y;
        c.pitch = s.euler.x;
      } else {
        c.target = c.saved;
        c.progress = c.saved;
        c.yaw = 0;
        c.pitch = 0;
      }
      s.mode = c.mode;
    }
    c.yaw +=
      ((c.keys.has("arrowleft") ? 1 : 0) - (c.keys.has("arrowright") ? 1 : 0)) *
      dt;
    c.pitch = Math.max(
      c.mode === "tour" ? -0.44 : -1.3,
      Math.min(
        c.mode === "tour" ? 0.44 : 1.3,
        c.pitch +
          ((c.keys.has("arrowup") ? 1 : 0) -
            (c.keys.has("arrowdown") ? 1 : 0)) *
            dt,
      ),
    );
    if (c.mode === "tour") {
      c.yaw = Math.max(-0.96, Math.min(0.96, c.yaw));
      c.progress += (c.target - c.progress) * alpha;
      const pose = sampleRail(c.progress);
      s.position.fromArray(pose.p);
      s.target.fromArray(pose.look);
      camera.position.copy(s.position);
      camera.lookAt(s.target);
      s.offset.setFromEuler(s.euler.set(c.pitch, c.yaw, 0, "YXZ"));
      camera.quaternion.multiply(s.offset);
    } else {
      let forward = (c.keys.has("w") ? 1 : 0) - (c.keys.has("s") ? 1 : 0),
        side = (c.keys.has("d") ? 1 : 0) - (c.keys.has("a") ? 1 : 0);
      const length = Math.hypot(forward, side) || 1;
      forward /= length;
      side /= length;
      c.position = moveWalker(
        c.position,
        (side * Math.cos(c.yaw) - forward * Math.sin(c.yaw)) * dt * 2.6,
        (-forward * Math.cos(c.yaw) - side * Math.sin(c.yaw)) * dt * 2.6,
      );
      camera.position.fromArray(c.position);
      camera.quaternion.setFromEuler(s.euler.set(c.pitch, c.yaw, 0, "YXZ"));
    }
    const chapter = chapterAt(c.progress);
    if (s.chapter !== chapter) {
      s.chapter = chapter;
      onChapter(chapter);
    }
    if (++s.frames === 2) onReady();
    if (s.frames % 30 === 0) {
      // Read-only diagnostics for repeatable local verification.
      gl.domElement.dataset.renderStats = JSON.stringify({
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        progress: +c.progress.toFixed(3),
        position: camera.position.toArray().map((v) => +v.toFixed(2)),
        mode: c.mode,
      });
    }
  });
  return null;
}
