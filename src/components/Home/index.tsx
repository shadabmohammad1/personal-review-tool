import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";

import { createSessionId } from "apis/previewVideo";
import { useAppDispatch, useAppSelector } from "app/hooks";
import PreviewVideo from "components/PreviewVideo/index";
import {
  videoListAsync,
  allVideosList,
  getApiStatus,
} from "store/preview-video/videoList";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  // bgcolor: "background.paper",
  border: "1px solid black",
  boxShadow: 24,
  p: 4,
  color: "brown",
  backgroundColor: "#c1c1c1",
  borderRadius: "10px",
};

function Home() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const allVideos = useAppSelector(allVideosList);
  const apiStatus = useAppSelector(getApiStatus);

  async function createSession() {
    const ott = new URLSearchParams(window.location.search).get("ott");
    await createSessionId(ott);
  }

  useEffect(() => {
    dispatch(videoListAsync());
    createSession();
  }, [dispatch, allVideos]);

  return (
    <Grid container className={classes.root}>
      <PreviewVideo />
      {apiStatus && (
        <Modal
          open={apiStatus}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{ background: "#333" }}
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ color: "brown" }}
            >
              Permission denied!
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
              style={{ color: "#333" }}
            >
              Sorry! you are not authorized to see this content. Please reach
              out to{" "}
              <a
                href="mailto:support@thehotspring.com"
                style={{ color: "#333" }}
              >
                support@thehotspring.com
              </a>{" "}
              in case of any questions or concerns.
            </Typography>
          </Box>
        </Modal>
      )}
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    background: theme.palette.background.default,
    padding: 0,
  },
}));

export default Home;
