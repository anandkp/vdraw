import { Slider } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { FC } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    valueLabel: {
      // color: "#222",
      "& *": {
        background: "#fff",
        color: "#222",
      },
    },
  })
);

interface ISizeSelectorProps {
  onChange: (newValue: number) => void;
  sliderValue: number;
  max: number;
}
export const SizeSelector: FC<ISizeSelectorProps> = (props) => {
  const classes = useStyles();

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    props.onChange(newValue as number);
  };

  return (
    <div
      style={{
        // width: 50,
        height: 100,
        // marginTop: 20,
      }}
    >
      <Slider
        value={props.sliderValue}
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
        orientation="vertical"
        defaultValue={props.sliderValue}
        aria-labelledby="vertical-slider"
        min={1}
        max={props.max}
        style={{ color: "#fff" }}
        classes={{
          valueLabel: classes.valueLabel,
        }}
      />
    </div>
  );
};
