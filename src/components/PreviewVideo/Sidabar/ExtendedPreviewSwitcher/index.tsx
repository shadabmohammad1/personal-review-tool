import { Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import moment from "moment";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";
import IconButton from "components/Core/IconButton";
import Link from "components/Core/Link";
import {
  // currentIndex,
  getPlayingVideo,
  versionSelectorOpen,
  openVersionSelector,
  closeVersionSelector,
  setNextVideo,
  setPreviousVideo,
  getSelectedVideoList,
  getPlayingVideoIndex,
  getSourceURL,
} from "store/preview-video/videoList";

export default function ExtendedPreviewSwitcher() {
  // const index = useAppSelector(currentIndex);
  const video = useAppSelector(getPlayingVideo);
  const selectedVideos = useAppSelector(getSelectedVideoList);
  const isversionSelectorOpen = useAppSelector(versionSelectorOpen);
  const playingVideoIndex = useAppSelector(getPlayingVideoIndex);
  const isSourceURLexist = useAppSelector(getSourceURL);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [viewmore, setViewMore] = useState(false);
  const [viewmoreContent, setViewMoreContent] = useState("View More");

  const handleViewMore = () => {
    setViewMore(!viewmore);
    if (viewmoreContent === "View More") {
      setViewMoreContent("View Less");
    } else {
      setViewMoreContent("View More");
    }
  };
  const formatDate = (dateString: string) => {
    return moment(new Date(dateString).toUTCString()).format(
      "MMM DD YYYY hh:mm a",
    );
  };
  return (
    <Grid container className={classes.root}>
      <Grid item md={12}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item md="auto">
            <Typography variant="subtitle2">
              Version ({selectedVideos.length})
            </Typography>
          </Grid>
          <Grid item md="auto">
            <Link
              label="View all"
              onClick={() =>
                isversionSelectorOpen
                  ? dispatch(closeVersionSelector())
                  : dispatch(openVersionSelector())
              }
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item md={12}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
              >
                <Grid item md={1}>
                  <IconButton
                    Icon={KeyboardArrowLeftIcon}
                    onClick={() => {
                      dispatch(setPreviousVideo(selectedVideos.length));
                    }}
                  />
                </Grid>
                <Grid item md={10}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {/* <LocalMoviesIcon className={classes.icon} /> */}
                    {isSourceURLexist && playingVideoIndex === 0 ? (
                      <Typography noWrap variant="subtitle2">
                        {video.shotDetails?.name}
                      </Typography>
                    ) : (
                      <Typography noWrap variant="subtitle2">
                        {video.shotDetails?.name} v{video.versionNumber}
                      </Typography>
                    )}
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ maxHeight: 20 }}
                  >
                    <Grid item md={3}>
                      <Typography variant="body2">Artist</Typography>
                    </Grid>
                    <Grid item md={1}>
                      <Typography variant="body2">:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Link label={video.shotDetails?.artist} />
                    </Grid>
                  </Grid>
                  {viewmore || (isSourceURLexist && playingVideoIndex) === 0 ? (
                    <>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ maxHeight: 20 }}
                      >
                        <Grid item md={3}>
                          <Typography variant="body2">Created On</Typography>
                        </Grid>
                        <Grid item md={1}>
                          <Typography variant="body2">:</Typography>
                        </Grid>
                        <Grid item md={8}>
                          <Link
                            label={formatDate(video.projectDetails.created)}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ maxHeight: 20 }}
                      >
                        <Grid item md={3}>
                          <Typography variant="body2">Project</Typography>
                        </Grid>
                        <Grid item md={1}>
                          <Typography variant="body2">:</Typography>
                        </Grid>
                        <Grid item md={8}>
                          <Link label={video.projectDetails.name} />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ maxHeight: 20 }}
                      >
                        <Grid item md={3}>
                          <Typography variant="body2">Shot</Typography>
                        </Grid>
                        <Grid item md={1}>
                          <Typography variant="body2">:</Typography>
                        </Grid>
                        <Grid item md={8}>
                          <Link label={video.shotDetails?.name} />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ maxHeight: 20 }}
                      >
                        <Grid item md={3}>
                          <Typography variant="body2">Vendor</Typography>
                        </Grid>
                        <Grid item md={1}>
                          <Typography variant="body2">:</Typography>
                        </Grid>
                        <Grid item md={8}>
                          <Link label={video.vendorDetails?.companyName} />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ maxHeight: 20 }}
                      >
                        <Grid item md={3}>
                          <Typography variant="body2">Service</Typography>
                        </Grid>
                        <Grid item md={1}>
                          <Typography variant="body2">:</Typography>
                        </Grid>
                        <Grid item md={8}>
                          <Link label={video.serviceDetails?.name} />
                        </Grid>
                      </Grid>
                    </>
                  ) : null}
                  <Grid container>
                    <Button
                      className={classes.viewmore}
                      variant="text"
                      onClick={() => handleViewMore()}
                      style={{
                        color: "#6BAFFF",
                        paddingLeft: 0,
                      }}
                    >
                      {viewmoreContent}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item md={1}>
                  <IconButton
                    Icon={KeyboardArrowRightIcon}
                    onClick={() =>
                      dispatch(setNextVideo(selectedVideos.length))
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: "0px !important",
    borderRadius: "5px !important",
  },
  icon: {
    color: "#D3D1D1",
  },
  viewmore: {
    color: "#6BAFFF",
    textTransform: "none",
    fontSize: 12,
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));
