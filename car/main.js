import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(1, 0.3, 2);
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const boxGeometry2 = new THREE.BoxGeometry(0.5, 0.3, 1);
const boxMaterial2 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const box2 = new THREE.Mesh(boxGeometry2, boxMaterial2);
box2.position.set(0, 0.3, 0);
scene.add(box2);

const wheelGeometry = new THREE.SphereGeometry(0.25, 32, 32);
const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
wheel1.position.set(-0.5, -0.25, -1);
wheel2.position.set(0.5, -0.25, -1);
wheel3.position.set(-0.5, -0.25, 1);
wheel4.position.set(0.5, -0.25, 1);

scene.add(wheel1);
scene.add(wheel2);
scene.add(wheel3);
scene.add(wheel4);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
