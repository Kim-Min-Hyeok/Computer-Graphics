import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // 배경 흰색으로 변경

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 몸체 박스
const boxGeometry = new THREE.BoxGeometry(1, 1.5, 1);
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x121256 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// 몸체 원통
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5);
const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xc0281b});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(0, -0.3, 1.25); //빨: x, 초: y, 파: z
const cylinderEulerRotation = new THREE.Euler(Math.PI / 2, 0 , 0);
cylinder.rotation.setFromVector3(cylinderEulerRotation)
scene.add(cylinder)

// 몸체 굴뚝
const coneGeometry = new THREE.ConeGeometry(0.25, 0.5);
const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x000000});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(0, 0.2, 1.5)

const coneEulerRotation = new THREE.Euler(Math.PI, 0, 0);
cone.rotation.setFromVector3(coneEulerRotation);

scene.add(cone);

// 몸체 지붕
const sphereGeomety = new THREE.SphereGeometry(0.25, 36, 36, 0, Math.PI /2);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xb6d7e4});
const sphere = new THREE.Mesh(sphereGeomety, sphereMaterial);
sphere.position.set(0, 0.3, 0.5)

const sphereEulerRotation = new THREE.Euler(0, 0, -Math.PI / 2);
sphere.rotation.setFromVector3(sphereEulerRotation);

scene.add(sphere)

// 바퀴
const wheelGeometry = new THREE.TorusGeometry(0.15, 0.075, 32, 32);
const bigWheelGeometry = new THREE.TorusGeometry(0.3, 0.15, 32, 32);

const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x6e6e6e });

const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const bigWheel1 = new THREE.Mesh(bigWheelGeometry, wheelMaterial);
const bigWheel2 = new THREE.Mesh(bigWheelGeometry, wheelMaterial);

wheel1.position.set(-0.5, -0.55, 1.3);
wheel2.position.set(0.5, -0.55, 1.3);
wheel3.position.set(-0.5, -0.55, 1.8);
wheel4.position.set(0.5, -0.55, 1.8);
bigWheel1.position.set(-0.6, -0.35, 0);
bigWheel2.position.set(0.6, -0.35, 0);

const wheelEulerRotation = new THREE.Euler(0, Math.PI / 2, 0);
wheel1.rotation.setFromVector3(wheelEulerRotation);
wheel2.rotation.setFromVector3(wheelEulerRotation);
wheel3.rotation.setFromVector3(wheelEulerRotation);
wheel4.rotation.setFromVector3(wheelEulerRotation);
bigWheel1.rotation.setFromVector3(wheelEulerRotation);
bigWheel2.rotation.setFromVector3(wheelEulerRotation);

scene.add(wheel1);
scene.add(wheel2);
scene.add(wheel3);
scene.add(wheel4);
scene.add(bigWheel1);
scene.add(bigWheel2);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 3); // 밝기 조절
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
