// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const ground = new THREE.Mesh(geometry, material);
ground.rotation.x = Math.PI / -2;
scene.add(ground);

// Snake
const snake = [];
const snakeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const snakeHead = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), snakeMaterial);
snakeHead.position.set(0, 0, 0);
snake.push(snakeHead);
scene.add(snakeHead);

// Food
const foodGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const foodMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const food = new THREE.Mesh(foodGeometry, foodMaterial);
food.position.set(Math.floor(Math.random() * 10) - 5, 0, Math.floor(Math.random() * 10) - 5);
scene.add(food);

// Camera position
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Game logic
let direction = new THREE.Vector3(1, 0, 0);
let speed = 0.1;
let lastTime = 0;

function moveSnake(deltaTime) {
    const head = snake[0];
    const newHead = head.clone();
    newHead.position.add(direction.clone().multiplyScalar(deltaTime * speed));
    snake.unshift(newHead);
    scene.add(newHead);

    if (newHead.position.distanceTo(food.position) < 1) {
        food.position.set(Math.floor(Math.random() * 10) - 5, 0, Math.floor(Math.random() * 10) - 5);
    } else {
        const tail = snake.pop();
        scene.remove(tail);
    }
}

function animate(time) {
    requestAnimationFrame(animate);
    const deltaTime = time - lastTime;
    lastTime = time;
    moveSnake(deltaTime);
    renderer.render(scene, camera);
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            direction.set(0, 0, -1);
            break;
        case 'ArrowDown':
            direction.set(0, 0, 1);
            break;
        case 'ArrowLeft':
            direction.set(-1, 0, 0);
            break;
        case 'ArrowRight':
            direction.set(1, 0, 0);
            break;
    }
});

animate();
