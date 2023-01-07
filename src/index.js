const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const elementTimon = document.getElementById('Timon');
const elementPumba = document.getElementById('Pumba');
const elementPause = document.getElementById('pause');
const elementGameover = document.getElementById('gameover');
const name = document.getElementById('name');
const buttonStart = document.getElementById('start');
const bootstrap = document.getElementById('bootstrap');
const debug = true;
let width = canvas.width = window.innerWidth - 5;  
let height = canvas.height = window.innerHeight - 5;
let pause = false;
let gameover = false;

let background = {
    PositionComponent: PositionComponent(),
    AppearanceComponent: AppearanceComponent(),
    vx: 0,
    width: 5000,
    height: height,
};
background.AppearanceComponent.img.src = 'Media/Фоны/1932758.png'
let Timon = {
    PositionComponent: PositionComponent(0, height - 300),
    AppearanceComponent: AppearanceComponent(),
    hp: 100,
    vx: 0,
    vy: 0,
    height: 100,
    width: 80,
    frames: 9,
    currentFrame: 0,
    speedAnim: 0,
    sprite: 95,
    jump: false,
    digin: false,
    direction: 0,
}
Timon.AppearanceComponent.img.src = 'Media/sprites/TimonTLK.png'
let Pumba = {
    PositionComponent: PositionComponent(),
    AppearanceComponent: AppearanceComponent(),
    hp: 100,
    vx: 0,
    vy: 0,
    height: 80,
    width: 100,
    frames: 9,
    currentFrame: 0,
    speedAnim: 0,
    sprite: 0,
    jump: false,
    digin: false
}
Pumba.AppearanceComponent.img.src = 'Media/sprites/PumbaTLK.png'
let Hyena = {
    PositionComponent: PositionComponent(),
    AppearanceComponent: AppearanceComponent(),
    hp: 100,
    vx: 0,
    vy: 0,
    height: 100,
    width: 100,
    frames: 9,
    currentFrame: 0,
    speedAnim: 0,
    sprite: 0,
    jump: false,
}
Hyena.AppearanceComponent.img.src = 'Media/sprites/Hyenas.png'

let randomPosition = []
for (var i = 100; i < 5000; i+=100) {
    randomPosition.push(i);
}

let blocks = []
for (let i = 0; i < 1; i++) {
    let block = {
        AppearanceComponent: AppearanceComponent(),
        PositionComponent: PositionComponent(0, height - 300),
        vx: 0,
        height: 50,
        width: 100,
    }
    let x = randomInteger(0, 4)
    if (i > 0) {
        while (blocks[i - 1].PositionComponent.x == randomPosition[x]) {
            x = randomInteger(0, 4)
        }
    }
    block.PositionComponent.x = randomPosition[x]
    block.AppearanceComponent.img.src = 'Media/Гусеницы/land-vector-1.png'
    blocks.push(block);
}

let caterpillars = []
for (let i = 0; i < 1; i++) {
    let caterpillar = {
        AppearanceComponent: AppearanceComponent(),
        PositionComponent: PositionComponent(blocks[i].PositionComponent.x, height - 300 - blocks[i].height),
        height: 50,
        width: 100,
        hp: 100
    }
    caterpillar.AppearanceComponent.img.src = 'Media/Гусеницы/caterpillar003.png'
    caterpillars.push(caterpillar);
}
let count = 0;
let activeKey = [];
addEventListener('resize', function() {
    width = canvas.width = window.innerWidth - 5;  
    height = canvas.height = window.innerHeight - 5;
})
addEventListener('keydown', function(event) {
    activeKey[event.code] = true;
})
addEventListener('keyup', function(event) {
    activeKey[event.code] = false;
})
name.addEventListener('input', function() {
    if (name.value == '') {
        buttonStart.disabled = true;
    } else {
        buttonStart.disabled = false;
    }
})
buttonStart.addEventListener('click', function() {
    bootstrap.style.display = 'none';
    main();
})
let s = 0;	
let m = 0;
let timer = false;

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min) ;
  return Math.floor(rand);
}
// function chooseBlockPosition(){
// 	let x = randomInteger(0, );
// 	let allowed = true;
// 	if(blocks.length > 0){
// 		blocks.forEach(block => {
// 			if(block.PositionComponent.x + block.width < x && 
// 				block.PositionComponent.x > x + 100){
// 				allowed = false;
// 			}
// 		})
// 	}
// 	if(allowed){
// 		return x;
// 	}else{
// 		chooseBlockPosition();
// 	}
// }
activeKey['Escape'] = ''

let currentTime = Date.now();

function collisions(block1, block2) {
    const leftSideBlock1 = block1.PositionComponent.x; 
    const rightSideBlock1 = block1.PositionComponent.x + block1.width;
    const leftSideBlock2 = block2.PositionComponent.x;
    const rightSideBlock2 = block2.PositionComponent.x + block2.width;
    const topSideBlock1 = block1.PositionComponent.y;
    const bottomSideBlock1 = block1.PositionComponent.y + block1.height;
    const topSideBlock2 = block2.PositionComponent.y;
    const bottomSideBlock2 = block2.PositionComponent.y + block2.height;

    if(rightSideBlock1 >= leftSideBlock2 &&
        leftSideBlock1 <= rightSideBlock2 &&
        bottomSideBlock1 >= topSideBlock2 &&
        topSideBlock1 <= bottomSideBlock2){
        return true;
    } else {
        return false;
    }
}

function handleConllision(block1, block2) {
    console.log("handle");
    console.log(block1.PositionComponent.y, height - 300);
    if(block1.PositionComponent.y >= height - 300) {
        if(block1.PositionComponent.x + block1.width >= block2.PositionComponent.x && block1.direction == "right"){
            block1.PositionComponent.x = block2.PositionComponent.x - block1.width - 1;
            block1.vx = 0;
        }
        if(block1.PositionComponent.x < block2.PositionComponent.x + block2.width && block1.direction == "left"){
            block1.PositionComponent.x = block2.PositionComponent.x + block2.width + 1;
            block1.vx = 0;
        }
    }
    if(block1.PositionComponent.y + block1.height >= block2.PositionComponent.y && block1.PositionComponent.y < block2.PositionComponent.y){
        block1.PositionComponent.y = block2.PositionComponent.y - block1.height;
        block1.jump = false;
    }

    caterpillars.forEach(caterpillar=>{

        if (block1.PositionComponent.x + block1.width > caterpillar.PositionComponent.x && block1.PositionComponent.x < caterpillar.PositionComponent.x + caterpillar.width && caterpillar.hp == 100) {
            count++;
            caterpillar.hp -= 100;
            if (block1.hp <= 95) {
                block1.hp += 5;
            }
        }
    })
}

function update(hero) {
    if(timer == false){
        if(Date.now() - currentTime >= 1000){
            currentTime = Date.now();
            if (s < 59) {
                    s++;
                } else {
                    s = 0;
                    m++;
                }
                if (hero.hp > 1) {
                    hero.hp--;
                } else {
                    gameover = true;
                }
        }
    }
        if (activeKey['ArrowLeft'] && hero.digin == false) {
            if (hero.PositionComponent.x <= width/2 && background.PositionComponent.x < 0) {
                blocks.forEach(block=>{
                    block.PositionComponent.x += 10;
                })
                caterpillars.forEach(caterpillar=>{
                    caterpillar.PositionComponent.x += 10;
                })
                hero.vx = 0
                background.PositionComponent.x += 10
            } else {
                hero.vx = -10
                hero.sprite = 95
            }
            hero.direction = "left";
        }
        if (activeKey['ArrowRight'] && hero.digin == false) {
            if (hero.PositionComponent.x + hero.width >= width/2) {
                blocks.forEach(block=>{
                    block.PositionComponent.x -= 10;
                })
                caterpillars.forEach(caterpillar=>{
                    caterpillar.PositionComponent.x -= 10;
                })
                background.PositionComponent.x -= 10
                hero.vx = 0
            } else {
                hero.vx = 10
                hero.sprite = 95
            }
            hero.direction = "right";
            
        }

// Прыжок
    if (activeKey['ArrowUp']) {
        if (hero.jump == false) {
            hero.vy = -20
            hero.sprite = 130
            hero.jump = true
        } else if (hero.digin == true) {
            hero.PositionComponent.y = height - 300
            hero.digin = false
        }
    } 
    if (activeKey['ArrowDown']) {
        if (hero.digin == false) {
            hero.vy = 10
            hero.sprite = 130
            hero.digin = true
        }
    } 
    if (activeKey['ArrowLeft'] || activeKey['ArrowRight'] || activeKey['ArrowUp']) {
        if (hero.speedAnim < 5) {
            hero.speedAnim++;
        } else {
            hero.speedAnim = 0;
            if (hero.currentFrame == hero.frames) {
                hero.currentFrame = 0;
            } else {
                hero.currentFrame++;
            }
        }
    }
    hero.vx *= 0.9;
    hero.PositionComponent.x += hero.vx;
    hero.PositionComponent.y += hero.vy;
    // hero.vy += 1; // Гравитация
    // console.log(hero.direction);

    blocks.forEach(block=>{
        let collides = collisions(hero, block);
        if(collides){
            handleConllision(hero, block);
        }
    });
    if(hero.jump){
        hero.vy += 1; // Гравитация
        hero.direction = "bottom";
    }
    if (hero.PositionComponent.x < 0) {
        hero.PositionComponent.x = 0
    }
    if (hero.PositionComponent.x > width - hero.width) {
        hero.PositionComponent.x = width - hero.width                     
    }
    if (hero.PositionComponent.y > height - 300 && hero.digin == false) {
        hero.PositionComponent.y = height - 300
        hero.jump = false
    }
    if (activeKey['Escape'] != '' && pause == false) {
        elementPause.style.display = 'flex';
        pause = true;
        activeKey['Escape'] = '';
    }
}
function render(hero) {
    context.clearRect(0, 0, width, height);
    context.beginPath();
        context.drawImage(background.AppearanceComponent.img, background.PositionComponent.x, background.PositionComponent.y, background.width, height);
    context.closePath();
// Персонаж
    context.beginPath();
    
        // context.drawImage(hero.AppearanceComponent.img, 31 * hero.currentFrame, hero.sprite, 25, 35, hero.PositionComponent.x, hero.PositionComponent.y, 50, 50)
        // console.log(hero.currentFrame)
        context.fillStyle = 'red';
        context.fillRect(width - 310, 10, hero.hp * 3, 15);
        if (hero.PositionComponent.y < height - 100) {
            context.fillRect(hero.PositionComponent.x, hero.PositionComponent.y, hero.width, hero.height);
        }
    context.closePath();
// Возвышенность
    context.beginPath();
        blocks.forEach(function(block) {
            if(debug){
                context.strokeStyle="red";
                context.rect(block.PositionComponent.x, block.PositionComponent.y, block.width, block.height);
                context.stroke();
            }
            context.fillStyle = 'black';
            context.fillRect(block.PositionComponent.x, block.PositionComponent.y, block.width, block.height)
            // context.drawImage(block.AppearanceComponent.img, block.PositionComponent.x, block.PositionComponent.y, block.width, block.height);
            
        })
    context.closePath();
// Гусеница
    context.beginPath();
        caterpillars.forEach(function(caterpillar) {
            if (caterpillar.hp == 100) {
                context.drawImage(caterpillar.AppearanceComponent.img, caterpillar.PositionComponent.x, caterpillar.PositionComponent.y, caterpillar.width, caterpillar.height);
            }
        })
    context.closePath();
    context.beginPath();
        context.fillStyle = 'black';
        context.font = '22px Verdana';
        context.fillText('Счет: ' + count, 10, 30);
        context.fillText('Время: ' + m + ':' + s, 10, 50);
    context.closePath();
// Гиена
    // context.beginPath();
    // 	blocks.forEach(function(block) {
    // 		context.fillStyle = 'yellow';
    // 		context.fillRect(Hyena.PositionComponent.x, Hyena.PositionComponent.y, Hyena.width, Hyena.height)
    // 	})
    // context.closePath();
    
}
function main() {
    if (pause == false && gameover == false) {
        update(Timon)
    } else if (gameover == true) {
        elementGameover.style.display = 'flex';
    } else {
        if (activeKey['Escape'] != '') {
            elementPause.style.display = 'none';
            pause = false;
            activeKey['Escape'] = '';
        }
    }

    render(Timon)
    requestAnimationFrame(main)
}
