const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576





c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: 'src/images/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: 'src/images/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: 'src/images/Huntress/Idle.png',
    framesMax: 8,
    scale: 3,
    offset: {
        x: 175,
        y: 140
    },
    sprites: {
        idle: {
            imageSrc: 'src/images/Huntress/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: 'src/images/Huntress/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: 'src/images/Huntress/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: 'src/images/Huntress/Fall.png',
            framesMax: 2
        },
        attack2: {
            imageSrc: 'src/images/Huntress/Attack2.png',
            framesMax: 5
        },
        takeHit: {
            imageSrc: 'src/images/Huntress/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: 'src/images/Huntress/Death.png',
            framesMax: 8
        }

    },
    attackBox: {
        offset: {
            x: 75,
            y: 75
        },
        width: 125,
        height: 50
    }

})

const enemy = new Fighter({
    position: {
        x: 915,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: 'src/images/Hero-Knight/Idle.png',
    framesMax: 10,
    scale: 2.5,
    offset: {
        x: 175,
        y: 135
    },
    sprites: {
        idle: {
            imageSrc: 'src/images/Hero-Knight/Idle.png',
            framesMax: 11
        },
        run: {
            imageSrc: 'src/images/Hero-Knight/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: 'src/images/Hero-Knight/Jump.png',
            framesMax: 3
        },
        fall: {
            imageSrc: 'src/images/Hero-Knight/Fall.png',
            framesMax: 3
        },
        attack2: {
            imageSrc: 'src/images/Hero-Knight/Attack2.png',
            framesMax: 7
        },
        takeHit: {
            imageSrc: 'src/images/Hero-Knight/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: 'src/images/Hero-Knight/Death.png',
            framesMax: 11
        }

    },
    attackBox: {
        offset: {
            x: -165,
            y: 75
        },
        width: 145,
        height: 50
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
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'transparent'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement//

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -2.5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 2.5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }

    //player jumping//
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }


    //enemy movement//
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -2.5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 2.5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }

    //enemy jumping//

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //collision detection & enemy takes hit//

    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 3
    ) {
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })

        console.log('Player Attack')
    }

    //player misses//

    if (player.isAttacking && player.framesCurrent === 3) {
        player.isAttacking = false
    }

    //player takes hit//

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 4
    ) {
        player.takeHit()
        enemy.isAttacking = false

        gsap.to('#playerHealth', {
            width: player.health + '%'
        })

        console.log('Enemy Attack')
    }

    //enemy misses//

    if (enemy.isAttacking && enemy.framesCurrent === 4) {
        enemy.isAttacking = false
    }

    //console.log('Animation')//

    //end game based on health//
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({
            player,
            enemy,
            timerId
        })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
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
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
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
    }

    //console.log(event.key)//
})

window.addEventListener('keyup', (event) => {
    //console.log (event.key);//
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //enemy keys//
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }

    //console.log(event.key)//
})

//console.log(player)//