import * as THREE from "three";

/**
 * Generates a starfield background for the scene.
 *
 * @param {Object} params - Configuration for the starfield.
 * @param {number} params.numStars - Number of stars to generate.
 * @returns {THREE.Points} - A Points object representing the starfield.
 */
export default function getStarfield({ numStars = 500 } = {}) {
  // Generate a random point on a sphere for star position
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6, // Default color hue for stars
      minDist: radius,
    };
  }

  const verts = [];
  const colors = [];
  const positions = [];
  let col;

  // Generate positions and colors for each star
  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }

  // Create geometry and material for the starfield
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load("./textures/stars/circle.png"), // Star texture
  });

  // Create and return the starfield points object
  const points = new THREE.Points(geo, mat);
  return points;
}
