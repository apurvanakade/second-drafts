// === Class Definitions ===

class ShapeManager {
  constructor(canvasObj) {
    this.canvasObj = canvasObj;
    this.shapes = [];
  }

  addShape(shape) {
    this.shapes.push(shape);
  }

  removeShape(shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes.splice(index, 1);
    }
  }

  drawShapes() {
    this.shapes.forEach(shape => shape.draw());
  }

  handleMouseDown(mx, my) {
    this.shapes.forEach(shape => shape.startDrag([mx, my]));
  }

  handleMouseMove(mx, my) {
    this.shapes.forEach(shape => shape.dragTo([mx, my]));
  }

  handleMouseUp() {
    this.shapes.forEach(shape => shape.endDrag());
  }
}

class Triangle {
  constructor(A, B, C, canvasObj) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.canvasObj = canvasObj;
    this.ctx = canvasObj.getContext();
    this.CanvasA = canvasObj.toCanvas(A);
    this.CanvasB = canvasObj.toCanvas(B);
    this.CanvasC = canvasObj.toCanvas(C);
  }

  toCanvas(p) {
    return this.canvasObj.toCanvas(p);
  }

  fromCanvas(p) {
    return this.canvasObj.fromCanvas(p);
  }

  draw({ fillStyle = null, strokeStyle = "black", vertexColor = null } = {}) {
    const { CanvasA, CanvasB, CanvasC, ctx } = this;
    ctx.beginPath();
    ctx.moveTo(...CanvasA);
    ctx.lineTo(...CanvasB);
    ctx.lineTo(...CanvasC);
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
    if (vertexColor) {
      [this.CanvasA, this.CanvasB, this.CanvasC].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = vertexColor;
        ctx.fill();
      });
    }
  }

  drawGrid(spacing = 0.1, color = "rgba(200,200,200,0.5)") {
    const { ctx } = this;
    for (let i = 0; i <= 1; i += spacing) {
      for (let j = 0; j <= 1 - i; j += spacing) {
        const [x, y] = this.toCanvas(this.barycentricToCartesian(i, j));
        const neighbors = [
          [i + spacing, j],
          [i, j + spacing],
          [i + spacing, j - spacing]
        ];
        for (const [ni, nj] of neighbors) {
          if (ni >= 0 && nj >= 0 && ni + nj <= 1) {
            const [x2, y2] = this.toCanvas(this.barycentricToCartesian(ni, nj));
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.stroke();
          }
        }
      }
    }
  }

  barycentricToCartesian(i, j) {
    const k = 1 - i - j;
    return [
      i * this.A[0] + j * this.B[0] + k * this.C[0],
      i * this.A[1] + j * this.B[1] + k * this.C[1]
    ];
  }

  cartesianToBarycentric(x, y) {
    const [Ax, Ay] = this.A;
    const [Bx, By] = this.B;
    const [Cx, Cy] = this.C;
    const v0 = [Bx - Ax, By - Ay];
    const v1 = [Cx - Ax, Cy - Ay];
    const v2 = [x - Ax, y - Ay];
    const d00 = v0[0] * v0[0] + v0[1] * v0[1];
    const d01 = v0[0] * v1[0] + v0[1] * v1[1];
    const d11 = v1[0] * v1[0] + v1[1] * v1[1];
    const d20 = v2[0] * v0[0] + v2[1] * v0[1];
    const d21 = v2[0] * v1[0] + v2[1] * v1[1];
    const denom = d00 * d11 - d01 * d01;
    const j = (d11 * d20 - d01 * d21) / denom;
    const k = (d00 * d21 - d01 * d20) / denom;
    const i = 1 - j - k;
    return [i, j];
  }
}

class DraggableTriangle extends Triangle {
  constructor(A, B, C, canvasObj) {
    super(A, B, C, canvasObj);
    this.draggingIndex = null;
  }

  hitTest([mx, my], radius = 10) {
    const points = [this.A, this.B, this.C];
    return points.findIndex(([x, y]) => Math.hypot(mx - x, my - y) < radius);
  }

  startDrag([mx, my]) {
    this.draggingIndex = this.hitTest([mx, my]);
    return this.draggingIndex !== -1;
  }

  dragTo([mx, my]) {
    if (this.draggingIndex === null) return;
    const newCoord = this.fromCanvas([mx, my]);
    if (this.draggingIndex === 0) this.A = newCoord;
    else if (this.draggingIndex === 1) this.B = newCoord;
    else if (this.draggingIndex === 2) this.C = newCoord;

    this.CanvasA = this.toCanvas(this.A);
    this.CanvasB = this.toCanvas(this.B);
    this.CanvasC = this.toCanvas(this.C);
  }

  endDrag() {
    this.draggingIndex = null;
  }
}

class Canvas {
  constructor(width, height, scale = 200, offset = [50, 250]) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.scale = scale;
    this.offset = offset;
  }

  getCanvas() {
    return this.canvas;
  }

  getContext() {
    return this.ctx;
  }

  toCanvas([x, y]) {
    return [this.offset[0] + x * this.scale, this.offset[1] - y * this.scale];
  }

  fromCanvas([x, y]) {
    return [(x - this.offset[0]) / this.scale, (this.offset[1] - y) / this.scale];
  }

  drawPoint([x, y], color = "black") {
    const [canvasX, canvasY] = this.toCanvas([x, y]);
    this.ctx.beginPath();
    this.ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  newTriangle(A, B, C, draggable = false) {
    return draggable
      ? new DraggableTriangle(A, B, C, this)
      : new Triangle(A, B, C, this);
  }
}
