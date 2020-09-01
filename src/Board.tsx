import React, {
  useRef,
  useState,
  ChangeEvent,
  useEffect,
  memo,
  useReducer,
  FC,
} from "react";
import { Stage, Layer, Line, Text, Image } from "react-konva";
import Konva from "konva";
import { Grid, IconButton } from "@material-ui/core";
import { ReactComponent as EraserIcon } from "assets/images/eraser.svg";
import { ReactComponent as AddTextIcon } from "assets/images/format-text.svg";
import { Create as CreateIcon } from "@material-ui/icons";
import { findLastIndex, cloneDeep } from "lodash";
import useImage from "use-image";

const CustomImage = memo(({ src }: any) => {
  const [image, status] = useImage(src);
  //   const image = (
  //     <img src="blob:http://localhost:3000/92aef405-889a-4be6-af6f-829a5312a2a2"></img>
  //   );
  console.log("<SRC>", image);

  return (
    <Image x={Math.random() * 100} y={Math.random() * 100} image={image} />
  );
});

interface IObject {
  type: string;
  property: any;
}

interface IBoardState {
  objects: IObject[];
}
const initialState: IBoardState = {
  objects: [
    {
      type: "text",
      property: {
        text: "Scrib.ink",
        x: 10,
        y: 10,
        fontSize: 20,
        draggable: true,
        width: 200,
      },
    },
  ],
};
const reducer = (state: IBoardState, action: any): IBoardState => {
  switch (action.type) {
    case "addObjects": {
      return {
        ...state,
        objects: [...state.objects, action.payload],
      };
    }
    case "setObjects": {
      return {
        ...state,
        objects: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export const Board: FC = () => {
  const [state, dispatch] = useReducer(reducer, cloneDeep(initialState));

  const setState = (type: string, payload?: any) => {
    dispatch({
      type,
      payload,
    });
  };

  const stageRef = useRef(null);
  //   console.log("app loaded.....");
  //   const [objects, setObjects] = useState<IObject[]>([
  //     {
  //       type: "text",
  //       property: {
  //         text: "Scrib.ink",
  //         x: 10,
  //         y: 10,
  //         fontSize: 20,
  //         draggable: true,
  //         width: 200,
  //       },
  //     },
  //   ]);
  //   const [images, setImages] = useState<IObject[]>([]);

  const [isPaint, setIsPaint] = useState(false);
  const [mode, setMode] = useState("brush");
  // const [image, setImage] = useState();
  // const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string>("default");

  const cursors = {
    text: "text",
    line: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABh0lEQVRIS7XVv2vCQBQH8PdwEYdO2SJFcAtSkiFubY0UUvIfhOLi0CVzUQhOilrsf9Ct2NKlqzSkkO5CoZZkECQW7OrQwUFor1whJfFXjdGb7z7v3YP7HsKOFnouIYRFxI9t1fHDtcFgoLIsex+Px28R0YlSxA9z1WrVbrVaUCgUQFGUkSRJN4lE4hIRP8MW+YPpwW63+y6K4n65XIZ2uw3T6RQMw3jlef4oLB6ACSG1dDqt064rlQo4jgMMw3ybpvkWFp+FZV3XH+v1euDmm+ABmGqu675IknQwHA5jfj0sPgcTQvZc133O5/OR8DmYdrkNfCG8DXwpHBVfCUfB/4XXwS3L6mUymWP/I1oLXoWnUqmvYrEYk2W5l81mDz18bXgRTlFVVWONRgM4jgPbts8R8ZruDQX7cU3TBJ7ngaK+6L1DxLONYA+fTCZPgiCI/X7/1202m1AqlU4R0dgY9vDxePzQ6XROkskk5HK5C0S88roPPYrZXCaEcAAwmo3VyPCyD2Bn8A8S2gEmQxchowAAAABJRU5ErkJggg==") 4 4, auto`,
  };

  const pasteImage = (e: Event) => {
    console.log(state.objects);

    const { clipboardData } = e as ClipboardEvent;
    const items = clipboardData?.items;

    e.preventDefault();
    e.stopPropagation();
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === -1) continue;
        const file = items[i];

        const imageData = file.getAsFile();
        const URLobj = window.URL || window.webkitURL;
        const src = URLobj.createObjectURL(imageData);

        setState("addObjects", {
          type: "image",
          property: { src },
        });
      }
    }
  };

  useEffect(() => {
    console.log("useeffect");
    window.addEventListener("paste", pasteImage);

    return () => {
      window.removeEventListener("paste", pasteImage);
    };
  }, []);

  const handleDown = () => {
    setIsPaint(true);
    var pos = ((stageRef.current as unknown) as Konva.Stage).getPointerPosition();
    if (pos !== null) {
      const line = {
        type: "line",
        property: {
          stroke: "#ff0000",
          strokeWidth: 2,
          globalCompositeOperation:
            mode === "brush" ? "source-over" : "destination-out",
          points: [pos.x, pos.y],
        },
      };
      setCursor(cursors.line);

      setState("addObjects", line);
    }
  };

  const handleUp = () => {
    setIsPaint(false);
    setCursor("default");
  };

  const handleMove = () => {
    if (!isPaint) {
      return;
    }

    const pos = ((stageRef.current as unknown) as Konva.Stage).getPointerPosition();
    if (pos !== null) {
      const newObjects = state.objects.slice();
      const lineIndex = findLastIndex(state.objects, (o) => o.type === "line");
      let line = state.objects[lineIndex];
      line.property.points = line.property.points.concat([pos.x, pos.y]);
      newObjects.splice(lineIndex, 1, line);
      setState("setObjects", newObjects);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setMode(e.target.value);

  const handleAddText = () => {
    const text = {
      type: "text",
      property: {
        text: "Some text here",
        x: 50,
        y: 80,
        fontSize: 20,
        draggable: true,
        width: 200,
        onDragStart: () => {
          setCursor("move");
          // setIsDragging(true);
        },
        onDragEnd: (e: any) => {
          setCursor("default");
          // setIsDragging(false);
        },
      },
    };

    setState("addObjects", text);
  };

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
        <IconButton onClick={handleAddText}>
          <AddTextIcon />
        </IconButton>

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
            cursor: cursor,
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
            {state.objects
              .filter((e) => e.type === "line")
              ?.map((line: IObject) => (
                <Line {...line.property} />
              ))}
            {state.objects
              .filter((e) => e.type === "text")
              ?.map((text: IObject) => (
                <Text {...text.property} />
              ))}
            {state.objects
              .filter((e) => e.type === "image")
              ?.map((image: IObject) => (
                <CustomImage src={image.property.src} />
              ))}
          </Layer>
        </Stage>
      </Grid>
    </Grid>
  );
};
