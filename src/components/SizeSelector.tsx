import { Slider } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { FC } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    iconButton: {
      fill: "#fff",
    },
    iconButtonRoot: {
      borderRadius: 0,
    },
  })
);

interface ISizeSelectorProps {}
export const SizeSelector: FC<ISizeSelectorProps> = (props) => {
  const classes = useStyles();

  return (
    <div>test</div>
    // <div
    //   style={{
    //     width: 50,
    //     height: 100,
    //     marginTop: 20,
    //   }}
    // >
    //   <Slider
    //     value={sliderValue}
    //     valueLabelDisplay="auto"
    //     onChange={handleSliderChange}
    //     orientation="vertical"
    //     defaultValue={sliderValue}
    //     aria-labelledby="vertical-slider"
    //     min={1}
    //     max={mode === "erase" ? 100 : 10}
    //     style={{ marginLeft: 10, color: "#fff" }}
    //     classes={{
    //       valueLabel: classes.valueLabel,
    //     }}
    //   />
    // </div>
  );
};
