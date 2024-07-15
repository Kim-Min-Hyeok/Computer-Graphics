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
cube.position.set(10, 5, -10); // Arbitrary position for the cube
scene.add(cube);

// Initial Camera Position
camera.position.z = 5;

const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(50,50);
scene.add(gridHelper);

// Control Variables
let isInteracting = false;
let lastMouseX = 0;
let lastMouseY = 0;
let mode = ''; // Control mode
// Initialize at (0,0,0). Then put camera's position. 
//Then get normalized direction vector(==1) of camera viewpoint. Then multiply by 5.

let orbitPoint = new THREE.Vector3().copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(5));
// Add event listeners
renderer.domElement.addEventListener('mousedown', function(event) {
    if (event.altKey) {
        isInteracting = true;
        lastMouseX = event.clientX;        lastMouseY = event.clientY;
        switch (event.button) {
            case 0: // Left Mouse Button
                mode = 'tumble';
                break;
            case 1: // Middle Mouse Button
                mode = 'track';
                break;
           default:
                break;
        }
    }
});
renderer.domElement.addEventListener('mouseup', function(event) {
    isInteracting = false;
});
renderer.domElement.addEventListener('mousemove', function(event) {
    if (!isInteracting) return;

    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    if (mode === 'tumble') {
       let angleX = deltaX * 0.001;
       let angleY = deltaY * 0.001;

       //Euler rotation implementation
       // Create a rotation matrix from Euler angles
       let euler = new THREE.Euler(-angleY, -angleX, 0, 'YXZ'); 
       let rotationMatrix = new THREE.Matrix4();
       rotationMatrix.makeRotationFromEuler(euler);
        // Compute the vector from the orbit point to the current camera position
        let vector = new THREE.Vector3().subVectors(camera.position, orbitPoint);
        vector.applyMatrix4(rotationMatrix); // Apply the rotation

        // Update the camera position by adding the rotated vector back to the orbit point
        camera.position.copy(vector.add(orbitPoint));
        // Forces the camera to look at the orbit point, maintaining focus
        camera.lookAt(orbitPoint);
    }     

    else if (mode === 'track') {
        // Get camera's current orientation. 
        // Then calculate the right and up direction relative to camera's viewpoint.
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0).multiplyScalar(-deltaX * 0.01);
        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1).multiplyScalar(deltaY * 0.01);
       camera.position.add(right).add(up);
       orbitPoint.add(right).add(up);
    }
});
renderer.domElement.addEventListener('wheel', function(event) {
    event.preventDefault();
    // Mode is not necessary here since we're directly affecting the camera's zoom
    const delta = event.deltaY * -0.01;

    // Moves the camera along its local Z-axis 
    camera.translateZ(delta);
    camera.lookAt(orbitPoint);
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();