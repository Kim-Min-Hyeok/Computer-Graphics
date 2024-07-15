import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

// d
const camera = new THREE.PerspectiveCamera(
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// a
const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// b
const coneGeometry = new THREE.ConeGeometry(2, 2, 32);
const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.rotation.x = Math.PI;
cone.position.set(5, 0, 0);
scene.add(cone);

// c
const boxGeometry = new THREE.BoxGeometry(2, 3, 4);
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 5, 0);
scene.add(box);

// e
const ambientLight = new THREE.AmbientLight(0xff0000, 2);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(2.5, 2.5, 5);
scene.add(spotLight);

// f
const colorSequences = {
  sphere: [0xff0000, 0x00ff00, 0x0000ff],
  cone: [0x00ff00, 0x0000ff, 0xff0000],
  box: [0x0000ff, 0xff0000, 0x00ff00],
};

let currentColors = {
  sphere: 0,
  cone: 0,
  box: 0,
};

document.addEventListener("click", (event) => {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const intersected = intersects[0].object;

    switch (intersected) {
      case sphere:
        currentColors.sphere =
          (currentColors.sphere + 1) % colorSequences.sphere.length;
        intersected.material.color.setHex(
          colorSequences.sphere[currentColors.sphere]
        );
        break;
      case cone:
        currentColors.cone =
          (currentColors.cone + 1) % colorSequences.cone.length;
        intersected.material.color.setHex(
          colorSequences.cone[currentColors.cone]
        );
        break;
      case box:
        currentColors.box = (currentColors.box + 1) % colorSequences.box.length;
        intersected.material.color.setHex(
          colorSequences.box[currentColors.box]
        );
        break;
      default:
        break;
    }
  }
});

// g
ambientLight.visible = true;
spotLight.visible = true;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "a":
      ambientLight.visible = !ambientLight.visible;
      break;
    case "s":
      spotLight.visible = !spotLight.visible;
      break;
    default:
      break;
  }
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
