import { Ball } from "./Ball";
import { Fish } from "./organisms/Fish";
import { Genome } from "./Genome";
import { Rectangle } from "./organisms/Rectangle";
import { getRandomFromRange, getRandomFloat, degToRad, uuid } from "./Utils";
import { Vector } from "./Vector";
import { Food } from "./organisms/Food";
import { QuadTree } from "./organisms/Quadtree";
import { Circle } from "./organisms/Circle";
export const Environment = (() => {
  let environment = {
    populationSize: 30,
    foodSize: 20,
    foods: [],
    population: [],
    qtree: null,
    inputNodes: 2,
    hiddenNodes: 6,
    outputNodes: 2,
  };

  const init = () => {
    let { width, height } = environment.canvas;
    for (let j = 0; j < environment.populationSize; j++) {
      let fish = new Fish({
        position: new Vector(
          getRandomFromRange(0, width),
          getRandomFromRange(0, height)
        ),
        velocity: new Vector(getRandomFloat(), getRandomFloat()),
      });
      // console.log(fish.wanderAngle);
      environment.population.push(fish);
      environment.qtree.insertOrganism(fish);
    }
    for (let i = 0; i < environment.foodSize; i++) {
      let food = new Food(
        getRandomFromRange(0, width),
        getRandomFromRange(0, height)
      );
      environment.foods.push(food);
      environment.qtree.insertFood(food);
    }
  };
  const setup = (payload) => {
    Object.assign(environment, payload);
    qtreeSetup();
    init();
  };
  const qtreeSetup = () => {
    let { width, height } = environment.canvas,
      halfWidth = width / 2,
      halfHeight = height / 2;
    environment.qtree = new QuadTree(
      new Rectangle(halfWidth, halfHeight, halfWidth, halfHeight),
      2
    );
    environment.qtree.reset();
  };
  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  };
  const checkCollision = () => {
    for (let i = 0; i < environment.population.length; i++) {
      let o = environment.population[i];
      for (let j = i + 1; j < environment.population.length; j++) {
        let o2 = environment.population[j];
        if (o2.checkCollision(o)) {
          let collisionVector = {
              x: o2.position.x - o.position.x,
              y: o2.position.y - o.position.y,
            },
            distance = getDistance(
              o.position.x,
              o.position.y,
              o2.position.x,
              o2.position.y
            ),
            collisionVectorNormalized = {
              x: collisionVector.x / distance,
              y: collisionVector.y / distance,
            },
            relativeVelocity = {
              x: o.velocity.x - o2.velocity.x,
              y: o.velocity.y - o2.velocity.y,
            },
            speed =
              relativeVelocity.x * collisionVectorNormalized.x +
              relativeVelocity.y * collisionVectorNormalized.y;
          if (speed < 0) {
            break;
          }
          o.velocity.x -= collisionVectorNormalized.x * speed;
          o.velocity.y -= collisionVectorNormalized.y * speed;
          o2.velocity.x += collisionVectorNormalized.x * speed;
          o2.velocity.y += collisionVectorNormalized.y * speed;
        }
      }
    }
  };
  const handleFeeding = () => {
    let record = Infinity,
      closest = -1;
    for (let o of environment.population) {
      let foods = environment.qtree.searchFood(
        new Circle(o.position.x, o.position.y, o.seeRange)
      );

      for (let i = 0; i < foods.length; i++) {
        let d =
          Math.pow((o.position.x = foods[i].position.x), 2) +
          Math.pow(o.position.y - foods[i].position.y, 2);
        if (d < record) {
          record = d;
          closest = i;
        }
      }
      if (record <= Math.pow(o.seeRange, 2) && foods[closest]) {
        if (record < o.r1 * o.r1 + foods[closest].r) {
          o.eat(foods[closest]);
        } else {
          if (foods.length) {
            o.chase(foods[closest]);
          }
        }
      }
    }
  };
  const draw = () => {
    let { ctx } = environment.canvas;
    environment.foods.map((f) => f.draw(ctx));
    environment.population.map((o) => o.draw(ctx));
    // environment.qtree.draw(ctx);
  };
  const update = () => {
    let { width, height } = environment.canvas;
    environment.foods.map((f) => f.update({ width, height }));
    environment.foods = environment.foods.filter((f) => !f.dead);
    environment.population.map((o) => {
      o.boundaries({ width, height });
      o.update();
      let foods = environment.qtree.searchFood(
        new Circle(o.position.x, o.position.y, o.seeRange)
      );
      o.handleFeeding(foods);
    });
    environment.population = environment.population.filter((o) => !o.dead);
    if (environment.foods.length < environment.foodSize) {
      let food = new Food(
        getRandomFromRange(0, width),
        getRandomFromRange(0, height)
      );
      environment.foods.push(food);
    }
    qtreeSetup();
    environment.foods.forEach((f) => environment.qtree.insertFood(f));
    environment.population.forEach((o) => environment.qtree.insertOrganism(o));
    // environment.population.map((o) => {
    //   let foods = environment.qtree.searchFood(
    //     new Circle(o.position.x, o.position.y, o.seeRange)
    //   );
    //   // console.log(foods);
    //   o.handleFeeding(foods);
    // });
  };
  const clearCanvas = () => {
    let { ctx, width, height } = environment.canvas;
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = "rgba(36, 38, 45, 1)";
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  };
  const animate = () => {
    clearCanvas();
    update();
    draw();
    checkCollision();
    // for (let i = 0; i < environment.population.length; i++) {
    //   for (let j = i + 1; j < environment.population.length; j++) {
    //     if (
    //       environment.population[i].checkCollision(environment.population[j])
    //     ) {
    //       // let dist = environment.population[j].position.dist(
    //       //   environment.population[i].position
    //       // );
    //       // if (
    //       //   dist <
    //       //   environment.population[j].r + environment.population[i].r
    //       // ) {
    //       //   let force = environment.population[j].position.subtract(
    //       //     environment.population[i].position
    //       //   );
    //       //   force.normalize();
    //       //   force.multiply(environment.population[i].velocity.magnitude());
    //       //   environment.population[j].applyForce(force);
    //       //   environment.population[j].velocity.multiply(1);

    //       //   force.multiply(-1);
    //       //   force.normalize();
    //       //   force.multiply(environment.population[j].velocity.magnitude());
    //       //   environment.population[i].applyForce(force);
    //       //   environment.population[i].velocity.multiply(1);
    //       // }
    //       let dist = environment.population[j].position
    //         .copy()
    //         .subtract(environment.population[i].position.copy());
    //       if (
    //         dist.magnitude() <
    //         environment.population[j].r + environment.population[i].r
    //       ) {
    //         dist.setMagnitude(
    //           environment.population[j].r + environment.population[i].r
    //         );
    //         let offset = environment.population[j].position
    //           .copy()
    //           .subtract(environment.population[i].position.copy())
    //           .subtract(dist);
    //         environment.population[i].position.add(offset);
    //         environment.population[j].position.subtract(offset);
    //       }
    //     }
    //   }
    // }
    environment.rAF = requestAnimationFrame(animate);
  };
  const start = () => {
    environment.rAF = requestAnimationFrame(animate);
  };
  return {
    setup,
    start,
  };
})();
