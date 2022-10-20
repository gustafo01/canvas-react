interface ILine {
  startPosition: IPosition;
  endPosition: IPosition;
}

interface IPosition {
  x: number;
  y: number;
}

interface INativeEvent {
  nativeEvent: {
    offsetX: number;
    offsetY: number;
  };
}

interface IPoint {
  x: number;
  y: number;
  intersectionOne: boolean;
  intersectionTwo: boolean;
}

export default class LinesIntersection {
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean = false;
  startPosition: IPosition = { x: 0, y: 0 };
  endPosition: IPosition = { x: 0, y: 0 };
  lineList: ILine[] = [];
  animationLength = 180; // 1 секунда = 60-и повторениям
  width: number
  height: number

  constructor(ctx: CanvasRenderingContext2D, width:number, height:number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height
  }
  
  startDrawLine({ nativeEvent }: INativeEvent) {

    const { offsetX, offsetY } = nativeEvent;
    this.startPosition = { x: offsetX, y: offsetY };

    this.isDrawing = true;
  }

  draw({ nativeEvent }: INativeEvent) {
    if (!this.isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    this.endPosition = { x: offsetX, y: offsetY };

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawLines([
      ...this.lineList,
      { startPosition: this.startPosition, endPosition: this.endPosition },
    ]);
  }

  endDrawLine() {
    this.isDrawing = false;
    
    this.lineList.push({
      startPosition: this.startPosition,
      endPosition: this.endPosition,
    });
  }

  drawLines(lines: ILine[]) {
    lines.forEach((line) => {
      this.ctx.beginPath();
      this.ctx.moveTo(line.startPosition.x, line.startPosition.y);
      this.ctx.lineTo(line.endPosition.x, line.endPosition.y);
      this.ctx.stroke();
    });
    this.isDrawing
      ? this.createArrayOfPoints([
          ...this.lineList,
          { startPosition: this.startPosition, endPosition: this.endPosition },
        ])
      : this.createArrayOfPoints(this.lineList);
  }

  createArrayOfPoints(lines: ILine[]) {
    const pointsList = [];

    if (lines.length < 0) return;
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        pointsList.push(
          this.findIntersection(
            lines[i].startPosition.x,
            lines[i].startPosition.y,
            lines[i].endPosition.x,
            lines[i].endPosition.y,
            lines[j].startPosition.x,
            lines[j].startPosition.y,
            lines[j].endPosition.x,
            lines[j].endPosition.y
          )
        );
      }
    }
    this.drawPoints(pointsList);
  }

  drawPoints(points: IPoint[]) {
    points.forEach((point) => {

      if (point.intersectionOne && point.intersectionTwo) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.fillStyle = "#ff5353";
        this.ctx.stroke();
      }
    });
  }
  findIntersection(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
  ) {
    let ua:number,
      ub:number,
      denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return null;

    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    return {
      x: Math.round(x1 + ua * (x2 - x1)),
      y: Math.round(y1 + ua * (y2 - y1)),
      intersectionOne: ua >= 0 && ua <= 1,
      intersectionTwo: ub >= 0 && ub <= 1,
    };
  }

  collapseLines() {
    this.lineList = this.lineList.map((line) => {
      return this.decreaseLine(
        line.startPosition.x,
        line.startPosition.y,
        line.endPosition.x,
        line.endPosition.y
        );
      });
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.animationLength > 0) {
      setTimeout(() => {
        this.collapseLines()
      }, 16.666666)
      this.animationLength--;
    } else {
      this.lineList = [];
      this.animationLength = 180;
    }

    this.drawLines(this.lineList);
  }

  decreaseLine(x1: number, y1: number, x2: number, y2: number) {
    const amountIterations = 5;
    let resultStartPoint = this.findMidpoint(x1, y1, x2, y2);
    let resultEndPoint = this.findMidpoint(x1, y1, x2, y2);

    for (let i = amountIterations; i > 0; i--) {
      resultStartPoint = this.findMidpoint(
        x1,
        y1,
        resultStartPoint.x,
        resultStartPoint.y
      );
    }

    for (let i = amountIterations; i > 0; i--) {
      resultEndPoint = this.findMidpoint(
        x2,
        y2,
        resultEndPoint.x,
        resultEndPoint.y
      );
    }

    return {
      startPosition: {
        x: resultStartPoint.x,
        y: resultStartPoint.y,
      },
      endPosition: {
        x: resultEndPoint.x,
        y: resultEndPoint.y,
      },
    };
  }

  findMidpoint(x1: number, y1: number, x2: number, y2: number) {
    const x = (x1 + x2) / 2;
    const y = (y1 + y2) / 2;
    return {
      x,
      y,
    };
  }
}
