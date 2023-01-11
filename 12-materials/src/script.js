import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { Vector2 } from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x315b39);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

// Materials
// const basicMaterial = new THREE.MeshBasicMaterial({
//   map: doorColorTexture,
//   color: new THREE.Color(0xfad02c),
//   wireframe: false,
//   transparent: true,
//   opacity: 0.95,
//   alphaMap: doorAlphaTexture,
//   side: THREE.FrontSide,
// });

// const normalMaterial = new THREE.MeshNormalMaterial({
//   flatShading: true,
// });

// const matcapMaterial = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture,
// });

// const depthMaterial = new THREE.MeshDepthMaterial();

// const lambertMaterial = new THREE.MeshLambertMaterial();

// const phongMaterial = new THREE.MeshPhongMaterial({
//   shininess: 100,
//   specular: new THREE.Color(0x1188ff),
// });

// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;

// const toonMaterial = new THREE.MeshToonMaterial({
//   gradientMap: gradientTexture,
// });

const material = new THREE.MeshStandardMaterial({
  roughness: 0.05,
  // roughnessMap: doorRoughnessTexture,
  metalness: 0.95,
  // metalnessMap: doorMetalnessTexture,
  // normalMap: doorNormalTexture,
  //map: doorColorTexture,
  // aoMap: doorAmbientOcclusionTexture,
  // aoMapIntensity: 1,
  // displacementMap: doorHeightTexture,
  // displacementScale: 0.05,
  // normalScale: new Vector2(0.5, 0.5),
  // transparent: true,
  // alphaMap: doorAlphaTexture,
  envMap: environmentMapTexture,
});

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

scene.add(sphere, plane, torus);

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

// Camera
const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);
camera.position.z = 3;
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

// Debug Panel
const gui = new dat.GUI();
gui.add(material, "metalness").min(0).max(1).step(0.01);
gui.add(material, "roughness").min(0).max(1).step(0.01);
gui.close();

// Animations
const tick = () => {
  // Calculate deltatime
  const deltaTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * deltaTime;
  plane.rotation.y = 0.1 * deltaTime;
  torus.rotation.y = 0.1 * deltaTime;

  sphere.rotation.x = 0.15 * deltaTime;
  plane.rotation.x = 0.15 * deltaTime;
  torus.rotation.x = 0.15 * deltaTime;

  // Update the orbit controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Call this function again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
