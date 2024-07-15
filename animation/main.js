import * as THREE from 'three';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera position
camera.position.z = 20;

// Cube Setup
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Sphere Setup -> sphere는 도는게 잘 안보여서 cube로 바꿈
const sphereGeometry = new THREE.BoxGeometry();
const sphereMaterial = new THREE.MeshNormalMaterial()
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere)

// Define points array 
const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
];

let currentSegment = 0;
const speed = 0.25;

function cube_animation() {
    // Move cube along a piece of the path
    if (cube.position.distanceTo(points[currentSegment]) < 0.25) {
        currentSegment = (currentSegment + 1) % points.length;
    }
    
    //set the targetPotision to move
    const targetPosition = points[currentSegment];
    //calculate the direction vector by subtract targetPosition vector
    //and cube position vector and normalize it.
    const direction = new THREE.Vector3().subVectors(targetPosition, cube.position).normalize();
  
    //move the cube with direction and speed.
    cube.position.addScaledVector(direction, speed);

    // Rotate the cube to face the direction of movement
    cube.lookAt(targetPosition);
}

function sphere_animation() {
    sphere.rotation.x += speed*Math.PI/10
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    cube_animation();
    sphere_animation();
    renderer.render(scene, camera);
}

// Start animation
animate();