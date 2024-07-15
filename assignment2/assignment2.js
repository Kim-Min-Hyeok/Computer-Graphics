import * as THREE from "three";

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

// Set colors in an array
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
let colorIndex = 0;

camera.position.z = 5;

const boxGeometry = new THREE.BoxGeometry();
const sphereGeometry = new THREE.SphereGeometry();
const cylinderGeometry = new THREE.CylinderGeometry();
const torusGeometry = new THREE.TorusGeometry();

const material = new THREE.MeshBasicMaterial();
material.color.set(colors[colorIndex]);

const box = new THREE.Mesh(boxGeometry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);
const cylinder = new THREE.Mesh(cylinderGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);

function addObject(object) {
  scene.add(object);
}

function changeColor() {
  colorIndex = (colorIndex + 1) % colors.length;
  box.material.color.set(colors[colorIndex]);
}

// Switch to next color by mouse click
document.addEventListener("click", () => {
  changeColor();
});

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    // add a different 3D object depending user input
    case "1":
      addObject(box);
      break;
    case "2":
      addObject(sphere)
      break;
    case "3":
      addObject(cylinder)
      break;
    case "4":
      addObject(torus);
      break;
    // Move 3D box
    case "w":
      box.position.y += 0.1;
      break;
    case "s":
      box.position.y -= 0.1;
      break;
    case "a":
      box.position.x -= 0.1;
      break;
    case "d":
      box.position.x += 0.1;
      break;
    // Move Sphere
    case "t":
      sphere.position.y += 0.1;
      break;
    case "g":
      sphere.position.y -= 0.1;
      break;
    case "f":
      sphere.position.x -= 0.1;
      break;
    case "h":
      sphere.position.x += 0.1;
      break;
    // Move Cylinder
    case "i":
      cylinder.position.y += 0.1;
      break;
    case "k":
      cylinder.position.y -= 0.1;
      break;
    case "j":
      cylinder.position.x -= 0.1;
      break;
    case "l":
      cylinder.position.x += 0.1;
      break;
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
