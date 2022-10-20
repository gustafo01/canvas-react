import React, { FC, useEffect, useRef } from "react";
import LinesIntersection from "./models/LinesIntersection";

interface ICanvas {
  width: number;
  height: number;
}

const Canvas:FC<ICanvas> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D>();
  let intersection = new LinesIntersection(contextRef.current, props.width, props.height)

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.strokeStyle = "#bdbdbd";

    contextRef.current = ctx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    intersection = new LinesIntersection(contextRef.current, props.width, props.height)
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => intersection.startDrawLine(e)}
        onMouseMove={(e) => intersection.draw(e)}
        onMouseUp={() => intersection.endDrawLine()}
        {...props}
      />
      <button className="btn" onClick={() => intersection.collapseLines()}>
        Collapse lines
      </button>
    </>
  );
};

export default Canvas;
