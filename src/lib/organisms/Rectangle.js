class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // Checks if the point is contained within its limits (boundaries)
  containsPoint(point) {
    return (
      point.position.x >= this.x - this.w &&
      point.position.x <= this.x + this.w &&
      point.position.y >= this.y - this.h &&
      point.position.y <= this.y + this.h
    );
  }

  // Method to know if rectangles intersect
  interseptaR(range) {
    return !(
      // If this expression is true, they do NOT intersect
      (
        range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.h > this.y + this.h ||
        range.y + range.h < this.y - this.h
      )
    );
  }

  // Method to know if the rectangle intersects a circle
  interseptaC(circle) {
    // temporary variables to set edges for testing
    let testX = circle.x;
    let testY = circle.y;

    // which edge is closest?
    if (circle.x < this.x - this.w) {
      testX = this.x - this.w;
    } else if (circle.x > this.x + this.w) {
      testX = this.x + this.w;
    }

    if (circle.y < this.y - this.h) {
      testY = this.y - this.h;
    } else if (circle.y > this.y + this.h) {
      testY = this.y + this.h;
    }

    // get distance from closest edges
    let distX = circle.x - testX;
    let distY = circle.y - testY;
    let distance = Math.sqrt(distX * distX + distY * distY);

    // if the distance is less than the radius, collision!
    if (distance <= circle.r) {
      return true;
    }
    return false;
  }
}

export { Rectangle };
