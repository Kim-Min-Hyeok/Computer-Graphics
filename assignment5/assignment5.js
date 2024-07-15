import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBB } from 'three/addons/math/OBB.js';

// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

function createTrain() {
  const trainGroup = new THREE.Group();
  const frontWheelGroup = new THREE.Group();
  const centerWheelGroup = new THREE.Group();
  const rearWheelGroup = new THREE.Group();
  trainGroup.add(frontWheelGroup);
  trainGroup.add(centerWheelGroup);
  trainGroup.add(rearWheelGroup);

  const rotationAngle = Math.PI / 2;

  const boxGeometry = new THREE.BoxGeometry(1, 1.5, 1);
  const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0x191970,
    shininess: 80,
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  trainGroup.add(box);

  const coneGeometry = new THREE.ConeGeometry(0.3, 0.4, 32);
  const coneMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff,
    shininess: 80,
  });
  const cone = new THREE.Mesh(coneGeometry, coneMaterial);
  cone.position.set(0, 0.3, -1.5);
  cone.rotation.set(Math.PI, 0, 0);
  trainGroup.add(cone);

  const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2);
  const cylinderMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 80,
  });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.rotation.set(Math.PI / 2, 0, 0);
  cylinder.position.set(0, -0.25, -1);
  trainGroup.add(cylinder);

  const sphereGeometry = new THREE.SphereGeometry(
    0.3,
    32,
    16,
    0,
    3.14,
    0,
    1.57
  );
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0, 0.3, -0.5);
  trainGroup.add(sphere);

  const wheelGeometry = new THREE.TorusGeometry(0.15, 0.08, 7, 9, 5.5);
  const bigWheelGeometry = new THREE.TorusGeometry(0.3, 0.15, 7, 9, 5.5);
  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    reflectivity: 0,
    shininess: 30,
  });

  // Front Wheels
  const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontWheelGroup.add(wheel1);
  frontWheelGroup.add(wheel2);
  frontWheelGroup.position.set(0, -0.5, -1.8);
  wheel1.position.set(-0.5, 0, 0);
  wheel2.position.set(0.5, 0, 0);
  wheel1.rotation.y += rotationAngle;
  wheel2.rotation.y += rotationAngle;

  // Center Wheels
  const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  centerWheelGroup.add(wheel3);
  centerWheelGroup.add(wheel4);
  centerWheelGroup.position.set(0, -0.5, -1.3);
  wheel3.position.set(-0.5, 0, 0);
  wheel4.position.set(0.5, 0, 0);
  wheel3.rotation.y += rotationAngle;
  wheel4.rotation.y += rotationAngle;

  // Rear Wheels
  const wheel5 = new THREE.Mesh(bigWheelGeometry, wheelMaterial);
  const wheel6 = new THREE.Mesh(bigWheelGeometry, wheelMaterial);
  rearWheelGroup.add(wheel5);
  rearWheelGroup.add(wheel6);
  rearWheelGroup.position.set(0, -0.5, 0.1);
  wheel5.position.set(-0.5, 0, 0);
  wheel6.position.set(0.5, 0, 0);
  wheel5.rotation.y += rotationAngle;
  wheel6.rotation.y += rotationAngle;

  return { trainGroup, box, frontWheelGroup, centerWheelGroup, rearWheelGroup };
}

// Create two trains and add to the scene
const {
  trainGroup: trainGroup1,
  box: box1,
  frontWheelGroup: frontWheelGroup1,
  centerWheelGroup: centerWheelGroup1,
  rearWheelGroup: rearWheelGroup1,
} = createTrain();
const {
  trainGroup: trainGroup2,
  box: box2,
  frontWheelGroup: frontWheelGroup2,
  centerWheelGroup: centerWheelGroup2,
  rearWheelGroup: rearWheelGroup2,
} = createTrain();

scene.add(trainGroup1);
scene.add(trainGroup2);

// Set initial positions for both trains
const trainStartX1 = -6;
const trainStartY1 = 0.8;
const trainStartZ1 = 0;

const trainStartX2 = -6;
const trainStartY2 = 0.8;
const trainStartZ2 = 2;

trainGroup1.position.set(trainStartX1, trainStartY1, trainStartZ1);
trainGroup2.position.set(trainStartX2, trainStartY2, trainStartZ2);

// Animation
const speed = 0.05;
let moving1 = true;
let moving2 = true;

function randomDirection() {
  return new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    0,
    (Math.random() - 0.5) * 2
  ).normalize();
}

let direction1 = randomDirection();
let direction2 = randomDirection();

let obb1, obb2;

function checkCollision(train1, train2) {
  obb1 = new OBB().fromBox3(new THREE.Box3().setFromObject(train1));
  obb2 = new OBB().fromBox3(new THREE.Box3().setFromObject(train2));

  // OBB 간 충돌 감지
  return obb1.intersectsOBB(obb2);
}

function handleCollision() {
  const collision = checkCollision(trainGroup1, trainGroup2);
  if (collision) {
      box1.material.color.set(0xff0000); // 빨간색으로 색상 변경
      box2.material.color.set(0xff0000); // 빨간색으로 색상 변경
  } else {
      box1.material.color.set(0x191970); // 원래 색상으로 색상 변경
      box2.material.color.set(0x191970); // 원래 색상으로 색상 변경
  }
}

function groupAnimation(
  trainGroup,
  frontWheelGroup,
  centerWheelGroup,
  rearWheelGroup,
  direction,
  moving
) {
  if (moving) {
    trainGroup.position.addScaledVector(direction, speed);

    frontWheelGroup.rotation.x -= 0.1;
    centerWheelGroup.rotation.x -= 0.1;
    rearWheelGroup.rotation.x -= 0.1;

    // Check if train is out of bounds
    if (
      Math.abs(trainGroup.position.x) > 10 ||
      Math.abs(trainGroup.position.z) > 10
    ) {
      direction.negate(); // Reverse direction
    }

    const lookAtTarget = new THREE.Vector3().subVectors(
      trainGroup.position,
      direction
    );
    trainGroup.lookAt(lookAtTarget);
  }

  return direction;
}

function onTrainClick(event) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(
    [trainGroup1, trainGroup2],
    true
  );
  if (intersects.length > 0) {
    const train = intersects[0].object.parent;
    if (train === trainGroup1) {
      moving1 = !moving1;
      if (moving1) direction1 = randomDirection();
    } else if (train === trainGroup2) {
      moving2 = !moving2;
      if (moving2) direction2 = randomDirection();
    }
  }
}

window.addEventListener("click", onTrainClick, false);

function animate() {
  requestAnimationFrame(animate);

  direction1 = groupAnimation(
    trainGroup1,
    frontWheelGroup1,
    centerWheelGroup1,
    rearWheelGroup1,
    direction1,
    moving1
  );
  direction2 = groupAnimation(
    trainGroup2,
    frontWheelGroup2,
    centerWheelGroup2,
    rearWheelGroup2,
    direction2,
    moving2
  );

  handleCollision();

  renderer.render(scene, camera);
}

animate();
