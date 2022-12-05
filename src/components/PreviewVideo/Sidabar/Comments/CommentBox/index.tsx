import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AttachFileIcon from "@mui/icons-material/AttachFile";
// import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Picker, { SKIN_TONE_LIGHT, IEmojiData } from "emoji-picker-react";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";
import IconButton from "components/Core/IconButton";
import {
  setAnnotatedImage,
  getsendingNote,
  setCommentText,
  getCommentText,
} from "store/preview-video/videoList";

interface Props {
  captureCanvasAndSend: (commentText: string) => void;
}

export default function CommentBox({ captureCanvasAndSend }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const isNoteSending = useAppSelector(getsendingNote);
  const commentText = useAppSelector(getCommentText);
  // const [commentText, setCommentText] = useState("");
  const [showEmojiBox, setShowEmojiBox] = useState(false);

  function onEmojiClick(data: IEmojiData) {
    dispatch(setCommentText(commentText + data.emoji));
  }
  function openFileUploadBx() {
    document.getElementById("file_upload_box")?.click();
  }
  const getBase64 = (file: Blob) => {
    return new Promise(resolve => {
      let baseURL;
      // Make new FileReader
      const reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (event: any) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    event.target.value = null;
    getBase64(fileObj)
      .then(result => {
        fileObj.base64 = result;
        dispatch(setAnnotatedImage(result));
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
    dispatch(setAnnotatedImage(fileObj));
  };

  return (
    <Grid container>
      <Grid item md={12}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <TextareaAutosize
            className={classes.commentArea}
            minRows={7}
            id="note_box"
            placeholder="Add a new comment or Annotation"
            value={commentText}
            onChange={({ target }) => dispatch(setCommentText(target.value))}
          />
        </Grid>
      </Grid>
      <Grid item md={12}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes.actions}
        >
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <input
                  id="file_upload_box"
                  style={{ display: "none" }}
                  type="file"
                  onChange={handleFileChange}
                />
                <IconButton
                  Icon={AttachFileIcon}
                  onClick={() => openFileUploadBx()}
                />
              </Grid>
              <Grid item>
                <IconButton
                  Icon={SentimentSatisfiedAltIcon}
                  onClick={() => setShowEmojiBox(!showEmojiBox)}
                />
              </Grid>
              {/* <Grid item>
                <IconButton Icon={AlternateEmailIcon} />
              </Grid> */}
              {/* <Grid item>
                <IconButton Icon={MicIcon} />
              </Grid> */}
            </Grid>
          </Grid>
          <Grid item className={classes.sendButton}>
            <Button
              disabled={isNoteSending}
              variant="contained"
              style={{ backgroundColor: "orange" }}
              startIcon={<SendIcon />}
              onClick={() => {
                captureCanvasAndSend(commentText);
                setShowEmojiBox(false);
              }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {showEmojiBox ? (
        <Picker
          onEmojiClick={(event, data) => onEmojiClick(data as IEmojiData)}
          disableAutoFocus
          native
          skinTone={SKIN_TONE_LIGHT}
        />
      ) : null}
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  commentArea: {
    width: "100%",
    height: "200px",
    backgroundColor: "#161616",
    fontFamily: "Poppins-Regular",
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "#3F3F3F",
    fontSize: 10,
    padding: 10,
    color: "#FFF",
    borderBottom: "none",
  },
  actions: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: "#161616",
    border: "1px solid #3F3F3F",
    borderTop: "none",
    // width: "95.3%",

    "& .MuiSvgIcon-root": {
      fontSize: 14,
    },
  },
  sendButton: {
    "& .MuiButtonBase-root": {
      backgroundColor: "#45A580",
      color: "#FFF",
      textTransform: "none",
    },
  },
}));
