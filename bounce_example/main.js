import * as THREE from "three";

// 게임에 필요한 변수들
let scene, camera, renderer, ball;
let player1Score = 0, player2Score = 0;
let ballDirection = new THREE.Vector3(0, 0, -1);
let ballSpeed = 0.1;
let ballMoving = false;

// 게임 초기화 함수
function init() {
    // 씬 생성
    scene = new THREE.Scene();

    // 카메라 생성
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    // 렌더러 생성
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 공 모델 생성
    const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    // 바닥 생성
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    scene.add(ground);

    // 네트 생성
    const netGeometry = new THREE.BoxGeometry(0.1, 4, 20);
    const netMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const net = new THREE.Mesh(netGeometry, netMaterial);
    scene.add(net);

    // 블록 생성
    const blockGeometry = new THREE.BoxGeometry(4, 4, 4);
    const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const block1 = new THREE.Mesh(blockGeometry, blockMaterial);
    block1.position.set(-10, 2, 0);
    scene.add(block1);
    const block2 = new THREE.Mesh(blockGeometry, blockMaterial);
    block2.position.set(10, 2, 0);
    scene.add(block2);
}

// 게임 루프 함수
function animate() {
    requestAnimationFrame(animate);

    // 공 이동
    if (ballMoving) {
        ball.position.add(ballDirection.clone().multiplyScalar(ballSpeed));
        // 충돌 검사 및 점수 계산
        if (ball.position.z < -24) {
            if (ball.position.x > -2 && ball.position.x < 2) {
                if (ball.position.z < -25) {
                    player1Score++;
                    console.log("Player 1 Scores!", "Player 1:", player1Score, "Player 2:", player2Score);
                }
            } else {
                if (ball.position.z < -25) {
                    player2Score++;
                    console.log("Player 2 Scores!", "Player 1:", player1Score, "Player 2:", player2Score);
                }
            }
            resetBall();
        }
    }

    // 렌더링
    renderer.render(scene, camera);
}

// 창 크기 조정 시 카메라 비율 업데이트
window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// 마우스 클릭 시 공 이동 시작
window.addEventListener('click', function () {
    if (!ballMoving) {
        ballMoving = true;
    }
});

// 공 초기 위치로 리셋
function resetBall() {
    ball.position.set(0, 1, 0);
    ballMoving = false;
}

// 게임 초기화 및 루프 실행
init();
animate();
