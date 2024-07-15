import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import courtImage from "./assets/court5.jpg";
import grassImage from "./assets/grasslight-small.jpg";

// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});

// 방향키로 피카츄 움직일 때, 화면 움직이는 문제 방지
renderer.setSize(window.innerWidth*0.98, window.innerHeight*0.98);
document.body.appendChild(renderer.domElement);

// 렌더러에 그림자 사용 설정
renderer.shadowMap.enabled = true;

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 10, 0);
directionalLight.castShadow = true;

// 맵 전체에 대한 빛으로 설정
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
// 그림자 맵의 영역을 설정합니다.
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;
directionalLight.castShadow = true;
scene.add(directionalLight);

camera.position.set(13, 7, 0);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

// 하늘 생성
const skyGeometry = new THREE.SphereGeometry(1000, 0, 0); // 전체를 덮을 큰 구
const skyMaterial = new THREE.MeshBasicMaterial({
  color: 0x87ceeb,
  side: THREE.BackSide, // 구를 내부로 향하도록 설정하여 안으로 빛이 들어갈 수 있도록
});
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// stadium

// court
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(courtImage);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1);

const stadiumGroup = new THREE.Group();
scene.add(stadiumGroup);

const courtWidth = 9;
const courtHeight = 18;
const courtGeometry = new THREE.PlaneGeometry(courtWidth, courtHeight);
const courtMaterial = new THREE.MeshStandardMaterial({
  map: texture,
});
const court = new THREE.Mesh(courtGeometry, courtMaterial);
court.rotation.x = -Math.PI / 2;
court.position.set(0, 0, 0);
court.receiveShadow = true;
stadiumGroup.add(court);

// net
const netHeight = 2.43;
const poleHeight = netHeight + 1;
const netWidth = courtWidth;

const netMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const netGroup = new THREE.Group();

const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, poleHeight);
const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const pole1 = new THREE.Mesh(poleGeometry, poleMaterial);
const pole2 = new THREE.Mesh(poleGeometry, poleMaterial);
pole1.position.set(-netWidth / 2, poleHeight / 2, 0);
pole2.position.set(netWidth / 2, poleHeight / 2, 0);
pole1.castShadow = true;
pole2.castShadow = true;
pole1.receiveShadow = true;
pole2.receiveShadow = true;
netGroup.add(pole1);
netGroup.add(pole2);

const netLines = 10;
for (let i = 0; i <= netLines; i++) {
  const y = 0.8 + i * (netHeight / netLines);
  const horizontalGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-netWidth / 2, y, 0),
    new THREE.Vector3(netWidth / 2, y, 0),
  ]);
  const horizontalLine = new THREE.Line(horizontalGeometry, netMaterial);
  netGroup.add(horizontalLine);

  const x = -netWidth / 2 + i * (netWidth / netLines);
  const verticalGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(x, 0.8, 0),
    new THREE.Vector3(x, 0.8 + netHeight, 0),
  ]);
  const verticalLine = new THREE.Line(verticalGeometry, netMaterial);
  netGroup.add(verticalLine);
}
stadiumGroup.add(netGroup);

// 경기장 가장자리 벽
const wallGeometry1 = new THREE.BoxGeometry(0.1, 15, 18);
const wallGeometry2 = new THREE.BoxGeometry(9, 15, 0.1); 
const wallGeometry3 = new THREE.BoxGeometry(9, 0.1, 18); 
const wallMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  transparent: true,
  opacity: 0,
});
const leftWall = new THREE.Mesh(wallGeometry1, wallMaterial);
leftWall.position.set(-courtWidth / 2 - 0.01, 5, 0);
const rightWall = new THREE.Mesh(wallGeometry1, wallMaterial);
rightWall.position.set(courtWidth / 2 + 0.01, 5, 0); 
const backWall = new THREE.Mesh(wallGeometry2, wallMaterial);
backWall.position.set(0, 5, -courtHeight / 2 - 0.01);
const frontWall = new THREE.Mesh(wallGeometry2, wallMaterial);
frontWall.position.set(0, 5, courtHeight / 2 + 0.01); 
stadiumGroup.add(leftWall);
stadiumGroup.add(rightWall);
stadiumGroup.add(backWall);
stadiumGroup.add(frontWall);

// 경기장을 제외한 바닥 생성
const groundTexture = textureLoader.load(grassImage);
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(100, 100); // 텍스처가 100x100으로 반복되도록 설정

const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const groundGeometry = new THREE.PlaneGeometry(
  window.innerWidth,
  window.innerHeight
); // 더 큰 바닥 평면 생성
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01; // 바닥이 바닥면과 겹치지 않도록 설정
ground.receiveShadow = true;
scene.add(ground);

// 나무 생성 함수
function createTree(x, z) {
  // 나무 줄기 생성
  const trunkGeometry = new THREE.CylinderGeometry(1, 1, 10, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 5, z);
  trunk.castShadow = true;
  scene.add(trunk);

  // 나무 잎 생성
  const leavesGeometry = new THREE.SphereGeometry(5, 8, 8);
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(x, 14, z);
  leaves.castShadow = true;
  scene.add(leaves);
}

const treeSpacing = 20;
const halfMapSize = 500 / 2;

// 경기장 주변에 나무 배치
for (let x = -halfMapSize; x <= halfMapSize; x += treeSpacing) {
  for (let z = -halfMapSize; z <= halfMapSize; z += treeSpacing) {
    createTree(x, z);
  }
}

const gltfLoader = new GLTFLoader();
const pikachuModelPath = "pikachu/scene.gltf";
const pokemonBallModelPath = "pokemon_ball/scene.gltf";

let pikachu1;
let pikachu2;
let pokemonBall;
let ballVelocity = new THREE.Vector3(0, 0, 0);
const ballGravity = new THREE.Vector3(0, -0.0008, 0);
let applyGravityFlag = false;

gltfLoader.load(
  pikachuModelPath,
  (gltf) => {
    pikachu1 = gltf.scene;
    pikachu1.position.set(0, 0, 4);
    const scaleFactor = 0.05;
    pikachu1.scale.set(scaleFactor, scaleFactor, scaleFactor);
    pikachu1.rotation.y = Math.PI;

    // 피카츄 모델의 모든 메쉬에 그림자 캐스팅 및 그림자 수신 설정
    pikachu1.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(pikachu1);
  },
  undefined,
  (error) => {
    console.error("Failed to load Pikachu model", error);
  }
);

gltfLoader.load(
  pikachuModelPath,
  (gltf) => {
    pikachu2 = gltf.scene;
    pikachu2.position.set(0, 0, -4);
    const scaleFactor = 0.05;
    pikachu2.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // 피카츄 모델의 모든 메쉬에 그림자 캐스팅 및 그림자 수신 설정
    pikachu2.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(pikachu2);
  },
  undefined,
  (error) => {
    console.error("Failed to load Pikachu model", error);
  }
);

gltfLoader.load(
  pokemonBallModelPath,
  (gltf) => {
    pokemonBall = gltf.scene;
    pokemonBall.position.set(0, 8, 4);
    const scaleFactor = 0.2;
    pokemonBall.scale.set(scaleFactor, scaleFactor, scaleFactor);
    pokemonBall.rotation.y = Math.PI / 2;

    // 포켓몬볼 모델의 모든 메쉬에 그림자 캐스팅 설정
    pokemonBall.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
      }
    });

    scene.add(pokemonBall);
  },
  undefined,
  (error) => {
    console.error("Failed to load Pokemon model", error);
  }
);

const keys = {};

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  keys[key] = true;

  if (pikachu1) {
    handlePikachuMovement(pikachu1, "r", "d", "f", "g", "z");
  }
  if (pikachu2) {
    handlePikachuMovement(
      pikachu2,
      "arrowup",
      "arrowleft",
      "arrowdown",
      "arrowright",
      ","
    );
  }

  switch (key) {
    case "shift":
      resetPositions();
      break;
    case "enter":
      applyGravityFlag = true;
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  delete keys[key];
});

function handlePikachuMovement(
  pikachu,
  upKey,
  leftKey,
  downKey,
  rightKey,
  jumpKey
) {
  const pikachuSpeed = 0.4;
  const jumpSpeed = 0.2;

  if (keys[upKey] && pikachu.position.x > -courtWidth / 2 + 0.5) {
    pikachu.position.x -= pikachuSpeed;
  }
  if (keys[downKey] && pikachu.position.x < courtWidth / 2 - 0.5) {
    pikachu.position.x += pikachuSpeed;
  }
  if (
    keys[leftKey] &&
    pikachu.position.z < courtHeight / 2 - 0.5 &&
    !(pikachu === pikachu2 && pikachu.position.z >= -1)
  ) {
    // 피카츄2가 +z쪽에 위치하므로, 피카츄2가 네트를 넘어가지 않도록 함
    pikachu.position.z += pikachuSpeed;
  }
  if (
    keys[rightKey] &&
    pikachu.position.z > -courtHeight / 2 + 0.5 &&
    !(pikachu === pikachu1 && pikachu.position.z <= 1)
  ) {
    // 피카츄1이 -z쪽에 위치하므로, 피카츄1이 네트를 넘어가지 않도록 함
    pikachu.position.z -= pikachuSpeed;
  }
  if (keys[jumpKey] && pikachu.position.y === 0) {
    // 피카츄가 바닥에 있을 때만 점프 가능하도록 함
    pikachuJump(pikachu, jumpSpeed);
  }
}

function pikachuJump(pikachu, jumpSpeed) {
  const initialY = pikachu.position.y;
  let velocity = jumpSpeed;
  const gravity = 0.01;

  function jump() {
    pikachu.position.y += velocity;
    velocity -= gravity;

    if (pikachu.position.y <= initialY) {
      pikachu.position.y = initialY;
    } else {
      requestAnimationFrame(jump);
    }
  }

  jump();
}

function resetPositions() {
  if (pikachu1) pikachu1.position.set(0, 0, 4);
  if (pikachu2) pikachu2.position.set(0, 0, -4);
  if (pokemonBall) {
    pokemonBall.position.set(0, 8, 4);
    ballVelocity.set(0, 0, 0);
    applyGravityFlag = false;
  }
}

function applyGravity(object) {
  if (applyGravityFlag) {
    ballVelocity.add(ballGravity);
    object.position.add(ballVelocity);
    checkCollisionWithPikachu(object);
    checkCollisionWithNetAndWalls(object);
  }

  if (object.position.y <= 0.7) {
    object.position.y = 0.7;
    ballVelocity.set(0, 0, 0);
    applyGravityFlag = false;
  }
}

function checkCollisionWithPikachu(ball) {
  const ballBox = new THREE.Box3().setFromObject(ball);
  if (pikachu1) {
    const pikachu1Box = new THREE.Box3().setFromObject(pikachu1);
    if (ballBox.intersectsBox(pikachu1Box)) {
      handleBounce(ball, pikachu1);
    }
  }
  if (pikachu2) {
    const pikachu2Box = new THREE.Box3().setFromObject(pikachu2);
    if (ballBox.intersectsBox(pikachu2Box)) {
      handleBounce(ball, pikachu2);
    }
  }
}

function checkCollisionWithNetAndWalls(ball) {
  const ballBox = new THREE.Box3().setFromObject(ball);

  // 네트와의 충돌 감지
  const netBox = new THREE.Box3().setFromObject(netGroup);
  if (ballBox.intersectsBox(netBox)) {
    handleBounce(ball, netGroup);
    return;
  }

  // 경기장 가장자리 (보이지 않는)벽과의 충돌 감지
  const walls = [leftWall, rightWall, backWall, frontWall];
  walls.forEach((wall) => {
    const wallBox = new THREE.Box3().setFromObject(wall);
    if (ballBox.intersectsBox(wallBox)) {
      handleBounce(ball, wall);
      return;
    }
  });
}

function handleBounce(ball, object) {

  const direction = new THREE.Vector3()
    .subVectors(ball.position, object.position)
    .normalize();
  const speed = ballVelocity.length(); // 충돌 전 속도

  const newVelocity = direction.multiplyScalar(speed); 
  ballVelocity.copy(newVelocity);

}

function animate() {
  requestAnimationFrame(animate);
  if (pokemonBall) {
    applyGravity(pokemonBall);
  }
  renderer.render(scene, camera);
}

animate();
