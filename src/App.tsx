import React, { useState, MouseEvent } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Board } from "./Board";
import {
  AppBar,
  Typography,
  Toolbar,
  Grid,
  IconButton,
  Tooltip,
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
  Slider,
  Divider,
  Button,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import {
  Crop169 as Crop169Icon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  BorderColor as BorderColorIcon,
  OpenWith as OpenWithIcon,
  CropSquare as CropSquareIcon,
  GroupAdd as GroupAddIcon,
  Palette as PaletteIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  TextFields as TextFieldsIcon,
  TextFormat as TextFormatIcon,
  Create as CreateIcon,
  GetApp as GetAppIcon,
} from "@material-ui/icons";
import { ReactComponent as LogoIcon } from "assets/images/fountain-pen-tip.svg";
import { ReactComponent as EraserIcon } from "assets/images/eraser.svg";
import { ReactComponent as EllipseIcon } from "assets/images/ellipse-outline.svg";
import { CirclePicker, ColorResult } from "react-color";
import { Action } from "./Action";

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

const toggleStyles = makeStyles(
  {
    root: {
      backgroundColor: "#222",
      "&:hover": {
        backgroundColor: "#ff0000",
      },
      // "&:focus": {
      //   backgroundColor: "#c4c4c4",
      // },
      "&:active": {
        backgroundColor: "blue",
      },
      "&:visited": {
        backgroundColor: "green",
      },
    },
    label: {
      /* … */
    },
    outlined: {
      /* … */
      "&$disabled": {
        /* … */
      },
    },
    outlinedPrimary: {
      /* … */
      "&:hover": {
        color: "#ff0000",
      },
    },
    disabled: {},
  },
  { name: "MuiButton" }
);

export const App = () => {
  const classes = useStyles();
  // const toggleClass = toggleStyles();

  const [mode, setMode] = useState("brush");
  const [color, setColor] = useState<string>("#f44336");

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [popperSource, setPopperSource] = useState("swatch");

  const [sliderValue, setSliderValue] = useState<number>(2);

  // console.log("mode--->", mode, color);
  const handleModeChange = (
    nextView: string,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setMode(nextView);
    if (nextView === "brush") {
      setSliderValue(2);
    } else if (nextView === "erase") {
      setSliderValue(10);
    }

    if (["brush", "textTool", "erase"].includes(nextView)) {
      console.log("here");
      handleOpenPopper(nextView)(event);
    }
  };

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex);
  };

  const handleOpenPopper = (source: string) => (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setPopperSource(source);
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number);
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
            mode={mode}
            icon={OpenWithIcon}
            onClick={handleModeChange}
            toolTip="Move"
          />
          <Action
            id="brush"
            mode={mode}
            icon={CreateIcon}
            onClick={handleModeChange}
            toolTip="Pen Tool"
          />
          <Action
            id="textField"
            mode={mode}
            icon={TextFieldsIcon}
            onClick={handleModeChange}
            toolTip="TextField Tool"
          />
          <Action
            id="textTool"
            mode={mode}
            icon={TextFormatIcon}
            onClick={handleModeChange}
            toolTip="Text Tool"
          />
          <Action
            id="erase"
            mode={mode}
            icon={EraserIcon}
            onClick={handleModeChange}
            toolTip="Erase Tool"
          />
          <Action
            id="square"
            mode={mode}
            icon={CropSquareIcon}
            onClick={handleModeChange}
            toolTip="Square Tool"
          />
          <Action
            id="rect"
            mode={mode}
            icon={Crop169Icon}
            onClick={handleModeChange}
            toolTip="Rectangle Tool"
          />
          <Action
            id="circle"
            mode={mode}
            icon={RadioButtonUncheckedIcon}
            onClick={handleModeChange}
            toolTip="Circle Tool"
          />
          <Action
            id="ellipse"
            mode={mode}
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
          {mode !== "move" && (
            <Tooltip
              title="Choose Color"
              aria-label="Choose Color"
              placement="right"
            >
              <IconButton onClick={handleOpenPopper("swatch")}>
                <PaletteIcon
                  className={classes.iconButton}
                  style={{
                    fill: color,
                    backgroundColor:
                      color === "#000000" ? "#7a7a7a" : "inherit",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
          <Divider style={{ backgroundColor: "#535353", marginTop: 5 }} />
          {["brush", "erase", "textTool"].includes(mode) && (
            <div
              style={{
                width: 50,
                // border: "1px solid red",
                height: 100,
                marginTop: 20,
              }}
            >
              <Slider
                value={sliderValue}
                valueLabelDisplay="auto"
                onChange={handleSliderChange}
                orientation="vertical"
                defaultValue={sliderValue}
                aria-labelledby="vertical-slider"
                min={1}
                max={mode === "erase" ? 100 : 10}
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
          <Board mode={mode} color={color} sliderValue={sliderValue} />
        </Grid>
      </Grid>

      <Popper
        open={open}
        anchorEl={anchorEl}
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
              onMouseLeave={() => setOpen(false)}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div>
                  {popperSource === "swatch" && (
                    <CirclePicker
                      color={color}
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
                  {popperSource === "brush" && <div>brush</div>}
                  {popperSource === "erase" && <div>erase</div>}
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};
