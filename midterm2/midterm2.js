import * as THREE from "three";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

const coneGeometry = new THREE.ConeGeometry(5, 5, 32);
const coneMaterial = new THREE.MeshNormalMaterial();
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(10, 0, 0);
const coneEulerRotation = new THREE.Euler(0, 0, Math.PI);
cone.rotation.setFromVector3(coneEulerRotation);
scene.add(cone);

const boxGeometry = new THREE.BoxGeometry(3, 4, 5);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 10, 0);
scene.add(box);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 3); // 밝기 조절
scene.add(ambientLight);

camera.position.set(0, 0, 8);
camera.lookAt(0, 0, 0);

let isTracking = false;
let lastMouseX = 0;
let lastMouseY = 0;

renderer.domElement.addEventListener("mousedown", function (event) {
  if (event.altKey && event.button === 1) {
    // Alt key + Middle Mouse Button (왼마우스:0, 중간마우스:1, 오른마우스:2)
    isTracking = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
});

document.addEventListener("mouseup", function (event) {
  isTracking = false;
});

renderer.domElement.addEventListener("mousemove", function (event) {
  if (isTracking) {
    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;

    // Pass delta values to the updateCamera function
    updateCamera(deltaX, deltaY);
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
});

function updateCamera(deltaX, deltaY) {
  // Adjust camera position based on the deltas
  camera.position.x -= deltaX * 0.01;
  camera.position.y += deltaY * 0.01;

  // Ensure the camera's new position is used in the next render
  camera.updateProjectionMatrix();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "r") {
    resetCamera();
  }
});

function resetCamera() {
  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

