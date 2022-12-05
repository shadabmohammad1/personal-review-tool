import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  border: {
    borderBottom: "1px solid #3F3F3F",
    width: "100%",
  },
  content: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    fontWeight: 500,
    fontSize: 10,
    lineHeight: "15px",
    color: "#8B8B8B",
  },
}));

function DividerWithText({ shot, version }: { shot: string; version: string }) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.border} />
      <span className={classes.content}>
        {shot}v{version}
      </span>
      <div className={classes.border} />
    </div>
  );
}
export default DividerWithText;
