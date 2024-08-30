import { Rectangle } from "./Rectangle";
class QuadTree {
  constructor(limit, capacity) {
    this.limit = limit;
    this.capacity = capacity;
    this.divided = false;
    this.foods = [];
    this.organisms = [];
  }

  subdivide() {
    const { x, y, w, h } = this.limit;
    const halfWidth = w / 2;
    const halfHeight = h / 2;
    let northeast = new Rectangle(
        x + halfWidth,
        y - halfHeight,
        halfWidth,
        halfHeight
      ),
      northwest = new Rectangle(
        x - halfWidth,
        y - halfHeight,
        halfWidth,
        halfHeight
      ),
      southeast = new Rectangle(
        x + halfWidth,
        y + halfHeight,
        halfWidth,
        halfHeight
      ),
      southwest = new Rectangle(
        x - halfWidth,
        y + halfHeight,
        halfWidth,
        halfHeight
      );
    this.northeast = new QuadTree(northeast, this.capacity);
    this.northwest = new QuadTree(northwest, this.capacity);
    this.southeast = new QuadTree(southeast, this.capacity);
    this.southwest = new QuadTree(southwest, this.capacity);
    this.divided = true;
  }
  insertFood(food) {
    if (!this.limit.containsPoint(food)) return false;
    if (this.foods.length < this.capacity) {
      this.foods.push(food);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      if (this.northeast.insertFood(food)) {
        return true;
      } else if (this.northwest.insertFood(food)) {
        return true;
      } else if (this.southeast.insertFood(food)) {
        return true;
      } else if (this.southwest.insertFood(food)) {
        return true;
      }
    }
  }

  insertOrganism(organism) {
    if (!this.limit.containsPoint(organism)) return false;
    if (this.organisms.length < this.capacity) {
      this.organisms.push(organism);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      if (this.northeast.insertOrganism(organism)) {
        return true;
      } else if (this.northwest.insertOrganism(organism)) {
        return true;
      } else if (this.southeast.insertOrganism(organism)) {
        return true;
      } else if (this.southwest.insertOrganism(organism)) {
        return true;
      }
    }
  }
  searchFood(circle, found) {
    if (!found) {
      found = [];
    }
    if (!this.limit.interseptaC(circle)) {
      // If they do NOT intersect, do not execute the code
      return found;
    } else {
      // If they intersect
      for (let a of this.foods) {
        // For the foods in this QuadTree
        if (circle.containsPoint(a)) {
          // If the food belongs to the circle
          found.push(a);
        }
      }

      if (this.divided) {
        // If the QuadTree has child QuadTrees
        this.northwest.searchFood(circle, found);
        this.northeast.searchFood(circle, found);
        this.southwest.searchFood(circle, found);
        this.southeast.searchFood(circle, found);
      }

      return found;
    }
  }
  reset() {
    this.organisms = [];
    this.foods = [];
  }

  draw(c) {
    c.strokeStyle = "rgba(255,255,255, 0.75)";
    c.strokeRect(
      this.limit.x - this.limit.w,
      this.limit.y - this.limit.h,
      this.limit.w * 2,
      this.limit.h * 2
    );
    if (this.divided) {
      this.northwest.draw(c);
      this.northeast.draw(c);
      this.southwest.draw(c);
      this.southeast.draw(c);
    }
  }
}
export { QuadTree };
