const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './assets/background.jpg'
})

const ufo = new Sprite({
	position: {
		x: 700,
		y: 150
	},
	imageSrc: './assets/ufo-sprite.png',
	scale: 1,
	framesMax: 6,
})

const player = new Fighter({
	position: {
		x: 200,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './assets/fighter1/idle.png',
	framesMax: 8,
	offset: { 
		x: 215,
		y: 157 
	},
	sprites: {
		idle: {
			imageSrc: './assets/fighter1/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './assets/fighter1/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './assets/fighter1/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './assets/fighter1/Fall.png',
			framesMax: 2
		}
	}
});

const enemy = new Fighter({
	position: {
		x: canvas.width - 200,
		y: 350
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: 'orange',
	offset: {
		x: -50,
		y: 0
	}
})

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}
}

decreaseTimer()

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	ufo.update()
	player.update()
	// enemy.update()

	//player movement
	player.velocity.x = 0

	if( keys.a.pressed && player.lastKey === 'a' ) {
		player.velocity.x = -5
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}

	// player jump
	if ( player.velocity.y < 0 ){
		player.switchSprite('jump')
	} else if ( player.velocity.y > 0) {
		player.switchSprite('fall')
	}
	
	//enemy movement
	enemy.velocity.x = 0

	if( keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' ) {
		enemy.velocity.x = -5
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5
	}

	//detect for collision
	if ( 
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
	}) && 
		player.isAttacking 
	){
		player.isAttacking = false
		enemy.health -= 20
		document.querySelector('#enemyHealth').style.width = enemy.health + '%'
	}

	if ( 
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player
	}) && 
		enemy.isAttacking 
	){
		enemy.isAttacking = false
		player.health -= 20
		document.querySelector('#playerHealth').style.width = player.health + '%'
	}

	// end game
	if ( enemy.health <= 0 || player.health <= 0 ){
		determineWinner({ player, enemy, timerId })
	}
}

animate();

window.addEventListener('keydown', (event) => {
	switch (event.key) {
	case 'd':
		keys.d.pressed = true
		player.lastKey = 'd'
		break
	case 'a':
		keys.a.pressed = true
		player.lastKey = 'a'
		break
	case 'w':
		player.velocity.y = -15
		break
	case 's':
		player.attack()
		break

	case 'ArrowRight':
		keys.ArrowRight.pressed = true
		enemy.lastKey = 'ArrowRight'
		break
	case 'ArrowLeft':
		keys.ArrowLeft.pressed = true
		enemy.lastKey = 'ArrowLeft'
		break
	case 'ArrowUp':
		enemy.velocity.y = -15
		break
	case 'ArrowDown':
		enemy.attack()
		break
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
	case 'd':
		keys.d.pressed = false
		break
	case 'a':
		keys.a.pressed = false
		break
	case 'w':
		keys.w.pressed = false
		lastKey = 'w'
		break

	case 'ArrowRight':
		keys.ArrowRight.pressed = false
		break
	case 'ArrowLeft':
		keys.ArrowLeft.pressed = false
		break
	}
})