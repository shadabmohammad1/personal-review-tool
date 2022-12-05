import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useState, useMemo, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "app/hooks";
import IconButton from "components/Core/IconButton";
import { getAllShots, setSelectedShotId } from "store/preview-video/videoList";

export default function PreviewSwitcher() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const allShots = useAppSelector(getAllShots);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentShot = useMemo(
    () => allShots[currentIndex] || {},
    [currentIndex, allShots],
  );

  useEffect(() => {
    dispatch(setSelectedShotId(currentShot.id));
  }, [currentShot, dispatch]);

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item md="auto" className={classes.navigationButton}>
        <IconButton
          Icon={KeyboardArrowLeftIcon}
          onClick={() => {
            setCurrentIndex(
              (allShots.length + currentIndex - 1) % allShots.length,
            );
          }}
        />
      </Grid>
      <Grid item md={8}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body1" style={{ color: "#BAC1CE" }}>
            Project:
          </Typography>
          <Typography variant="body1">
            {" "}
            &nbsp;{currentShot.projectName}
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ padding: 10 }}
        >
          <Typography noWrap variant="subtitle1">
            {currentShot.name}
          </Typography>
        </Grid>
        {allShots.length > 0 ? (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="caption">
              {currentIndex + 1} / {allShots.length}
            </Typography>
          </Grid>
        ) : null}
      </Grid>
      <Grid item md="auto">
        <IconButton
          Icon={KeyboardArrowRightIcon}
          onClick={() => setCurrentIndex((currentIndex + 1) % allShots.length)}
        />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {},
  navigationButton: {
    // backgroundColor: theme.palette.background.paper,
  },
}));
