import { Ball } from "./Ball";
import { getRandomFromRange, getRandomFloat } from "./Utils";
import { Vector } from "./Vector";
export const Environment = (() => {
  let environment = {
      numBalls: 30,
      balls: [],
    },
    colors = {
      red: {
        c: 349,
        rules: {
          blue: -2,
          red: 4,
          green: 0,
        },
      },
      green: {
        c: 120,
        rules: {
          blue: -2,
          red: 0,
          green: 4,
        },
      },
      blue: {
        c: 210,
        rules: {
          blue: 4,
          red: -2,
          green: 0,
        },
      },
    };

  const init = () => {
    // circle = new Ball({
    //   position: new Vector(30, 360),
    //   velocity: new Vector(getRandomFloat(), getRandomFloat()),
    //   r: 25,
    //   big: true,
    // });
    // environment.balls.push(circle);
    for (let i = 0; i < environment.numBalls; i++) {
      //   let ball = new Ball({
      //     position: new Vector(
      //       getRandomFromRange(0, environment.canvas.width),
      //       getRandomFromRange(0, environment.canvas.height)
      //     ),
      //     velocity: new Vector(getRandomFloat(), getRandomFloat()),
      //   });
      //   environment.balls.push(ball);
    }
  };
  const setup = (payload) => {
    Object.assign(environment, payload);
    init();
    // console.log(getRandomFloat());
  };
  const constrainDistance = (point, anchor, distance) => {
    return point
      .copy()
      .subtract(anchor.copy())
      .subtract(point.copy().subtract(anchor.copy()).setMagnitude(distance));
  };
  const animate = () => {
    environment.canvas.ctx.clearRect(
      0,
      0,
      environment.canvas.width,
      environment.canvas.height
    );
    // let bigCircle = environment.balls.find((ball) => ball.big);
    for (let i = 0; i < environment.balls.length; i++) {
      //   if (!environment.balls[i].big) {
      //     let toNext = bigCircle.position
      //       .copy()
      //       .subtract(environment.balls[i].position.copy());
      //     if (toNext.magnitude() < bigCircle.r + environment.balls[i].r) {
      //       let offset = constrainDistance(
      //         bigCircle.position,
      //         environment.balls[i].position,
      //         bigCircle.r + environment.balls[i].r
      //       );
      //       environment.balls[i].position.add(offset);
      //     }
      //   }
      //   console.log(
      //     environment.balls[i].velocity.rotate(
      //       environment.balls[i].velocity.headingRads() / 5
      //     )
      //   );
      environment.balls[i].update(environment.canvas.canvas);
      environment.balls[i].draw(environment.canvas.ctx);
    }
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
