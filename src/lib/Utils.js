import { Vector } from "./Vector.js";
function constrainDistance(point, anchor, distance) {
  // console.log(point, anchor, distance);
  return Vector.add(anchor, Vector.subtract(point, anchor)).setMagnitude(
    distance
  );
  // point.subtract(anchor).normalize() * anchor.add(distance);
  // (point - anchor).normalize() * distance + anchor;
}
function simplifyAngle(angle) {
  while (angle >= Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  return angle;
}
function relativeAngleDiff(angle, anchor) {
  angle = simplifyAngle(angle + Math.PI - anchor);
  anchor = Math.PI;
  return anchor - angle;
}
function constrainAngle(angle, anchor, constraint) {
  if (Math.abs(relativeAngleDiff(angle, anchor)) <= constraint) {
    return simplifyAngle(angle);
  }
  if (relativeAngleDiff(angle, anchor) > constraint) {
    return simplifyAngle(anchor - constraint);
  }

  return simplifyAngle(anchor + constraint);
}

/**
 * Generates a random hexadecimal string of the specified length.
 * @param {number} n - The length of the string to generate.
 * @returns {string} - The generated hexadecimal string.
 */
export let uuid = (n = 20) => {
  // Define the possible characters to use
  const DIGITS = "0123456789";
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ALPHABET_LOWERCASE = ALPHABET.toLocaleLowerCase();
  const ALPHANUMERIC = ALPHABET + ALPHABET_LOWERCASE + DIGITS;
  // Initialize an empty string to store the output
  let output = "";
  // Loop n times
  while (n--) {
    // Pick a random index from 0 to IDX - 1
    let index = Math.floor(Math.random() * ALPHANUMERIC.length);
    // Append the character at that index to the output
    output += ALPHANUMERIC[index];
  }
  // Return the output
  return output;
};

export const getRandomFromRange = (min, max, step = 1) =>
  Math.floor(Math.random() * (max - min + step) + min);
export const randomFloatInRange = (min, max) => {
  let delta = max - min;
  return parseFloat((Math.random() * delta + min).toFixed(4));
};
export const getRandomFloat = () => {
  return parseFloat((Math.random() * 2 - 1).toFixed(3));
};
export const range = (start, stop, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

export { constrainDistance, relativeAngleDiff, constrainAngle };
export function interpolatePoints(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const c0 = -0.5 * t3 + t2 - 0.5 * t;
  const c1 = 1.5 * t3 - 2.5 * t2 + 1.0;
  const c2 = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
  const c3 = 0.5 * t3 - 0.5 * t2;

  const x = 0.5 * (p0.x * c0 + p1.x * c1 + p2.x * c2 + p3.x * c3);
  const y = 0.5 * (p0.y * c0 + p1.y * c1 + p2.y * c2 + p3.y * c3);

  return { x, y };
}

export const degToRad = (deg) => (deg * Math.PI) / 180;
export const radToDeg = (rad) => (rad * 180) / Math.PI;
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
