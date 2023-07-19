import { Circle, Line, SceneCollection, Simulation, Vector } from 'simulationjs';

const canvas = new Simulation('canvas');
canvas.fitElement();
canvas.start();

const dotCol = new SceneCollection('dots');
canvas.add(dotCol);

const lineCol = new SceneCollection('lines');
canvas.add(lineCol);

const points = generatePoints(27, new Vector(200, 200), 100);
const dots = generateDots(points);
dots.forEach((dot) => dotCol.add(dot));

const triangles = generateTriangles(points);

const lines = generateLines(triangles);
lines.forEach((line) => lineCol.add(line));

let currentTriangle = 0;

function iterateTriangles() {
  if (currentTriangle >= triangles.length) {
    currentTriangle = 0;
  }

  let lines = linesFromTriangle(triangles[currentTriangle]);
  lineCol.empty();
  lines.forEach((line) => lineCol.add(line));

  currentTriangle++;
}

function showFullMesh() {
  lineCol.empty();
  lines.forEach((line) => lineCol.add(line));
}

// setInterval(iterateTriangles, 200);
// setInterval(showFullMesh, 200 * triangles.length);

function generateLines(triangles: (readonly [Vector, Vector, Vector])[]) {
  let res: Line[] = [];

  triangles.forEach((triangle) => res.push(...linesFromTriangle(triangle)));

  return res;
}

function linesFromTriangle(triangle: readonly [Vector, Vector, Vector]) {
  const res: Line[] = [];

  for (let i = 0; i < triangle.length; i++) {
    for (let j = 0; j < triangle.length; j++) {
      if (i === j) continue;
      res.push(new Line(triangle[i], triangle[j]));
    }
  }

  return res;
}

function generateTriangles(points: Vector[]) {
  const res: (readonly [Vector, Vector, Vector])[] = [];

  let facingRight = true;
  let rightOffset = 0;
  let leftOffset = 0;

  while (rightOffset < points.length - leftOffset - 2) {
    if (facingRight) {
      const triangle = [
        points[rightOffset],
        points[rightOffset + 1],
        points[points.length - leftOffset - 1]
      ] as const;
      res.push(triangle);

      rightOffset++;
    } else {
      const triangle = [
        points[rightOffset],
        points[points.length - leftOffset - 1],
        points[points.length - leftOffset - 2]
      ] as const;
      res.push(triangle);

      leftOffset++;
    }

    facingRight = !facingRight;
  }

  return res;
}

function generateDots(points: Vector[]) {
  return points.map((item) => new Circle(item, 4));
}

function generatePoints(num: number, pos: Vector, radius: number) {
  let res: Vector[] = [];

  const step = 360 / num;

  for (let i = 0; i < num; i++) {
    res.push(
      new Vector(1, 0)
        .rotate(i * step)
        .multiply(radius)
        .add(pos)
    );
  }

  return res;
}
