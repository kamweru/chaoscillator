import { getRandomFromRange, degToRad } from "./Utils";
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
        sight: getRandomFromRange(10, 60),
        sightAngle: degToRad(getRandomFromRange(10, 60)),
        r: 4,
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
    this.position.add(this.velocity);
    if (
      this.position.x + this.r >= canvas.width ||
      this.position.x - this.r <= 0
    ) {
      this.velocity.x = -this.velocity.x;
    }
    if (
      this.position.y + this.r >= canvas.height ||
      this.position.y - this.r <= 0
    ) {
      this.velocity.y = -this.velocity.y;
    }
  }
  draw(ctx) {
    ctx.fillStyle = `hsl(${this.c}, 100%, 50%)`;
    ctx.strokeStyle = `hsl(${this.c}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.arc(
      this.position.x,
      this.position.y,
      this.sight,
      this.velocity.headingRads() - Math.PI / 12,
      this.velocity.headingRads() + Math.PI / 12
    );
    ctx.lineTo(this.position.x, this.position.y);
    ctx.closePath();
    ctx.strokeStyle = "hsla(317, 100%, 50%, 0.5)";
    ctx.fillStyle = "hsla(317, 100%, 50%, 0.5)";
    ctx.fill();
    // ctx.stroke();
  }
}
