import { World } from "../entity/World";
import { BlockList } from "../entity/Block";
import { Caterpillars } from "../entity/Caterpillar";
import { collisions, handleConllision } from "../systems/CollisionSystem";
import { FrameSystem } from "./FrameSystem";

export const MovementSystem = (hero, activeKey) => {
    const { width, height } = World;
    const speed = 2;

    hero.FrameComponent.sprite = 0;
    if (activeKey['ArrowLeft'] && hero.digin == false) {
        if (hero.PositionComponent.x1 <= width/2 && World.distanceTraveled > 10) {
            BlockList.forEach(block => {
                block.PositionComponent.x1 += speed;
            })
            Caterpillars.forEach(caterpillar => {
                caterpillar.PositionComponent.x1 += speed;
            })
            hero.vx = 0;
        } else {
            hero.vx = -speed;
        }
        World.distanceTraveled -= speed;
        hero.direction = "left";
        hero.FrameComponent.sprite = 128;
    }

    if (activeKey['ArrowRight'] && hero.digin == false) {
        if (hero.PositionComponent.x1 + hero.PositionComponent.x2 >= width/2 && World.distanceTraveled < 3000) {
            BlockList.forEach(block => {
                block.PositionComponent.x1 -= speed;
            })
            Caterpillars.forEach(caterpillar => {
                caterpillar.PositionComponent.x1 -= speed;
            })
            hero.vx = 0;
        } else {;
            hero.vx = speed;
        }
        World.distanceTraveled += speed;
        hero.FrameComponent.sprite = 96;
        hero.direction = "right";
    }
     // Прыжок
     if (activeKey['ArrowUp']) {
        if (hero.jump == false) {
            hero.vy = -20
            hero.FrameComponent.sprite = 130
            hero.jump = true
        } else if (hero.digin == true) {
            hero.digin = false
        }
    } 
    if (activeKey['ArrowDown']) {
        if (hero.digin == false) {
            hero.vy = speed
            hero.FrameComponent.sprite = 130
            hero.digin = true
        }
    } 
        FrameSystem(hero);
        // FrameSystem(Background, 0.007);
    hero.vx *= 0.9;
    hero.PositionComponent.x1 += hero.vx;
    hero.PositionComponent.y1 += hero.vy;
    // hero.vy += 1; // Гравитация

    BlockList.forEach(block => {
        let collides = collisions(hero, block);
        if (collides) {
            handleConllision(hero, block);
            Caterpillars.forEach(caterpillar => {
                if (hero.PositionComponent.x1 + hero.PositionComponent.x2 > caterpillar.PositionComponent.x1 && hero.PositionComponent.x1 < caterpillar.PositionComponent.x1 + caterpillar.PositionComponent.x2 && caterpillar.hp == 100) {
                    World.count++;
                    caterpillar.hp -= 100;
                    if (hero.hp <= 95) {
                        hero.hp += 5;
                    }
                }
            })
        }
    });
    if (hero.jump) {
        hero.vy += 1; // Гравитация
        hero.direction = "bottom";
    }
    if (hero.PositionComponent.x1 < 0) {
        hero.PositionComponent.x1 = 0
    }
    if (hero.PositionComponent.x1 > width - hero.PositionComponent.x2) {
        hero.PositionComponent.x1 = width - hero.PositionComponent.x2                     
    }
    if (hero.PositionComponent.y1 > height - 250 && hero.digin == false) {
        hero.PositionComponent.y1 = height - 250
        hero.jump = false
    }
}