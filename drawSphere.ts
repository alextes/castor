// http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html

const c = document.createElement("canvas");
const $ = c.getContext("2d")!
const w = (c.width = 420);
const h = (c.height = 420);

document.body.appendChild(c);

interface Point {
  x: number;
  y: number;
  z: number;
}

const rotatePointX = (point: Point, amount: number) => {
  let y = point.y;
  point.y = y * Math.cos(amount) + point.z * Math.sin(amount) * -1.0;
  point.z = y * Math.sin(amount) + point.z * Math.cos(amount);
};

const rotatePointY = (point: Point, amount: number) => {
  let x = point.x;
  point.x = x * Math.cos(amount) + point.z * Math.sin(amount) * -1.0;
  point.z = x * Math.sin(amount) + point.z * Math.cos(amount);
};

const rotatePointZ = (point: Point, amount: number) => {
  let x = point.x;
  point.x = x * Math.cos(amount) + point.y * Math.sin(amount) * -1.0;
  point.y = x * Math.sin(amount) + point.y * Math.cos(amount);
};

const getPointProjection = (
  point: Point,
  distance: number,
  xy: number,
  offset: number,
  offsetZ: number
) => (distance * xy) / (point.z - offsetZ) + offset;

const drawPoint = (x: number, y: number, size: number, color: string) => {
  $.save();
  $.beginPath();
  $.fillStyle = color;
  $.arc(x, y, size, 0, 2 * Math.PI, true);
  $.fill();
  $.restore();
};

class Sphere {
  point: Array<Point> = [];
  radius = 20.0;
  color = "rgb(100,0,255)";
  rotation = 0;
  distance = 0;
  numberOfVertexes = 0;

  constructor(radius = 20.0) {
    this.point = [];
    this.color = "rgb(100,0,255)";
    this.radius = radius;
    this.numberOfVertexes = 0;

    this.rotation = 0;
    this.distance = 0;

    this.init();
  }

  init() {
    for (let alpha = 0; alpha <= 6.28; alpha += 0.17) {
      let p = (this.point[this.numberOfVertexes] = { x: 0, y: 0, z: 0 });

      p.x = Math.cos(alpha) * this.radius;
      p.y = 0;
      p.z = Math.sin(alpha) * this.radius;

      this.numberOfVertexes++;
    }

    for (let direction = 1; direction >= -1; direction -= 2) {
      for (let beta = 0.17; beta < Math.PI; beta += 0.17) {
        let radius = Math.cos(beta) * this.radius;
        let fixedY = Math.sin(beta) * this.radius * direction;

        for (let alpha = 0; alpha < 6.28; alpha += 0.17) {
          let p = (this.point[this.numberOfVertexes] = { x: 0, y: 0, z: 0 });

          p.x = Math.cos(alpha) * radius;
          p.y = fixedY;
          p.z = Math.sin(alpha) * radius;

          this.numberOfVertexes++;
        }
      }
    }
  }

  draw() {
    let x, y;
    let p = { x: 0, y: 0, z: 0 };

    for (let i = 0; i < this.numberOfVertexes; i++) {
      p.x = this.point[i].x;
      p.y = this.point[i].y;
      p.z = this.point[i].z;

      rotatePointX(p, this.rotation);
      rotatePointY(p, this.rotation);
      rotatePointZ(p, this.rotation);

      x = getPointProjection(p, this.distance, p.x, w / 2.0, 100.0);
      y = getPointProjection(p, this.distance, p.y, h / 2.0, 100.0);

      if (x >= 0 && x < w) {
        if (y >= 0 && y < h) {
          if (p.z < 0) {
            drawPoint(x, y, 1, "rgba(200,200,200,0.6)");
          } else {
            drawPoint(x, y, 1, "rgb(255,255,255)");
          }
        }
      }
    }
  }

  update() {
    this.rotation += Math.PI / 360.0;

    if (this.distance < 1000) {
      this.distance += 10;
    }
  }
}

const sphere = new Sphere();

function draw() {
  window.requestAnimationFrame(draw);

  $.save();
  $.clearRect(0, 0, w, h);

  sphere.draw();

  $.restore();

  sphere.update();
}

draw();
