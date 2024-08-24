import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

// Initialize scene, camera, and renderer
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Configure tone mapping and color space for realistic rendering
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// Create a group to hold Earth and its components
const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180; // Earth's axial tilt
scene.add(earthGroup);

// Enable user interaction through orbit controls
new OrbitControls(camera, renderer.domElement);

// Load and apply textures for Earth's surface
const loader = new THREE.TextureLoader();
const detail = 12; // Level of detail for the icosahedron geometry
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"), // Earth surface texture
  specularMap: loader.load("./textures/02_earthspec1k.jpg"), // Specular highlights
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"), // Bump map for terrain
  bumpScale: 0.04,
});

// Create Earth mesh and add it to the Earth group
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

// Load and apply texture for Earth's city lights
const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"), // City lights texture
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

// Load and apply textures for Earth's clouds
const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"), // Cloud texture
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"), // Cloud transparency map
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003); // Slightly larger scale for clouds
earthGroup.add(cloudsMesh);

// Create a glow effect around Earth using a Fresnel material
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01); // Slightly larger scale for the glow
earthGroup.add(glowMesh);

// Create and add a starfield background
const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

// Add a directional light to simulate sunlight
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5); // Position light to simulate sunlight
scene.add(sunLight);

// Animation loop to render and animate the scene
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth and its components
  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

animate();

// Adjust camera and renderer on window resize
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
