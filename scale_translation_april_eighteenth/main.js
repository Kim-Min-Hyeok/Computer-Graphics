import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(2, 1, 0.5); // Width, height, depth
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Green color
const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scale
box.scale.set(1,2,1)
// translation
box.position.set(1,0,0)

scene.add(box);
console.log("MyBox",box)

const axesHelper = new THREE.AxesHelper(5); // Length of the axes
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10); // Size of the grid
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

function animate() {
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
}
animate();

