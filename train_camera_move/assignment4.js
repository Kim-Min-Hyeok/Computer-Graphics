import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);


const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Add a directional light to see the rotation of wheel
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 2, 0)
scene.add(directionalLight);

camera.position.set(0, 5, 0);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

//Setup groups
const trainGroup = new THREE.Group();
const frontWheelGroup = new THREE.Group();
const centerWheelGroup = new THREE.Group();
const rearWheelGroup = new THREE.Group();
scene.add(trainGroup);
trainGroup.add(frontWheelGroup);
trainGroup.add(centerWheelGroup);
trainGroup.add(rearWheelGroup);

//Setup the body of train
const rotationAngle = Math.PI / 2;

const boxGeometry = new THREE.BoxGeometry(1, 1.5, 1);
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x191970, shininess: 80 }); 

// Adjust shininess
const box = new THREE.Mesh(boxGeometry, boxMaterial);
trainGroup.add(box);

const coneGeometry = new THREE.ConeGeometry(0.3, 0.4, 32);
const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff, shininess: 80 }); 

// Adjust shininess
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(0, 0.3, -1.5); 
cone.rotation.set(Math.PI,0,0)
trainGroup.add(cone);

const cylindergeometry = new THREE.CylinderGeometry( 0.5, 0.5, 2); 
const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 80 });
const cylinder = new THREE.Mesh( cylindergeometry, cylinderMaterial ); 
cylinder.rotation.set( Math.PI / 2,0,0);
cylinder.position.set(0,-0.25,-1)
trainGroup.add( cylinder );

const geometry = new THREE.SphereGeometry( 0.3, 32, 16,0,3.14,0,1.57 ); 
const material = new THREE.MeshBasicMaterial( { color:    0xADD8E6 } ); 
const sphere = new THREE.Mesh( geometry, material ); 
sphere.position.set(0,0.3,-0.5);
trainGroup.add( sphere );

//Setup the Wheels of train
const wheelGeometry = new THREE.TorusGeometry(0.15, 0.08, 7, 9, 5.5);
const bigwheel = new THREE.TorusGeometry(0.3,0.15, 7, 9, 5.5);
const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 ,reflectivity : 0, shininess: 30});

//Front Wheels
const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial); 
const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
frontWheelGroup.add(wheel1); 
frontWheelGroup.add(wheel2);
frontWheelGroup.position.set(0, -0.5, -1.8);
wheel1.position.set(-0.5, 0, 0); 
wheel2.position.set(0.5, 0, 0);
wheel1.rotation.y += rotationAngle; 
wheel2.rotation.y += rotationAngle;
//Center Wheels
const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial); 
const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
centerWheelGroup.add(wheel3); 
centerWheelGroup.add(wheel4);
centerWheelGroup.position.set(0, -0.5, -1.3);
wheel3.position.set(-0.5, 0, 0); 
wheel4.position.set(0.5, 0, 0);
wheel3.rotation.y += rotationAngle; 
wheel4.rotation.y += rotationAngle;
//Rear Wheels
const wheel5 = new THREE.Mesh(bigwheel, wheelMaterial); 
const wheel6 = new THREE.Mesh(bigwheel, wheelMaterial);
rearWheelGroup.add(wheel5); 
rearWheelGroup.add(wheel6);
rearWheelGroup.position.set(0, -0.5, 0.1);
wheel5.position.set(-0.5, 0, 0); 
wheel6.position.set(0.5, 0, 0);
wheel5.rotation.y += rotationAngle; 
wheel6.rotation.y += rotationAngle;

// 애니메이션
const trainStartX = -6;
const trainStartY = 0.8;
const trainStartZ = 0;

// sections
const points = [
  // section A
  // section B
  // section C
  new THREE.Vector3(6, 0.8, -6),
  new THREE.Vector3(6, 0.8, 6),
  new THREE.Vector3(trainStartX, trainStartY, trainStartZ),
];

trainGroup.position.set(trainStartX, trainStartY, trainStartZ);

let currentSegment = 0;
const speed = 0.05;
let cone_direction = 1;

function group_animation() {
    // Move train along a piece of the path
    if (trainGroup.position.distanceTo(points[currentSegment]) < 0.25) {
        currentSegment = (currentSegment + 1) % points.length;
        cone_direction *= (-1);
    }
    //Setting the targetPotision to move
    const targetPosition = points[currentSegment];

    //calculate the direction vector by subtract targetPosition vector
    //and cube position vector and normalize it.
    const direction = new THREE.Vector3().subVectors(targetPosition, trainGroup.position).normalize();

    //move the group with direction and speed.
    trainGroup.position.addScaledVector(direction, speed);

    //rotate the wheels
    frontWheelGroup.rotation.x -= 0.1; 
    centerWheelGroup.rotation.x -= 0.1; 
    rearWheelGroup.rotation.x -= 0.1; 

    //extra animation of cone
    cone.position.y = cone.position.y +  (0.0007 * cone_direction);
    //Setting the direction of train and camera
    const lookAtTarget = new THREE.Vector3().addVectors(trainGroup.position, direction.multiplyScalar(-1));
    trainGroup.lookAt(lookAtTarget);

    switch (currentSegment) {
          case 0: // Section A
            const cameraA = new THREE.Vector3(
              trainGroup.position.x - 2,
              trainGroup.position.y,
              trainGroup.position.z - 5
            );
            camera.position.copy(cameraA);
            camera.lookAt(trainGroup.position);
            break;
          case 1: // Section B
          case 2: // Section C
            camera.position.copy(points[1]);
            camera.lookAt(trainGroup.position);
            break;
          default:
            break;
        }
    camera.lookAt(trainGroup.position);
}
// Animation
function animate() {
    requestAnimationFrame(animate);
    group_animation();
    renderer.render(scene, camera);
}

// Start animation
animate();