import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a light
const light = new THREE.PointLight(0xFFFFFF);
light.position.set(10, 10, 10);
scene.add(light);

// Load the UV mapping texture
const textureLoader = new THREE.TextureLoader();
const uvTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/uv_grid_opengl.jpg');

// Texture properties setup
// Set the wrapping mode for the texture's S (U) coordinate to RepeatWrapping
uvTexture.wrapS = THREE.RepeatWrapping;

// Set the wrapping mode for the texture's T (V) coordinate to RepeatWrapping
uvTexture.wrapT = THREE.RepeatWrapping;

// Set the number of times the texture is repeated across the surface in the U and V directions
uvTexture.repeat.set(2, 2);

// Set the offset of the texture in the U and V directions
uvTexture.offset.set(0.5, 0.5);

// Rotate the texture by 45 degrees (PI / 4 radians)
uvTexture.rotation = Math.PI / 4;

// Set the point around which the texture rotation occurs to the center of the texture
uvTexture.center.set(0.5, 0.5);

// Set the magnification filter to NearestFilter, which gives a pixelated look when zoomed in
uvTexture.magFilter = THREE.NearestFilter;

// Set the minification filter to LinearMipMapLinearFilter, which provides smooth transitions at different levels of detail
//uvTexture.minFilter = THREE.LinearMipMapLinearFilter;

// Create a cube with UV mapping
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ map: uvTexture });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -3;
scene.add(cube);

// Create a sphere with UV mapping
const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ map: uvTexture });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 3;
scene.add(sphere);

// Add OrbitControls for user interaction
const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    renderer.render(scene, camera);
}

animate();