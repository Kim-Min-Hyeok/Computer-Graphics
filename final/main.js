import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 8;
camera.position.y = 8;
camera.lookAt(0, 0, 0);

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// Axis|Grid helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

// Light sources
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff00ff, 0.5);
directionalLight.position.set(0, 10, 0);
// directionalLight.name = 'directional'
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff0000, 1000, 100);
pointLight.position.set(4, 0, 0);
pointLight.name = "point";
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0x0000ff, 100);
spotLight.position.set(0, 3, 3);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.1;
spotLight.name = "spot";
scene.add(spotLight);

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2; // Rotate the plane to be horizontal
scene.add(plane);

// 도형들
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

let boxGeometry = new THREE.BoxGeometry(1, 1, 1);
let box = new THREE.Mesh(boxGeometry, phongMaterial);
scene.add(box);

let sphereGeometry = new THREE.SphereGeometry(0.5); // radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float
let sphere = new THREE.Mesh(sphereGeometry, phongMaterial);
sphere.position.x = 2;
scene.add(sphere);

let coneGeometry = new THREE.ConeGeometry(0.5, 1); // radius : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float
let cone = new THREE.Mesh(coneGeometry, phongMaterial);
cone.position.x = 4;
scene.add(cone);

let cylinderGeometry = new THREE.CylinderGeometry(0.7, 0.3, 1); // radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float
let cylinder = new THREE.Mesh(cylinderGeometry, phongMaterial);
cylinder.position.x = 6;
scene.add(cylinder);

let torusGeometry = new THREE.TorusGeometry(0.4, 0.1);
let torus = new THREE.Mesh(torusGeometry, phongMaterial);
torus.position.x = 8;
scene.add(torus);

// materials
function basicMaterial2() {
  const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  box.material = basicMaterial;
}

function normalMaterial() {
  const normalMaterial = new THREE.MeshNormalMaterial();
  box.material = normalMaterial;
}

function wireFrame() {
  box.material.wireframe = !box.material.wireframe;
}

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
let colorIndex = 0;
function changeColor() {
  colorIndex = (colorIndex + 1) % colors.length;
  box.material.color.set(colors[colorIndex]);
}

// group
const group = new THREE.Group();
group.add(box);
group.add(cone);
scene.add(group);

// scale
box.scale.set(1, 2, 1);

// rotate
const eulerRotation = new THREE.Euler(Math.PI / 4, Math.PI / 4, 0);
box.rotation.setFromVector3(eulerRotation);

// Keyboard
document.addEventListener("keydown", (event) => {
  switch (
    event.key // "arrowup", "arrowleft", "arrowdown", "arrowright"
  ) {
    case "1":
      basicMaterial2();
      break;
    case "2":
      normalMaterial();
      break;
    case "3":
      wireFrame();
      break;
  }
});

// Mouse
document.addEventListener("click", (event) => {
  changeColor();
});

// OrbitController
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

// animation
let currentSegment = 0;
const speed = 0.1;

const points = [
  new THREE.Vector3(-5, 0, 0),
  new THREE.Vector3(0, 5, 0),
  new THREE.Vector3(5, 0, 0),
];

function animation() {
  const targetPosition = points[currentSegment];
  const direction = new THREE.Vector3()
    .subVectors(targetPosition, box.position)
    .normalize();
  box.position.addScaledVector(direction, speed);
  group.rotation.x += 0.05;

  if (box.position.distanceTo(points[currentSegment]) < 0.25) {
    currentSegment = (currentSegment + 1) % points.length;
  }
}

function animate() {
  requestAnimationFrame(animate);
  animation();
  controls.update();
  renderer.render(scene, camera);
}

animate();
