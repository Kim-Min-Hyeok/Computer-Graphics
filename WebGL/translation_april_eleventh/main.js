import * as THREE from "three";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

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
