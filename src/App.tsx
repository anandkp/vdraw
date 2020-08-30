import React, { useRef, useState, ChangeEvent } from "react";
import "./App.css";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import { Grid } from "@material-ui/core";
import { ReactComponent as EraserIcon } from "assets/images/eraser.svg";
import { Create as CreateIcon } from "@material-ui/icons";

function App() {
  const stageRef = useRef(null);

  const [lines, setLines] = useState<any[]>([]);
  const [isPaint, setIsPaint] = useState(false);
  const [mode, setMode] = useState("brush");

  const handleDown = () => {
    setIsPaint(true);
    var pos = ((stageRef.current as unknown) as Konva.Stage).getPointerPosition();
    if (pos !== null) {
      const lastLine = {
        stroke: "#00ff00",
        strokeWidth: 2,
        globalCompositeOperation:
          mode === "brush" ? "source-over" : "destination-out",
        points: [pos.x, pos.y],
      };

      setLines([...lines, lastLine]);
    }
  };

  const handleUp = () => setIsPaint(false);

  const handleMove = () => {
    if (!isPaint) {
      return;
    }

    const pos = ((stageRef.current as unknown) as Konva.Stage).getPointerPosition();
    if (pos !== null) {
      const newLines = lines.slice();
      const lastIndex = lines.length - 1;
      const lastLine = lines[lastIndex];

      newLines.splice(lastIndex, 1, {
        ...lastLine,
        points: lastLine.points.concat([pos.x, pos.y]),
      });
      setLines(newLines);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setMode(e.target.value);

  return (
    // Stage - is a div wrapper
    // Layer - is an actual 2d canvas element, so you can have several layers inside the stage
    // Rect and Circle are not DOM elements. They are 2d shapes on canvas
    <Grid container direction="row">
      <Grid
        item
        style={{
          border: "0px solid red",
          width: "100px",
          backgroundColor: "#3f3d55",
        }}
      >
        <EraserIcon />
        <CreateIcon />
        <select onChange={handleChange}>
          <option value="brush">Brush</option>
          <option value="eraser">Eraser</option>
        </select>
      </Grid>
      <Grid item xs={11}>
        <Stage
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px,#dfe2e6 1px,transparent 0)",
            backgroundSize: "12px 12px",
            backgroundAttachment: "fixed",
            height: "100%",
            cursor: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABh0lEQVRIS7XVv2vCQBQH8PdwEYdO2SJFcAtSkiFubY0UUvIfhOLi0CVzUQhOilrsf9Ct2NKlqzSkkO5CoZZkECQW7OrQwUFor1whJfFXjdGb7z7v3YP7HsKOFnouIYRFxI9t1fHDtcFgoLIsex+Px28R0YlSxA9z1WrVbrVaUCgUQFGUkSRJN4lE4hIRP8MW+YPpwW63+y6K4n65XIZ2uw3T6RQMw3jlef4oLB6ACSG1dDqt064rlQo4jgMMw3ybpvkWFp+FZV3XH+v1euDmm+ABmGqu675IknQwHA5jfj0sPgcTQvZc133O5/OR8DmYdrkNfCG8DXwpHBVfCUfB/4XXwS3L6mUymWP/I1oLXoWnUqmvYrEYk2W5l81mDz18bXgRTlFVVWONRgM4jgPbts8R8ZruDQX7cU3TBJ7ngaK+6L1DxLONYA+fTCZPgiCI/X7/1202m1AqlU4R0dgY9vDxePzQ6XROkskk5HK5C0S88roPPYrZXCaEcAAwmo3VyPCyD2Bn8A8S2gEmQxchowAAAABJRU5ErkJggg==") 5 5, auto`,
          }}
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleDown}
          onTouchStart={handleDown}
          onMouseUp={handleUp}
          onTouchEnd={handleUp}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          <Layer>
            {lines.map((line) => (
              <Line {...line} />
            ))}
          </Layer>
        </Stage>
      </Grid>
    </Grid>
  );
}

export default App;
