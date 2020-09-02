import { IconButton, Tooltip, SvgIconTypeMap } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { FC, SVGProps, MouseEvent } from "react";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

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
interface IActionProps {
  onClick: (nextView: string, event: MouseEvent<HTMLButtonElement>) => void;
  icon:
    | OverridableComponent<SvgIconTypeMap<{}, "svg">>
    | FC<SVGProps<SVGSVGElement>>;
  mode: string;
  id: string;
  toolTip?: string;
}
export const Action: FC<IActionProps> = (props) => {
  const classes = useStyles();

  const Icon = props.icon;

  return (
    <Tooltip
      title={props.toolTip !== undefined ? props.toolTip : ""}
      aria-label={props.toolTip !== undefined ? props.toolTip : ""}
      placement="right"
    >
      <IconButton
        onClick={(event: MouseEvent<HTMLButtonElement>) =>
          props.onClick(props.id, event)
        }
        style={{
          backgroundColor: props.mode === props.id ? "#7a7a7a" : "inherit",
        }}
        classes={{
          root: classes.iconButtonRoot,
        }}
      >
        <Icon className={classes.iconButton} />
      </IconButton>
    </Tooltip>
  );
};
