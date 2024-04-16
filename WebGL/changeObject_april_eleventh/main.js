import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the Initial primitive object
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
camera.position.z = 5;

// Function to change the geometry of mesh
function cubeMesh() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  mesh.geometry = cubeGeometry;
}
function sphereMesh() {
  const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
  mesh.geometry = sphereGeometry;
}
function cylinderMesh() {
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32);
  mesh.geometry = cylinderGeometry;
}
function torusMesh() {
  const torusGeometry = new THREE.TorusGeometry(1, 0.33, 16, 100);
  mesh.geometry = torusGeometry;
}

// Function to change the material of mesh
function basicMaterial() {
  const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  mesh.material = basicMaterial;
}
function normalMaterial() {
  const normalMaterial = new THREE.MeshNormalMaterial(); // material that shows the normal information of the mesh
  mesh.material = normalMaterial;
}
function wireFrame() {
  mesh.material.wireframe = !mesh.material.wireframe; // Option to make only the mesh's wireframe visible
}

// Keyboard input event listener
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "1":
      cubeMesh();
      break;
    case "2":
      sphereMesh();
      break;
    case "3":
      cylinderMesh();
      break;
    case "4":
      torusMesh();
      break;
    case "n":
      normalMaterial();
      break;
    case "b":
      basicMaterial();
      break;
    case "w":
      wireFrame();
      break;
  }
});
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
