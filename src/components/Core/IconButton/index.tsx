import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import classNames from "classnames";
import React from "react";

interface Props {
  Icon: typeof KeyboardArrowRightIcon;
  onClick?: () => void;
  fontSize?: "small" | "inherit" | "large" | "medium" | undefined;
  variant?: "text" | "outlined" | "contained" | undefined;
  color?: "inherit" | "default" | "primary" | "secondary" | undefined;
}

export default function IconButtonV2({
  Icon,
  fontSize,
  variant,
  color,
  onClick,
}: Props) {
  const classes = useStyles();
  return (
    <Button
      className={classNames([
        classes.root,
        variant === "outlined" ? classes.outlined : null,
      ])}
      variant={variant}
      color={color || "primary"}
      onClick={() => onClick && onClick()}
    >
      <Icon fontSize={fontSize || "medium"} className={classes.icon} />
    </Button>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#292929",
    borderRadius: "5px !important",
    minWidth: "30px",
    padding: "3px 5px",
  },
  outlined: {
    minWidth: "45px",
  },
  icon: {
    color: "#ffffff",
  },
}));
