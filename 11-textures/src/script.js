import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x315b39);

// Textures
// 1. Native JavaScript way
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.src = "/textures/door/color.jpg";
// image.addEventListener("load", () => {
//   texture.needsUpdate = true;
// });
// 2. Three.js way
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.repeat.x = 1;
// colorTexture.offset.x = 0.5;
// colorTexture.rotation = Math.PI * 0.25;
colorTexture.magFilter = THREE.NearestFilter;

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100);
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  // wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const aspectRatio = sizes.width / sizes.height;

// Handle screen resizing
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);

  // If you resize when going to another monitor, it updates the pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Allow full screen mode
window.addEventListener("dblclick", () => {
  // The webkit prefixes make this functionality work on Safari
  if (!document.fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 3;
// lookAt points towards another object without having to do math
camera.lookAt(mesh.position);
scene.add(camera);

// Axes Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Get the time to calculate deltatime
const clock = new THREE.Clock();

// Control the camera with the mouse
const cursorPosition = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  cursorPosition.x = event.clientX / sizes.width - 0.5;
  cursorPosition.y = -(event.clientY / sizes.height - 0.5);
});

// Debug Panel
const gui = new dat.GUI();
gui.add(mesh.position, "y").min(-3).max(3).step(0.1).name("elevation");
gui.add(mesh, "visible");
gui.add(material, "wireframe");

// Custom debug parameters
const params = {
  color: 0xeab41f,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};
gui.addColor(params, "color").onChange(() => {
  material.color.set(params.color);
});
gui.add(params, "spin");

// Animations
const tick = () => {
  // Calculate deltatime
  const deltaTime = clock.getElapsedTime();

  // Update the orbit controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Call this function again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
