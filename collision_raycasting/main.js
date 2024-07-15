import * as THREE from 'three';

let scene, camera, renderer;
let plane;
let objects = [];
let raycaster, mouse;
let selectedObject = null;
let offset = new THREE.Vector3();
let intersection = new THREE.Vector3();
let collisionEnabled = false;  // Flag to enable/disable collision detection

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Create multiple objects
const geometry = new THREE.BoxGeometry(1, 1, 1);
for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(
        (Math.random() - 0.5) * 5,
        0.5,
        (Math.random() - 0.5) * 5
    );
    objects.push(box);
    scene.add(box);
}

camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

// Set up raycaster and mouse vector
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

// Add event listeners for mouse interactions
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('keydown', onKeyDown, false);  // Add keydown event listener

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onMouseDown(event) {
    event.preventDefault();

    // Update mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with objects
    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        selectedObject = intersects[0].object;

        // Calculate offset
        const planeIntersect = raycaster.intersectObject(plane);
        if (planeIntersect.length > 0) {
            offset.copy(planeIntersect[0].point).sub(selectedObject.position);
        }
    }
}

function onMouseMove(event) {
    event.preventDefault();

    // Update mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // If an object is selected, move it with the mouse
    if (selectedObject) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(plane);

        if (intersects.length > 0) {
            intersection.copy(intersects[0].point).sub(offset);
            selectedObject.position.copy(intersection);

            if (collisionEnabled) {
                for (let obj of objects) {
                    if (obj !== selectedObject && checkCollision(selectedObject, obj)) {
                        resolveCollision(selectedObject, obj);
                    }
                }
            }
        }
    }
}

function onMouseUp(event) {
    event.preventDefault();
    selectedObject = null; // Deselect the object
}

function onKeyDown(event) {
    if (event.key === '1') {
        collisionEnabled = !collisionEnabled;
        console.log(`Collision detection: ${collisionEnabled ? 'enabled' : 'disabled'}`);
    }
}

function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

function resolveCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);

    const overlapX = Math.min(box1.max.x - box2.min.x, box2.max.x - box1.min.x);
    const overlapZ = Math.min(box1.max.z - box2.min.z, box2.max.z - box1.min.z);

    if (overlapX < overlapZ) {
        if (obj1.position.x < obj2.position.x) {
            obj1.position.x -= overlapX;
        } else {
            obj1.position.x += overlapX;
        }
    } else {
        if (obj1.position.z < obj2.position.z) {
            obj1.position.z -= overlapZ;
        } else {
            obj1.position.z += overlapZ;
        }
    }
}

animate();