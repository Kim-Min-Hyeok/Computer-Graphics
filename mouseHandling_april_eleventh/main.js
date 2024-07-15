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

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial();

// Set colors in an array
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
let colorIndex = 0;
material.color.set(colors[colorIndex]);

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

function changeColor() {
  colorIndex = (colorIndex + 1) % colors.length;
  cube.material.color.set(colors[colorIndex]);
}

// Switch to next color by mouse click
document.addEventListener("click", () => {
  changeColor();
});

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "w":
      cube.position.y += 0.1;
      break;
    case "s":
      cube.position.y -= 0.1;
      break;
    case "a":
      cube.position.x -= 0.1;
      break;
    case "d":
      cube.position.x += 0.1;
      break;
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();