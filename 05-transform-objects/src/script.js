import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x315b39);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0x71a5e3),
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

mesh.position.set(0.75, 0.25, 0.5);
mesh.scale.set(1, 2, 1);
// Math.PI will rotate 180deg, so that times 0.25 will do 1/8th of a complete rotation
mesh.rotation.y = Math.PI * 0.25;

// Group
const group = new THREE.Group();
group.add(mesh);
scene.add(group);
group.scale.y = 0.5;

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// lookAt points towards another object without having to do math
camera.lookAt(mesh.position);
scene.add(camera);

// Axes Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
