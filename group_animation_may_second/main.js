import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera position
camera.position.z = 20;

//Make a 3D box
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2;
//Make a Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 0;

//Make a cone
const coneGeometry = new THREE.ConeGeometry(1, 2, 20);
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.x = 2;

//Add them in a group
const group = new THREE.Group();
group.add(cube);
group.add(sphere);
group.add(cone);

scene.add(group);
// Define points and initial velocities
const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
];

let currentSegment = 0;
const speed = 0.05;
let cube_direction = 1; 
function group_animation() {
    // Move cube along a piece of the path
    if (group.position.distanceTo(points[currentSegment]) < 0.25) {
        currentSegment = (currentSegment + 1) % points.length;
        cube_direction *= (-1);
    }

    //set the targetPotision to move
    const targetPosition = points[currentSegment];
    //calculate the direction vector by subtract targetPosition vector     //and cube position vector and normalize it.
    const direction = new THREE.Vector3().subVectors(targetPosition, group.position).normalize();
    
    //move the group with direction and speed.
    group.position.addScaledVector(direction, speed);

    //You can also move each child separately.
    cone.rotation.x += 0.1;
    cube.rotation.z -= 0.05;
    sphere.position.z = sphere.position.z +  (0.01 * cube_direction);

    // Rotate the cube to face the direction of movement
    group.lookAt(targetPosition);
}
// Animation
function animate() {
    requestAnimationFrame(animate);
    group_animation();
    renderer.render(scene, camera);
}

// Start animation
animate();