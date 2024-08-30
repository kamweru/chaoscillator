import { getRandomFloat, getRandomFromRange } from "../Utils";
import { Vector } from "../Vector";

export class Food {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(getRandomFloat(), getRandomFloat());
    this.energy = getRandomFromRange(1, 30);
    this.mass = getRandomFromRange(1, 30);
    this.dead = false;
    this.r = 4;
    this.c = `hsl(126, 100%, 50%)`;
  }
  draw(ctx) {
    if (this.dead) return;
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  update({ width, height }) {
    const buffer = 50;
    this.position.add(this.velocity);
    if (
      this.position.x > width - buffer ||
      this.position.x < buffer ||
      this.position.y > height - buffer ||
      this.position.y < buffer
    ) {
      this.energy = 0;
      this.dead = true;
    }
  }
}
