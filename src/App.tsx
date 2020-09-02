import {
  AppBar,
  Button,
  ClickAwayListener,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  Popper,
  Slider,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Create as CreateIcon,
  Crop169 as Crop169Icon,
  CropSquare as CropSquareIcon,
  GetApp as GetAppIcon,
  GroupAdd as GroupAddIcon,
  OpenWith as OpenWithIcon,
  Palette as PaletteIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Redo as RedoIcon,
  TextFields as TextFieldsIcon,
  TextFormat as TextFormatIcon,
  Undo as UndoIcon,
} from "@material-ui/icons";
import { ReactComponent as EllipseIcon } from "assets/images/ellipse-outline.svg";
import { ReactComponent as EraserIcon } from "assets/images/eraser.svg";
import { ReactComponent as LogoIcon } from "assets/images/fountain-pen-tip.svg";
import React, { MouseEvent, useState, useReducer } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { Action } from "./Action";
import { Board } from "./Board";
import { cloneDeep } from "lodash";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    pageContainer: {
      // minHeight: "100vh",
    },
    logo: {
      fill: "#f44336", // "#00ffa5",
      marginLeft: -10,
    },
    title: {
      flexGrow: 1,
      verticalAlign: "baseline",
      marginLeft: 10,
      color: "#f44336", // "#00ffa5",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    appBar: {
      background: `linear-gradient(90deg,${"#222"} 0%,${"#333"} 40%,${"#555"} 100%)`,
    },
    customizeToolbar: {
      // minHeight: 10,
      // paddingTop: 10,
    },
    leftMenu: {
      width: 50,
      height: "100vh",
      background: "#222",
      // border: "1px solid red",
      zIndex: 1,
    },
    board: {
      flexGrow: 1,
      // border: "1px solid blue",
    },
    iconButton: {
      fill: "#fff",
    },
    swatchContainer: {
      padding: theme.spacing(2),
      backgroundColor: "#484848",
    },
    toggleRoot: {
      color: "#ff0000",

      // "&:hover": {
      //   backgroundColor: "#ff0000",
      // },
      // backgroundColor: "#ff0000",
    },
    markLabel: {
      color: "#fff",
      fontSize: 10,
    },
    valueLabel: {
      // color: "#222",
      "& *": {
        background: "#fff",
        color: "#222",
      },
    },
  })
);

interface IAppState {
  mode: string;
  color: string;
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  popperSource: string;
  sliderValue: number;
}
const initialState: IAppState = {
  mode: "brush",
  color: "#f44336",
  anchorEl: null,
  open: false,
  popperSource: "swatch",
  sliderValue: 2,
};
const reducer = (state: IAppState, action: any): IAppState => {
  switch (action.type) {
    case "setMode": {
      return {
        ...state,
        mode: action.payload,
        sliderValue:
          action.payload === "brush"
            ? 2
            : action.payload === "erase"
            ? 10
            : state.sliderValue,
      };
    }
    case "setColor": {
      return {
        ...state,
        color: action.payload,
      };
    }
    case "setPopper": {
      return {
        ...state,
        popperSource: action.payload.source,
        anchorEl: action.payload.event,
        open: !state.open,
      };
    }
    case "setSliderValue": {
      return {
        ...state,
        sliderValue: action.payload,
      };
    }
    case "setOpen": {
      return {
        ...state,
        open: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export const App = () => {
  const classes = useStyles();

  const [state, dispatch] = useReducer(reducer, cloneDeep(initialState));

  const setState = (type: string, payload?: any) =>
    dispatch({
      type,
      payload,
    });

  // console.log("mode--->", mode, color);
  const handleModeChange = (
    nextView: string,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setState("setMode", nextView);

    if (["brush", "textTool", "erase"].includes(nextView)) {
      handleOpenPopper(nextView)(event);
    }
  };

  const handleColorChange = (color: ColorResult) => {
    setState("setColor", color.hex);
  };

  const handleOpenPopper = (source: string) => (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setState("setPopper", {
      source,
      event: event.currentTarget,
    });
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setState("setSliderValue", newValue as number);
  };

  return (
    <div className={classes.pageContainer}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar variant="dense" className={classes.customizeToolbar}>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
      <MenuIcon />
    </IconButton> */}
          <LogoIcon className={classes.logo} />
          <Typography variant="h6" color="inherit" className={classes.title}>
            Scrib.ink
          </Typography>

          <Tooltip title="Invite Others" aria-label="Invite Others">
            <IconButton>
              <GroupAddIcon className={classes.iconButton} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export" aria-label="Export">
            <IconButton>
              <GetAppIcon className={classes.iconButton} />
            </IconButton>
          </Tooltip>

          {/* <Button
            startIcon={<GroupAddIcon className={classes.iconButton} />}
            style={{ color: "#fff" }}
          >
            Invite Others
          </Button> */}
          <Button style={{ color: "#fff" }}>Login</Button>
        </Toolbar>
      </AppBar>
      <Grid container direction="row">
        <Grid item className={classes.leftMenu}>
          <Action
            id="move"
            mode={state.mode}
            icon={OpenWithIcon}
            onClick={handleModeChange}
            toolTip="Move"
          />
          <Action
            id="brush"
            mode={state.mode}
            icon={CreateIcon}
            onClick={handleModeChange}
            toolTip="Pen Tool"
          />
          <Action
            id="textField"
            mode={state.mode}
            icon={TextFieldsIcon}
            onClick={handleModeChange}
            toolTip="TextField Tool"
          />
          <Action
            id="textTool"
            mode={state.mode}
            icon={TextFormatIcon}
            onClick={handleModeChange}
            toolTip="Text Tool"
          />
          <Action
            id="erase"
            mode={state.mode}
            icon={EraserIcon}
            onClick={handleModeChange}
            toolTip="Erase Tool"
          />
          <Action
            id="square"
            mode={state.mode}
            icon={CropSquareIcon}
            onClick={handleModeChange}
            toolTip="Square Tool"
          />
          <Action
            id="rect"
            mode={state.mode}
            icon={Crop169Icon}
            onClick={handleModeChange}
            toolTip="Rectangle Tool"
          />
          <Action
            id="circle"
            mode={state.mode}
            icon={RadioButtonUncheckedIcon}
            onClick={handleModeChange}
            toolTip="Circle Tool"
          />
          <Action
            id="ellipse"
            mode={state.mode}
            icon={EllipseIcon}
            onClick={handleModeChange}
            toolTip="Ellipse Tool"
          />

          <Tooltip title="Undo" aria-label="Undo" placement="right">
            <IconButton onClick={() => {}}>
              <UndoIcon className={classes.iconButton} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo" aria-label="Redo" placement="right">
            <IconButton onClick={() => {}}>
              <RedoIcon className={classes.iconButton} />
            </IconButton>
          </Tooltip>
          {state.mode !== "move" && (
            <Tooltip
              title="Choose Color"
              aria-label="Choose Color"
              placement="right"
            >
              <IconButton onClick={handleOpenPopper("swatch")}>
                <PaletteIcon
                  className={classes.iconButton}
                  style={{
                    fill: state.color,
                    backgroundColor:
                      state.color === "#000000" ? "#7a7a7a" : "inherit",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
          <Divider style={{ backgroundColor: "#535353", marginTop: 5 }} />
          {["brush", "erase", "textTool"].includes(state.mode) && (
            <div
              style={{
                width: 50,
                // border: "1px solid red",
                height: 100,
                marginTop: 20,
              }}
            >
              <Slider
                value={state.sliderValue}
                valueLabelDisplay="auto"
                onChange={handleSliderChange}
                orientation="vertical"
                defaultValue={state.sliderValue}
                aria-labelledby="vertical-slider"
                min={1}
                max={state.mode === "erase" ? 100 : 10}
                style={{ marginLeft: 10, color: "#fff" }}
                classes={{
                  // markLabel: classes.markLabel,
                  valueLabel: classes.valueLabel,
                }}
              />
            </div>
          )}
        </Grid>
        <Grid item className={classes.board} xs={11}>
          <Board
            mode={state.mode}
            color={state.color}
            sliderValue={state.sliderValue}
          />
        </Grid>
      </Grid>

      <Popper
        open={state.open}
        anchorEl={state.anchorEl}
        placement={"left"}
        transition
        disablePortal={false}
        modifiers={{
          flip: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: "scrollParent",
          },
          // arrow: {
          //   enabled: true,
          //   element: arrowRef,
          // },
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              className={classes.swatchContainer}
              onMouseLeave={() => setState("setOpen", false)}
            >
              <ClickAwayListener onClickAway={() => setState("setOpen", false)}>
                <div>
                  {state.popperSource === "swatch" && (
                    <CirclePicker
                      color={state.color}
                      onChangeComplete={handleColorChange}
                      colors={[
                        "#f44336",
                        "#e91e63",
                        "#9c27b0",
                        "#673ab7",
                        "#3f51b5",
                        "#2196f3",
                        "#03a9f4",
                        "#00bcd4",
                        "#009688",
                        "#4caf50",
                        "#8bc34a",
                        "#cddc39",
                        "#ffeb3b",
                        "#ffc107",
                        "#ff9800",
                        "#ff5722",
                        "#795548",
                        "#000000",
                      ]}
                    />
                  )}
                  {state.popperSource === "brush" && <div>brush</div>}
                  {state.popperSource === "erase" && <div>erase</div>}
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};
