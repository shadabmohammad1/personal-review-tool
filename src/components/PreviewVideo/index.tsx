import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";
import Header from "components/PreviewVideo/Header";
import Sidebar from "components/PreviewVideo/Sidabar";
import VideoPlayer from "components/PreviewVideo/VideoPlayer";
import { sidebarOpen, videoListAsync } from "store/preview-video/videoList";

const drawerWidth = 500;

function Home() {
  const isSidebarOpened = useAppSelector(sidebarOpen);
  const classes = useStyles(isSidebarOpened);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(videoListAsync());
  }, [dispatch]);

  return (
    <Grid
      container
      className={classes.root}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
        md={9}
        className={classes.primarySection}
        style={{
          padding: 20,
          marginRight: isSidebarOpened ? `${drawerWidth}px` : `10px`,
        }}
      >
        <Grid container className={classes.headerSection}>
          <Grid item md={12}>
            <Header />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={12}>
            <VideoPlayer />
          </Grid>
        </Grid>
      </Grid>
      {isSidebarOpened ? (
        <Grid item md={3}>
          <Sidebar open={isSidebarOpened} />
        </Grid>
      ) : null}
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    background: theme.palette.background.default,
    padding: 10,
  },
  headerSection: {
    height: 100,
  },
  primarySection: isSidebarOpened => {
    return {
      padding: 20,
      marginRight: isSidebarOpened && `${drawerWidth}px`,
    };
  },
}));

export default Home;
