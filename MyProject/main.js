
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0xD3D3D3);

const boxGeometry = new THREE.BoxGeometry();
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); 
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);

const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffd733, metalness: 1, roughness: 0.5 }); 
const torusMaterial = new THREE.MeshPhongMaterial({ color: 0x0088ff });

// Meshes
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); 
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

sphere.position.x = 2; 
torus.position.x = -2;

scene.add(cube); scene.add(sphere); scene.add(torus);
const amblight = new THREE.AmbientLight(0x404040, 20); 
scene.add(amblight);
const pointLight = new THREE.PointLight(0xffffff, 50, 100); 
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);

function animate() { 
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01; 
  cube.rotation.y += 0.01; 
  sphere.rotation.x -= 0.01; 
  sphere.rotation.y -= 0.02; 
  torus.rotation.x += 0.03; 
  torus.rotation.y += 0.02; 
  renderer.render(scene, camera);
} animate();

