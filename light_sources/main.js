import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 10);
// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
// Room
const roomGeometry = new THREE.BoxGeometry(15, 15, 15);
const roomMaterial = new THREE.MeshPhongMaterial({
  color: 0xa0adaf,
  side: THREE.BackSide,
});
const room = new THREE.Mesh(roomGeometry, roomMaterial);
room.position.set(0, 7.5, 0);
scene.add(room);
// Objects
const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff1f3 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(1, 1.5, 2);
scene.add(cube);
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x44f313 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1, 1, -3);
scene.add(sphere);
const coneGeometry = new THREE.ConeGeometry(1, 3, 32);
const coneMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(-3, 1.5, 4);
scene.add(cone);
// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
ambientLight.name = "ambient";
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.name = "directional";
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xff0000, 10, 100);
pointLight.position.set(-2, 3, 2);
pointLight.name = "point";
scene.add(pointLight);
const spotLight = new THREE.SpotLight(0x0000ff, 100);
spotLight.position.set(5, 5, 4);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.1;
spotLight.name = "spot";
scene.add(spotLight);
// Set initial visibility of lights
ambientLight.visible = true; // Initially, only ambient light is on
directionalLight.visible = false;
pointLight.visible = false;
spotLight.visible = false;
// Keyboard event handling to toggle lights
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "1":
      ambientLight.visible = !ambientLight.visible;
      break;
    case "2":
      directionalLight.visible = !directionalLight.visible;
      break;
    case "3":
      pointLight.visible = !pointLight.visible;
      break;
    case "4":
      spotLight.visible = !spotLight.visible;
      break;
  }
});
// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);

scene.add(spotLightHelper);
