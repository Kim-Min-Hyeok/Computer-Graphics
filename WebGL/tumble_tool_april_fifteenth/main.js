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

// Variables for Camera Control
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};
let azimuth = 0;
//or polar angle
let elevation = Math.PI / 2;  // 90 degrees, looking horizontally
let distance = 5; // Distance from the cube

renderer.domElement.addEventListener('mousedown', function(e) {
    if (e.altKey && e.button === 0) { // Alt key + Left Mouse button
        isDragging = true;
    }
});

renderer.domElement.addEventListener('mousemove', function(e) {
    if (isDragging) {
        // Implement logic here to handle mouse movement when dragging
        // Hint: Calculate the change in mouse position (deltaX and deltaY)
        // Adjust azimuth and elevation based on the deltas to rotate the camera
        // Remember to call the updateCamera() function after adjusting the angles
        // **Write your code here**
        var deltaX = e.offsetX - previousMousePosition.x;
        var deltaY = e.offsetX - previousMousePosition.y;

        azimuth -= deltaX * 0.005; // -인거 주의 
        elevation = Math.max(0.1, Math.min(Math.PI, elevation - deltaY * 0.005));
        updateCamera();
    }
    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});

document.addEventListener('mouseup', function(e) {
    isDragging = false;
});

function updateCamera() {
    // Convert azimuth and elevation angles to Cartesian coordinates for camera positioning
    // Hint: Use trigonometric functions to convert spherical to Cartesian coordinates
    // Set the camera's x, y, and z positions based on these calculations
    // Make the camera look at the center of the scene or an object
    // **Write your code here**
    camera.position.x = distance * Math.sin(elevation) * Math.sin(azimuth);
    camera.position.y = distance * Math.cos(elevation);
    camera.position.z = distance * Math.sin(elevation) * Math.cos(azimuth)
    camera.lookAt(cube.position)
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

