import * as THREE from 'three';

let scene, camera, renderer;
let box, sphere, point;
let moveSpeed = 0.1;
let keys = {};

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a box
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-3, 1, 0);
scene.add(box);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(3, 1, 0);
scene.add(sphere);
    
// Create a point (small sphere)
const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
point = new THREE.Mesh(pointGeometry, pointMaterial);
point.position.set(0, 1, 0);
scene.add(point);

camera.position.set(0, 5, 10);
camera.lookAt(0, 1, 0);

// Event listeners for keyboard input
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);


function animate() {
    requestAnimationFrame(animate);

    // Move the point with arrow keys
    if (keys['ArrowUp']) point.position.z -= moveSpeed;
    if (keys['ArrowDown']) point.position.z += moveSpeed;
    if (keys['ArrowLeft']) point.position.x -= moveSpeed;
    if (keys['ArrowRight']) point.position.x += moveSpeed;

    // Detect collision between the point and the objects
    detectCollision();

    renderer.render(scene, camera);
}

function detectCollision() {
    const pointVector = new THREE.Vector3().copy(point.position);

    // Box collision detection
    const box3 = new THREE.Box3().setFromObject(box);
    if (box3.containsPoint(pointVector)) {
        box.material.color.set(0xffff00); // Change color on collision
    } else {
        box.material.color.set(0x00ff00); // Reset color when no collision
    }

    // Sphere collision detection
    const sphereBoundingSphere = new THREE.Sphere(sphere.position, 1);
    if (sphereBoundingSphere.containsPoint(pointVector)) {
        sphere.material.color.set(0xffff00); // Change color on collision
    } else {
        sphere.material.color.set(0xff0000); // Reset color when no collision
    }
}

animate();
