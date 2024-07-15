import * as THREE from 'three';

// Scene Setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube Setup
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Initial Camera Position
camera.position.z = 5;

// Variables for Camera Dolly
let distance = 5; // Initial distance from the cube

// Add mouse wheel event listener for dolly in and out
renderer.domElement.addEventListener('wheel', function(event) {
    event.preventDefault(); // Prevent the browser default of scrolling
    const delta = event.deltaY * -0.01; // Normalize wheel to +/- 1 and invert
    distance += delta;
    distance = Math.max(1, Math.min(100, distance)); // Constrain the distance
    updateCamera();
});

function updateCamera() {
    // Maintain the camera's current viewing direction but update its position
    camera.position.z = distance;
    camera.lookAt(cube.position); // Always look at the cube
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();