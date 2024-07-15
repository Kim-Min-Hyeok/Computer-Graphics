import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 10); // Soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
// Materials
const diffuseMaterial = new THREE.MeshLambertMaterial({
emissive: 0x072534, // Emissive color, does not reflect light, self-illuminated
color: 0x156289 // Diffuse color
});
const specularMaterial = new THREE.MeshPhongMaterial({
color: 0x156289, // Diffuse color
emissive: 0x072534, // Emissive color, does not reflect light, self-illuminated
specular: 0xffffff, // Specular color
shininess: 100, // Controls the size of the specular highlights
flatShading: false, // Optional: for flat vs smooth shading
});
// Geometry
const geometry = new THREE.BoxGeometry(2, 2, 2);
const cube = new THREE.Mesh(geometry, diffuseMaterial);
scene.add(cube);
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshPhongMaterial({
color: 0x896215, // blue
emissive: 0x0000ff,
specular: 0x000000, 
shininess: 0
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-3, 0, 0);
scene.add(sphere);
const coneGeometry = new THREE.ConeGeometry(1, 3, 32);
const coneMaterial = new THREE.MeshPhongMaterial({
color: 0x891562,
emissive: 0x072534, 
specular: 0xffffff, 
shininess: 100, 
flatShading: false, 
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(3, 0, 0);
scene.add(cone);
window.addEventListener('keydown', function (event) {
    if (event.key === 'd' || event.key === 'D') {
    // Toggle to diffuse reflection
    cube.material = diffuseMaterial;
    } else if (event.key === 's' || event.key === 'S') {
    // Toggle to specular reflection
    cube.material = specularMaterial;
    } 
    });
    // Animation loop
    function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    }
    animate();
