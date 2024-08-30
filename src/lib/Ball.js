import { getRandomFromRange, degToRad, getRandomFloat } from "./Utils";
import { Vector } from "./Vector";

export class Ball {
  constructor(config) {
    Object.assign(
      this,
      {
        type: "circle",
        interactionRange: getRandomFromRange(10, 20),
        collisionDistance: getRandomFromRange(10, 20),
        maxForceRange: getRandomFromRange(10, 20),
        sight: getRandomFromRange(10, 30),
        sightAngle: degToRad(getRandomFromRange(10, 60)),
        r: 4,
        maxSpeed: 1.5,
        position: new Vector(0, 0),
        velocity: new Vector(0, 0),
        acceleration: new Vector(0, 0),
        collisions: [],
        c: getRandomFromRange(0, 360),
      },
      config
    );
  }
  update(canvas) {
    let rules = Object.keys(this.rules).reduce((acc, curr) => {
      acc.push(this.rules[curr]);
      return acc;
    }, []);
    // console.log(rules);
    // this.genome.mutate(getRandomFloat());
    let output = this.genome.network.feedForward([
        this.position.x,
        this.position.y,
        // ...rules,
      ]),
      steeringForce = new Vector(output[0] * 2 - 1, output[1] * 2 - 1);
    // this.rules.blue = output[2];
    // this.rules.red = output[3];
    // this.rules.green = output[4];
    // console.log(output);
    this.acceleration.add(steeringForce);

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    // let speed = Math.sqrt(
    //   this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
    // );
    // if (speed > this.maxSpeed) {
    //   let ratio = this.maxSpeed / speed;
    //   this.velocity.x *= ratio;
    //   this.velocity.y *= ratio;
    // }
    this.position.add(this.velocity);
    if (this.position.x < 0) this.position.x += canvas.width;
    if (this.position.x > canvas.width) this.position.x -= canvas.width;

    if (this.position.y < 0) this.position.y += canvas.height;
    if (this.position.y > canvas.height) this.position.y -= canvas.height;
    this.acceleration.multiply(0);
    // if (
    //   this.position.x + this.r >= canvas.width ||
    //   this.position.x - this.r <= 0
    // ) {
    //   //   this.position.x *= -1;
    //   this.velocity.x = -this.velocity.x;
    // }
    // if (
    //   this.position.y + this.r >= canvas.height ||
    //   this.position.y - this.r <= 0
    // ) {
    //   //   this.position.y *= -1;
    //   this.velocity.y = -this.velocity.y;
    // }
  }
  applyForces(balls) {
    balls.forEach((ball) => {
      if (ball !== this) {
        let dx = ball.position.x - this.position.x,
          dy = ball.position.y - this.position.y,
          distanceTo = this.position.distanceTo(ball.position);
        if (distanceTo < this.interactionRange ** 2) {
          let dist = Math.sqrt(distanceTo),
            force = this.rules[ball.title],
            fx = (dx / dist) * force,
            fy = (dy / dist) * force;
          this.acceleration.add(new Vector(fx, fy));
        }
      }
    });
  }
  handleCollisions(balls) {
    balls.forEach((ball) => {
      if (ball !== this) {
        let dx = ball.position.x - this.position.x,
          dy = ball.position.y - this.position.y,
          distanceTo = this.position.distanceTo(ball.position);
        if (distanceTo < this.collisionDistance ** 2) {
          if (!this.collisions.includes(ball.id)) {
            this.collisions.push(ball.id);
          }
          let dist = Math.sqrt(distanceTo),
            overlap = (this.collisionDistance - dist) / 1,
            angle = Math.atan2(dy, dx),
            sin = Math.sin(angle),
            cos = Math.cos(angle);
          this.position.x -= overlap * cos;
          this.position.y -= overlap * sin;
          ball.position.x += overlap * cos;
          ball.position.y += overlap * sin;
          let vxRel = this.velocity.x - ball.velocity.x,
            vyRel = this.velocity.y - ball.velocity.y,
            dot = vxRel * dx + vyRel * dy;
          if (dot > 0) {
            let collisionScale = dot / dist,
              collisionVectorX = collisionScale * dx,
              collisionVectorY = collisionScale * dy;
            this.velocity.x -= collisionVectorX;
            this.velocity.y -= collisionVectorY;
            ball.velocity.x += collisionVectorX;
            ball.velocity.y += collisionVectorY;
          }
        } else {
          //   this.genome.mutate(getRandomFloat());
          //   let output = this.genome.network.feedForward([dx, dy]),
          //     steeringForce = new Vector(output[0] * 2 - 1, output[1] * 2 - 1);
          //   //   console.log(steeringForce);
          //   this.acceleration.add(steeringForce);
        }
      }
    });
  }
  draw(ctx) {
    ctx.fillStyle = `hsl(${this.c}, 100%, 50%)`;
    ctx.strokeStyle = `hsl(${this.c}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    // ctx.beginPath();
    // ctx.moveTo(this.position.x, this.position.y);
    // ctx.arc(
    //   this.position.x,
    //   this.position.y,
    //   this.sight,
    //   this.velocity.headingRads() - this.sightAngle / 2,
    //   this.velocity.headingRads() + this.sightAngle / 2
    // );
    // ctx.lineTo(this.position.x, this.position.y);
    // ctx.closePath();
    // ctx.fillStyle = `hsla(${this.c}, 100%, 50%, 0.5)`;
    // ctx.fill();
  }
}
