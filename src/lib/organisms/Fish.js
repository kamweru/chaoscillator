import { Vector } from "../Vector";
import {
  getRandomFloat,
  getRandomFromRange,
  randomFloatInRange,
} from "../Utils";
export class Fish {
  constructor(config) {
    Object.assign(
      this,
      {
        position: new Vector(0, 0),
        velocity: new Vector(2, 1),
        acceleration: new Vector(0, 0),
        maxForce: 0.1,
        maxSpeed: 2.5,
        wanderAngle: getRandomFromRange(0, 360),
        c: 291,
        r: getRandomFromRange(3, 9),
        gender: Math.random() < 0.5 ? "male" : "female",
        age: 0,
        seeRange: randomFloatInRange(50, 100),
        timeBorn: Date.now(),
        timeLived: 0,
        lifeTime: randomFloatInRange(200, 300),
        energy: randomFloatInRange(200, 300),
        mass: randomFloatInRange(200, 300),
        mature: false,
        dead: false,
        eating: false,
        minHungerThreshold: 0.3125,
        maxHungerThreshold: 0.625,
        minPheromoneThreshold: 0.625,
        maxPheromoneThreshold: 0.75,
        pheromoneRate: 0.2,
        pheromoneStep: 0.01,
        pheromoneDecay: 0.01,
      },
      config
    );
    this.r1 = this.r * 0.6125;
    this.r2 = this.r * 1.953125;
  }
  update() {
    this.updateEnergy();
    if (this.timeLived > this.lifeTime) {
      this.dead = true;
    }
    // this.acceleration.limit(this.maxForce);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.multiply(0);
    this.wander();
  }
  handleFeeding(foods) {
    this.eating = false;
    let record = Infinity,
      closest = -1;
    for (let i = 0; i < foods.length; i++) {
      let d =
        Math.pow(this.position.x - foods[i].position.x, 2) +
        Math.pow(this.position.y - foods[i].position.y, 2);
      if (d < record) {
        record = d;
        closest = i;
      }
    }
    if (record <= Math.pow(this.seeRange, 2) && foods[closest]) {
      if (record < this.r1 * this.r1 + foods[closest].r) {
        this.eat(foods[closest]);
      } else {
        if (foods.length) {
          this.chase(foods[closest]);
        }
      }
    }
  }
  wander = () => {
    let circleCenter = this.velocity.copy().normalize(),
      displacement = new Vector(0, -1),
      wanderForce = new Vector(0, 0);
    // circleCenter;
    displacement.multiply(1);
    displacement.rotateDegs(this.wanderAngle);
    this.wanderAngle += Math.random() * 30 - 15;
    wanderForce = circleCenter.add(displacement);
    wanderForce.multiply(0.4);
    if (this.eating) wanderForce.multiply(0.005);
    this.applyForce(wanderForce);
  };
  chase(target) {
    let lookAheadTime = 0.5,
      predictedPosition = target.position
        .copy()
        .add(target.velocity.copy().multiply(lookAheadTime));
    let desiredVelocity = predictedPosition.subtractNew(this.position);
    desiredVelocity.setMagnitude(this.maxSpeed);
    let steeringForce = desiredVelocity.subtractNew(this.velocity);
    // steeringForce.limit(this.maxForce);
    this.applyForce(steeringForce);
    console.log("chase");
  }
  eat(food) {
    this.energy += food.energy;
    this.mass += food.mass;
    food.dead = true;
    console.log("eating");
  }
  updateEnergy() {
    if (this.energy > 0) {
      let minEnergyExpenditure =
          0.0032 * Math.pow(Math.pow(this.mass, 0.5), 0.75),
        energyExpenditure =
          Math.pow(this.mass, 0.5) *
          Math.pow(this.velocity.magnitude(), 0.5) *
          0.0002;
      this.energy -= minEnergyExpenditure + energyExpenditure;
    } else {
      this.dead = true;
    }
  }
  applyForce = (force) => {
    this.acceleration.add(force);
  };
  getBounds(ctx) {
    let rotation = this.velocity.headingRads() - Math.PI / 2;
    // Calculate the major and minor radii
    const majorRadius = Math.max(this.r1, this.r2);
    const minorRadius = Math.min(this.r1, this.r2);

    // Calculate the bounding box coordinates
    const left = this.position.x - majorRadius;
    const top = this.position.y - minorRadius;
    const right = this.position.x + majorRadius;
    const bottom = this.position.y + minorRadius;

    // Apply rotation (if any)
    const cosTheta = Math.cos(rotation);
    const sinTheta = Math.sin(rotation);
    const rotatedLeft =
      this.position.x +
      (left - this.position.x) * cosTheta -
      (top - this.position.y) * sinTheta;
    const rotatedTop =
      this.position.y +
      (left - this.position.x) * sinTheta +
      (top - this.position.y) * cosTheta;
    const rotatedRight =
      this.position.x +
      (right - this.position.x) * cosTheta -
      (bottom - this.position.y) * sinTheta;
    const rotatedBottom =
      this.position.y +
      (right - this.position.x) * sinTheta +
      (bottom - this.position.y) * cosTheta;

    // Calculate width and height
    const width = Math.abs(rotatedRight - rotatedLeft);
    const height = Math.abs(rotatedBottom - rotatedTop);
    // console.log({
    //   x: rotatedLeft,
    //   y: rotatedTop,
    //   width,
    //   height,
    // });
    // ctx.strokeRect(rotatedLeft, rotatedBottom, width, height);
    // Return the bounding box object
    return {
      x: rotatedLeft,
      y: rotatedTop,
      width,
      height,
    };
    // return {
    //   x: this.position.x - this.r1,
    //   y: this.position.y - this.r2,
    //   width: this.r1 * 2,
    //   height: this.r2 * 2,
    // };
  }
  checkCollision(otherEllipse) {
    // Calculate the distance between the centers
    const dx = this.position.x - otherEllipse.position.x;
    const dy = this.position.y - otherEllipse.position.y;

    // Calculate the closest distance between the ellipses' edges in x and y direction
    const closestX = Math.abs(dx) - Math.abs(this.r1 + otherEllipse.r1);
    const closestY = Math.abs(dy) - Math.abs(this.r2 + otherEllipse.r2);

    // Check if there's a collision based on the closest distances
    return closestX <= 0 && closestY <= 0;
  }
  boundaries({ width, height, action = "bounce" }) {
    if (action === "wrap") {
      if (this.position.x < 0) this.x += width;
      if (this.position.x > width) this.position.x -= width;
      if (this.position.y < 0) this.position.y += height;
      if (this.position.y > height) this.position.y -= height;
    }
    if (action === "bounce") {
      const buffer = 50; // Buffer distance from the canvas edges
      let desiredVelocity = new Vector(0, 0);
      if (this.position.x - (this.r1 + this.r2) < buffer) {
        desiredVelocity = new Vector(this.maxSpeed, this.velocity.y);
        // this.applyForce(new Vector(this.maxForce * 3, 0));
      }
      if (this.position.x + (this.r1 + this.r2) > width - buffer) {
        desiredVelocity = new Vector(-this.maxSpeed, this.velocity.y);
        // this.applyForce(new Vector(-this.maxForce * 3, 0));
      }
      if (this.position.y - (this.r1 + this.r2) < buffer) {
        desiredVelocity = new Vector(this.velocity.x, this.maxSpeed);
        // this.applyForce(new Vector(0, this.maxForce * 3));
      }
      if (this.position.y + (this.r1 + this.r2) > height - buffer) {
        desiredVelocity = new Vector(this.velocity.x, -this.maxSpeed);
        // this.applyForce(new Vector(0, -this.maxForce * 3));
      }
      desiredVelocity.normalize();
      desiredVelocity.multiply(this.maxSpeed);
      let redirection = desiredVelocity.subtract(this.velocity);
      redirection.limit(this.maxForce * 3);
      // if (Number.isNaN(redirection.x)) redirection.x = getRandomFloat();
      // if (Number.isNaN(redirection.y)) redirection.y = getRandomFloat();
      this.applyForce(redirection);
      // if (this.position.x < 0) {
      //   this.position.x = -this.position.x;
      //   this.velocity.x *= -1;
      // }
      // if (this.position.x >= width) {
      //   this.position.x = 2 * width - this.position.x;
      //   this.velocity.x *= -1;
      // }
      // if (this.position.y < 0) {
      //   this.position.y = -this.position.y;
      //   this.velocity.y *= -1;
      // }
      // if (this.position.y >= height) {
      //   this.position.y = 2 * height - this.position.y;
      //   this.velocity.y *= -1;
      // }
    }
  }
  draw(ctx) {
    ctx.fillStyle = `hsl(${this.c}, 100%, 50%)`;
    ctx.beginPath();
    ctx.ellipse(
      this.position.x,
      this.position.y,
      this.r1,
      this.r2,
      this.velocity.headingRads() - Math.PI / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  // Method to check for collision with another ellipse
  isCollidingWith(other) {
    // Get the axes to test (normals to the edges of the bounding boxes)
    const axes = this.getAxes().concat(other.getAxes());

    // Check for overlap on all axes
    for (let axis of axes) {
      const projection1 = this.projectOntoAxis(axis);
      const projection2 = other.projectOntoAxis(axis);

      if (!this.overlaps(projection1, projection2)) {
        return false; // No collision
      }
    }
    return true; // Collision
  }

  // Method to get the axes (normals to the edges of the bounding box)
  getAxes() {
    const axes = [];
    const angle = this.velocity.headingRads() - Math.PI / 2;
    axes.push(new Vector(Math.cos(angle), Math.sin(angle))); // Major axis
    axes.push(new Vector(-Math.sin(angle), Math.cos(angle))); // Minor axis
    return axes;
  }

  // Method to project the ellipse onto an axis
  projectOntoAxis(axis) {
    const vertices = this.getVertices();
    let min = axis.dot(vertices[0]);
    let max = min;
    for (let vertex of vertices) {
      const projection = axis.dot(vertex);
      if (projection < min) {
        min = projection;
      }
      if (projection > max) {
        max = projection;
      }
    }
    return { min, max };
  }

  // Method to get the vertices of the bounding box
  getVertices() {
    const angle = this.velocity.headingRads() - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const halfWidth = this.r1;
    const halfHeight = this.r2;

    return [
      new Vector(
        this.position.x + halfWidth * cos - halfHeight * sin,
        this.position.y + halfWidth * sin + halfHeight * cos
      ),
      new Vector(
        this.position.x - halfWidth * cos - halfHeight * sin,
        this.position.y - halfWidth * sin + halfHeight * cos
      ),
      new Vector(
        this.position.x + halfWidth * cos + halfHeight * sin,
        this.position.y + halfWidth * sin - halfHeight * cos
      ),
      new Vector(
        this.position.x - halfWidth * cos + halfHeight * sin,
        this.position.y - halfWidth * sin - halfHeight * cos
      ),
    ];
  }

  // Method to check if two projections overlap
  overlaps(projection1, projection2) {
    return (
      projection1.max >= projection2.min && projection2.max >= projection1.min
    );
  }
}
