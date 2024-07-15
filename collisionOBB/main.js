import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';

let scene, camera, renderer;
let cube1, cube2, plane;
let obb1, obb2;
let moveSpeed = 0.1;
let keys = {};

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

// Create two cubes
const geometry = new THREE.BoxGeometry();
const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });

cube1 = new THREE.Mesh(geometry, material1);
cube2 = new THREE.Mesh(geometry, material2);

cube1.position.set(-2, 0.5, 0);
cube2.position.set(2, 0.5, 0);

scene.add(cube1);
scene.add(cube2);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Create OBBs
obb1 = new OBB().fromBox3(new THREE.Box3().setFromObject(cube1));
obb2 = new OBB().fromBox3(new THREE.Box3().setFromObject(cube2));

// Event listeners for keyboard input
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

function animate() {
    requestAnimationFrame(animate);

    // Move cube1 with WASD keys
    if (keys['w']) cube1.position.z -= moveSpeed;
    if (keys['s']) cube1.position.z += moveSpeed;
    if (keys['a']) cube1.position.x -= moveSpeed;
    if (keys['d']) cube1.position.x += moveSpeed;

    // Update OBB positions and orientations
    obb1.copy(new OBB().fromBox3(new THREE.Box3().setFromObject(cube1)));
    obb2.copy(new OBB().fromBox3(new THREE.Box3().setFromObject(cube2)));

    // Detect collision
    const collision = obb1.intersectsOBB(obb2);
    if (collision) {
        cube1.material.color.set(0xffff00);
        cube2.material.color.set(0xffff00);
    } else {
        cube1.material.color.set(0x00ff00);
        cube2.material.color.set(0xff0000);
    }

    renderer.render(scene, camera);
}

animate();