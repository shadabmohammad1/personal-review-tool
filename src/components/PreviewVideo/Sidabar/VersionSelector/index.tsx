import {
  Grid,
  Typography,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import moment from "moment";
import React, { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";
import Link from "components/Core/Link";
import {
  // currentIndex,
  setSelectedVideos,
  versionSelectorOpen,
  openVersionSelector,
  closeVersionSelector,
  getSelectedShotVideos,
} from "store/preview-video/videoList";

export default function VersionSelector() {
  // const index = useAppSelector(currentIndex);
  //   const video = useAppSelector(getPlayingVideo);
  const selectedVideos = useAppSelector(getSelectedShotVideos);
  const isversionSelectorOpen = useAppSelector(versionSelectorOpen);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [viewmore, setViewMore] = useState(false);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [showMorevideoIds, setshowMorevideoIds] = useState<string[]>([]);

  const handleViewMore = (videoId: string) => {
    setViewMore(!viewmore);
    if (showMorevideoIds.includes(videoId)) {
      const previousVideoIds = [...showMorevideoIds];
      previousVideoIds.splice(previousVideoIds.indexOf(videoId), 1);
      setshowMorevideoIds([...previousVideoIds]);
    } else {
      setshowMorevideoIds([...showMorevideoIds, videoId]);
    }
  };
  const formatDate = (dateString: string) => {
    return moment(new Date(dateString).toUTCString()).format(
      "MMM DD YYYY hh:mm a",
    );
  };
  const addVideoId = (videoId: string) => {
    setVideoIds([...videoIds, videoId]);
  };

  const removeVideoId = (videoId: string) => {
    const previousVideoIds = [...videoIds];
    previousVideoIds.splice(previousVideoIds.indexOf(videoId), 1);
    setVideoIds([...previousVideoIds]);
  };

  useEffect(() => {
    dispatch(setSelectedVideos(videoIds));
  }, [dispatch, videoIds]);

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
              label="Back"
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
            justifyContent="center"
            alignItems="center"
          >
            {selectedVideos.map((video, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item md={8} key={index}>
                <Grid container justifyContent="flex-start" spacing={1}>
                  <Grid item md={2}>
                    <span key={video.id}>
                      <FormControlLabel
                        style={{ color: "#378FF8" }}
                        control={
                          <Checkbox
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                            className={classes.checkbox}
                            value={video.id}
                            onChange={({ target }) =>
                              target.checked
                                ? addVideoId(target.value)
                                : removeVideoId(target.value)
                            }
                          />
                        }
                        label={undefined}
                      />
                    </span>
                  </Grid>
                  <Grid item md={10} style={{ paddingTop: 15 }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      {/* <LocalMoviesIcon className={classes.icon} /> */}
                      <Typography variant="subtitle2">
                        {video.shotDetails?.name} v{video.versionNumber}
                      </Typography>
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
                    {showMorevideoIds.includes(video.id) ? (
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
                        onClick={() => handleViewMore(video.id)}
                        style={{
                          color: "#6BAFFF",
                          paddingLeft: 0,
                        }}
                      >
                        {showMorevideoIds.includes(video.id)
                          ? "View Less"
                          : "View More"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider
                  style={{
                    width: "100%",
                    backgroundColor: "#606060",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              </Grid>
            ))}
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
  checkbox: {
    color: "#378FF8",
  },
  videoDiveder: {
    backgroundColor: "#3A3A3A",
  },
}));
