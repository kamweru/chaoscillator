class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static fromAngle(angle, magnitude) {
    const x = Math.cos(angle) * magnitude;
    const y = Math.sin(angle) * magnitude;
    return new Vector(x, y);
  }
  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  static add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  subtract(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  static subtract(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }
  // static fromAngle(angle, length = 1) {
  //   return new Vector(length * Math.cos(angle), length * Math.sin(angle));
  // }
  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
  divide(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }
  subtractNew(v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    return new Vector(x, y);
  }
  normalize() {
    let mag = this.magnitude();
    mag && this.divide(mag);
    return this;
    // return this.divide(this.magnitude());
  }
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  limit(l) {
    if (this.magnitude() > l) {
      this.setMagnitude(l);
    }
    return this;
  }
  setMagnitude(l) {
    const angle = this.angle();
    this.x = Math.cos(angle) * l;
    this.y = Math.sin(angle) * l;
    return this;
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  copy() {
    return new Vector(this.x, this.y);
  }
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  negate() {
    return new Vector(-this.x, -this.y);
  }
  // Calculate Euclidean distance to another vector
  distanceTo(otherVector) {
    const dx = this.x - otherVector.x;
    const dy = this.y - otherVector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  dist(other) {
    let d = other.copy().subtract(this);
    return d.magnitude();
  }
  angleBetween(other) {
    return this.angle() - other.angle();
  }
  headingRads() {
    var h = Math.atan2(this.y, this.x);
    return h;
  }
  headingDegs() {
    var r = Math.atan2(this.y, this.x);
    var h = (r * 180.0) / Math.PI;
    return h;
  }
  rotateDegs(a) {
    a = (a * Math.PI) / 180.0;
    let newHead = this.headingRads() + a,
      magnitude = this.magnitude();
    this.x = Math.cos(newHead) * magnitude;
    this.y = Math.cos(newHead) * magnitude;
    return this;
  }
  rotate(a) {
    this.setAngle(this.angle() + a);
    return this;
  }
  setAngle(a) {
    var mag = this.magnitude();
    this.x = Math.cos(a) * mag;
    this.y = Math.sin(a) * mag;
    return this;
  }
  reflect(v) {
    return this.subtract(v.multiply(2 * this.dot(v)));
  }
}

export { Vector };
