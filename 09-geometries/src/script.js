import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x315b39);

// Object
// const geometry = new THREE.SphereGeometry(1, 12, 12);

// Describe the positions for the custom geometry
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);
for (let vertex = 0; vertex < count * 3 * 3; vertex++) {
  positionsArray[vertex] = (Math.random() - 0.5) * 4;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

// Create the custom geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0x71a5e3),
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// mesh.position.set(0.75, 0.25, 0.5);
mesh.scale.set(1, 2, 1);
// Math.PI will rotate 180deg, so that times 0.25 will do 1/8th of a complete rotation
// mesh.rotation.y = Math.PI * 0.25;

// Group
const group = new THREE.Group();
group.add(mesh);
scene.add(group);
group.scale.y = 0.5;

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
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 100);
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
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
// let time = Date.now();
const clock = new THREE.Clock();

// gsap.to(camera.position, { duration: 1, delay: 0, z: 3.5 });

// Control the camera with the mouse
const cursorPosition = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  cursorPosition.x = event.clientX / sizes.width - 0.5;
  cursorPosition.y = -(event.clientY / sizes.height - 0.5);
});

// Animations
const tick = () => {
  // Calculate deltatime
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;
  const deltaTime = clock.getElapsedTime();

  // Update the objects using deltatime
  // mesh.rotation.y = 0.5 * deltaTime;
  // mesh.position.x = Math.cos(1 * deltaTime);
  // mesh.position.y = Math.sin(1 * deltaTime);

  // Animating a spinning camera using deltatime
  // camera.position.x = Math.cos(deltaTime);
  // camera.position.y = Math.sin(deltaTime);

  // Moving the camera with the mouse
  // camera.position.set(cursorPosition.x * 4, cursorPosition.y * 4);

  // Full rotation on the x axis
  // camera.position.x = Math.sin(cursorPosition.x * Math.PI * 2) * 2;
  // camera.position.z = Math.cos(cursorPosition.x * Math.PI * 2) * 2;
  // camera.position.y = cursorPosition.y * 3;

  // Update the orbit controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Call this function again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
