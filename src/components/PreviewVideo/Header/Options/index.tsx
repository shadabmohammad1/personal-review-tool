import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";
import IconButton from "components/Core/IconButton";
import {
  openSidebar,
  closeSidebar,
  sidebarOpen,
} from "store/preview-video/videoList";

import AllVideosModal from "./AllVideosModal";

export default function Options() {
  const dispatch = useAppDispatch();
  const isSidebarOpened = useAppSelector(sidebarOpen);
  const classes = useStyles();
  const [open, setModalOpen] = useState(false);
  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = () => setModalOpen(true);

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      className={classes.root}
      spacing={2}
    >
      <Grid item onClick={() => copy()}>
        <IconButton
          Icon={ShareOutlinedIcon}
          variant="outlined"
          color="secondary"
        />
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.compareButton}
          onClick={() => handleModalOpen()}
        >
          Compare
        </Button>
        <AllVideosModal open={open} handleClose={handleModalClose} />
      </Grid>
      <Grid item>
        <IconButton
          Icon={TableChartOutlinedIcon}
          variant="outlined"
          color="secondary"
          onClick={() =>
            isSidebarOpened ? dispatch(closeSidebar()) : dispatch(openSidebar())
          }
        />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  root: {},
  compareButton: {
    padding: "5px 40px",
    "& .MuiButton-label": {
      textTransform: "none",
    },
  },
}));
