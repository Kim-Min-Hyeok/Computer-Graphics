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

console.log("MyCube", cube) // f12 눌렀을 때 로그 출력

const axesHelper = new THREE.AxesHelper(5); // 굵기 조정
scene.add(axesHelper)

const gridHelper = new THREE.GridHelper(10, 10); // 넓이
scene.add(gridHelper)

// Initial Camera Position
camera.position.z = 5;

// Variables for Camera Tracking
let isTracking = false;
let lastMouseX = 0;
let lastMouseY = 0;

// camera 가 default로 origin을 바라보지 않는 경우(three.js 인 경우 불필요하긴 함)/object 가 origin이 아닐 때
cube.position.x = 2
cube.position.y = 2
camera.lookAt(cube.position)

renderer.domElement.addEventListener('mousedown', function(event) {
    if (event.altKey && event.button === 0) { // Alt key + Middle Mouse Button (왼마우스:0, 중간마우스:1, 오른마우스:2)
        isTracking = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

document.addEventListener('mouseup', function(event) {
    isTracking = false;
});

renderer.domElement.addEventListener('mousemove', function(event) {
    if (isTracking) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;

        // Pass delta values to the updateCamera function
        updateCamera(deltaX, deltaY);
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

function updateCamera(deltaX, deltaY) {
    // Adjust camera position based on the deltas
    camera.position.x -= deltaX * 0.01;
    camera.position.y += deltaY * 0.01;

    // Ensure the camera's new position is used in the next render
    camera.updateProjectionMatrix();
}

// Event Listener for Resetting Camera Position
document.addEventListener('keydown', function(event) {
    if (event.key === 'r') {
        resetCamera();
    }
});

function resetCamera() {
    camera.position.set(0, 0, 5);
    camera.lookAt(cube.position);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
