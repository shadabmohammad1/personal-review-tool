// import { useMutation } from "@apollo/client";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import CheckIcon from "@mui/icons-material/Check";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Button from "@mui/material/Button";
// import PushPinIcon from "@mui/icons-material/PushPin";
import Chip from "@mui/material/Chip";
// import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import React, { useState, useEffect } from "react";

import { createFeedbackNote, getPresignedURL } from "apis/previewVideo";
import { useAppSelector, useAppDispatch } from "app/hooks";
// import hotspringClient from "clients/hotspring";
import IconButton from "components/Core/IconButton";
import Comment from "components/PreviewVideo/Sidabar/Comments/Comment";
import CommentBox from "components/PreviewVideo/Sidabar/Comments/CommentBox";
import DividerWithText from "components/PreviewVideo/Sidabar/Comments/DividerWithText";
// import CreateFeedbackNoteMutation from "gql-queries/shot-versions";
import {
  getPlayingVideo,
  getAnnotatedImage,
  videoListAsync,
  getSelectedVideoList,
  getPlayingVideoIndex,
  getcurerentFrame,
  setsendingNote,
} from "store/preview-video/videoList";
// import theme from "theme";

// interface AnnotationCommentInterface {
//   text: string;
//   image: string | undefined;
// }
// interface Attachment {
//   id: string;
//   name: string;
//   url: string;
// }

// interface Note {
//   id: string;
//   noteType: string;
//   createdBy: string;
//   createdAt: string;
//   attachments: Attachment[];
//   note: string;
// }

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));
function stringToColor(string: string) {
  if (string === "WIP") {
    return "#C0A307";
  }
  if (string === "Correction") {
    return "#AD6019";
  }
  if (string === "Semi-Approved") {
    return "#527801";
  }
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 7) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 5)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export default function IconButtonV2() {
  const classes = useStyles();
  const selectedVideos = useAppSelector(getSelectedVideoList);
  const currrentFrame = useAppSelector(getcurerentFrame);
  const playingVideo = useAppSelector(getPlayingVideo);
  const playingVideoIndex = useAppSelector(getPlayingVideoIndex);
  const annotatedImage = useAppSelector(getAnnotatedImage);
  const dispatch = useAppDispatch();
  const tags = ["FINAL", "Correction", "Submission"];

  const [filterTags, setfilterTags] = useState<string[]>([]);
  const [filterNotes, setfilterNotes] = useState<string>(
    selectedVideos[playingVideoIndex].id,
  );
  const [isnewNote, setisnewNote] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectTag = (event: React.MouseEvent<HTMLLIElement>) => {
    const selectedTag = event.currentTarget.textContent;
    if (!selectedTag) return;
    if (!filterTags.includes(selectedTag)) {
      setfilterTags([...filterTags, selectedTag]);
    } else {
      setfilterTags(filterTags.filter(tag => tag !== selectedTag));
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    // setAge(event.target.value as string);
    if (!event.target.value) return;
    setfilterNotes(event.target.value);
  };

  const totalComments = () => {
    let commentCount = 0;
    selectedVideos.map(video => {
      video.shotNotes.map(() => {
        commentCount += 1;
      });
    });
    return commentCount;
  };

  function dataURItoBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
  // function getNewData() {
  //   const previews = graphqlClient
  //     .query({
  //       query: shotVersionsQuery,
  //       variables: {
  //         taskShotIds: new URLSearchParams(window.location.search).get(
  //           "taskShotIds",
  //         ),
  //       },
  //     })
  //     .then(res => res);
  //   return previews;
  // }

  async function captureCanvasAndSend(commentText: string) {
    // setAnnotationComment({
    //   text: commentText,
    //   image: annotatedImage,
    // });
    let imageBlob = null;
    let imageFile = null;
    const attachmentList = [];
    if (annotatedImage) {
      imageBlob = dataURItoBlob(annotatedImage);
      imageFile = new File([imageBlob], playingVideo.shotDetails.name, {
        type: imageBlob.type,
      });
      const preSignedData = await getPresignedURL(
        JSON.stringify({
          projectId: playingVideo.projectDetails.id,
          deliveryId: playingVideo.id,
          currrentFrame,
          file_name: imageFile.name,
          file_type: imageFile.type,
          image: annotatedImage,
        }),
      );
      // eslint-disable-next-line no-console
      attachmentList.push(preSignedData?.file_attachment_id);
    }
    if (annotatedImage) {
      commentText = `Frame ${currrentFrame} : ${commentText}`;
    }
    if (!(annotatedImage || commentText)) {
      return;
    }

    const userId = new URLSearchParams(window.location.search).get("userId");
    // eslint-disable-next-line no-console
    dispatch(setsendingNote(true));
    const newcomments = await createFeedbackNote(
      JSON.stringify({
        user_id: userId,
        note: commentText,
        task_shot_bid_delivery_id: playingVideo.id,
        attachments: attachmentList,
      }),
    );
    const error = "error" in newcomments;
    if (newcomments && !error) {
      setisnewNote(true);
      localStorage.setItem("fetch_data", "true");
    }
  }
  useEffect(() => {
    if (isnewNote) {
      dispatch(videoListAsync());
      setisnewNote(false);
    }
  }, [isnewNote, dispatch]);

  useEffect(() => {
    setfilterNotes(selectedVideos[playingVideoIndex].id);
  }, [playingVideoIndex, selectedVideos]);

  return (
    <Grid container className={classes.root}>
      <Grid item md={12}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ padding: 0 }}
        >
          <Grid item>
            <Typography variant="subtitle2">
              Comments ({totalComments()})
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <HtmlTooltip
                  title={
                    <>
                      <Typography color="inherit">Tooltip with HTML</Typography>
                      <em>And here's</em> <b>some</b> <u>amazing content</u>.
                      It's very engaging. Right?
                    </>
                  }
                >
                  <>
                    <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <IconButton Icon={FilterAltOutlinedIcon} />
                    </Button>

                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      className={classes.menu}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      {tags.map(tag => (
                        <ListItem
                          secondaryAction={
                            <CheckIcon
                              style={{
                                color:
                                  filterTags.indexOf(tag) !== -1 ? "green" : "",
                              }}
                            />
                          }
                          key={tag}
                          value={tag}
                          onClick={handleSelectTag}
                        >
                          <Chip
                            size="small"
                            label={tag}
                            className={classes.tag}
                            style={{ backgroundColor: stringToColor(tag) }}
                          />
                        </ListItem>
                      ))}
                    </Menu>
                  </>
                </HtmlTooltip>
              </Grid>
              {/*  <Grid item className={classes.pinIcon}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<PushPinIcon />}
                  size="small">
                  0 Pins
                </Button>
                 {comments.filter(comment => comment.pinned).length} Pins 
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={12} style={{ textAlign: "center", fontSize: 10 }}>
            <Select
              value={filterNotes}
              onChange={handleChange}
              MenuProps={{ classes: { paper: classes.select } }}
              sx={{
                "& .MuiSelect-select": {
                  padding: "5px",
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
              style={{
                color: "white",
                padding: 0,
                backgroundColor: "#3F3F3F",
                borderRadius: 20,
                fontSize: 10,
                width: "50%",
              }}
            >
              {selectedVideos.map(video => {
                return (
                  <MenuItem
                    key={video.id}
                    value={video.id}
                    style={{
                      color: "white",
                      fontSize: 10,
                      backgroundColor: "#282A31",
                    }}
                  >
                    {video.shotDetails?.name}v{video.versionNumber}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item md={12}>
            {selectedVideos
              .filter(video => {
                if (filterNotes.length === 0) {
                  return true;
                }
                return filterNotes === video.id;
              })
              .map(filterVideo => {
                return (
                  <span key={filterVideo.id}>
                    <span
                      id={`${filterVideo.shotDetails?.name}v${filterVideo.versionNumber}`}
                    >
                      <DividerWithText
                        shot={filterVideo.shotDetails.name}
                        version={filterVideo.versionNumber}
                      />
                    </span>
                    {filterVideo.shotNotes
                      .filter(note => {
                        if (filterTags.length === 0) {
                          return true;
                        }
                        return (
                          filterTags.includes(note.noteType) ||
                          filterTags.includes(filterVideo.deliveryType)
                        );
                      })
                      .map(filteredNote => {
                        return (
                          <span key={filteredNote.id}>
                            <Comment
                              note={filteredNote}
                              deliverType={filterVideo.deliveryType}
                            />
                          </span>
                        );
                      })}
                  </span>
                );
              })}
          </Grid>

          <CommentBox
            captureCanvasAndSend={commentText =>
              captureCanvasAndSend(commentText)
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 10,
  },
  pinIcon: {
    color: "#FF7C03",
    "& .MuiButton-outlined": {
      border: "1px solid #464646",
    },
    "& .MuiButton-root": {
      textTransform: "none",
    },
    "& .MuiSvgIcon-root": {
      transform: "rotate(40deg)",
    },
  },
  menu: {
    "& .MuiPaper-root": {
      backgroundColor: "#1C1E24",
      fontSize: 12,
      minWidth: 250,
    },
  },
  select: {
    "& ul": {
      backgroundColor: "#282A31",
    },
    "& li": {
      fontSize: 12,
    },
  },
  tag: {
    backgroundColor: "green ",
    "& .MuiChip-label": {
      fontSize: 10,
      fontWeight: 700,
      color: "#FFF",
    },
  },
  "& .MuiInputBase-input": {
    border: "0px",
  },
  "&:focus": {
    borderColor: "#3D3F44",
  },
  filterTag: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "5px !important",
    padding: 0,
    minWidth: 200,
  },
}));
