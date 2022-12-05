import { Grid, Avatar, Typography, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AttachmentIcon from "@mui/icons-material/Attachment";
// import PushPinIcon from "@mui/icons-material/PushPin";
// import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import moment from "moment";
import React from "react";

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface Note {
  id: string;
  noteType: string;
  createdBy: string;
  createdAt: string;
  attachments: Attachment[];
  note: string;
}

interface Props {
  // dp: string;
  // name: string;
  // content: string;
  // datetime: string;
  // tags: string[];
  // pinned: boolean;
  // liked: boolean;
  note: Note;
  deliverType: string;
}

function stringToColor(string: string) {
  if (string === "WIP") {
    return "blue";
  }
  if (string === "Correction") {
    return "#ec3c38";
  }
  if (string === "Semi-Approved") {
    return "green";
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

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function Comment({ note, deliverType }: Props) {
  const classes = useStyles();
  // const pinned = false;
  const tags = [deliverType, note.noteType];
  // const liked = false;
  const getAvatarText = () => {
    const acronym = note.createdBy.split(/\s/).reduce((response, word) => {
      response += word.slice(0, 1);
      return response.slice(0, 2);
    }, "");
    return acronym.toUpperCase();
  };
  const getName = () => {
    const acronym = note.createdBy
      .split(/\s/)
      .reduce((response, word, index) => {
        // eslint-disable-next-line no-console
        if (index === 0) {
          response = word;
        } else {
          response += ` ${word.slice(0, 1)}`;
        }
        return response;
      }, "");
    return acronym.toUpperCase();
  };
  const formatDate = (dateString: string) => {
    return moment(new Date(dateString).toUTCString()).format(
      "MMM DD YYYY hh:mm a",
    );
  };
  return (
    <Grid container style={{ paddingBottom: 10 }}>
      <Grid item md={12}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item md={11}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item md={1}>
                <Avatar
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...stringAvatar(note.createdBy)}
                >
                  {getAvatarText()}
                </Avatar>
              </Grid>
              <Grid item md={6} style={{ paddingLeft: 20 }}>
                <Typography
                  variant="body1"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {getName()}
                </Typography>
              </Grid>
              <Grid item md={5} style={{ textAlign: "end" }}>
                <Typography variant="caption" className={classes.datetime}>
                  {formatDate(note.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item md={1}>
            {pinned ? (
              <PushPinIcon className={classes.pinned} />
            ) : (
              <PushPinOutlinedIcon className={classes.notPinned} />
            )}
          </Grid> */}
        </Grid>
        <Grid container spacing={1} className={classes.contentSection}>
          <Grid item md={12}>
            <Grid container spacing={1}>
              {tags.map(tag => (
                <Grid item key={tag}>
                  <Chip
                    size="small"
                    label={tag}
                    className={classes.tag}
                    style={{ backgroundColor: stringToColor(tag) }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Typography
              variant="body2"
              style={{ paddingBottom: 10, fontSize: 13 }}
            >
              {note.note}
            </Typography>
            {note.attachments.map(attachment => {
              if (
                [".png", ".PNG", ".JPEG", ".JPG", ".jpeg", ".jpg"].some(
                  // eslint-disable-next-line func-names
                  function (v) {
                    return attachment.url.indexOf(v) >= 0;
                  },
                )
              ) {
                return (
                  <a
                    className={classes.downloadLink}
                    href={attachment.url}
                    title={attachment.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={attachment.id}
                  >
                    <Typography
                      variant="body2"
                      className={classes.attachmentsContainer}
                    >
                      <div>
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          height={100}
                        />
                      </div>
                    </Typography>
                  </a>
                );
              }
              return (
                <a
                  className={classes.downloadLink}
                  href={attachment.url}
                  title={attachment.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={attachment.id}
                >
                  <Typography
                    variant="body2"
                    className={classes.attachmentsContainer}
                  >
                    <div>
                      <AttachmentIcon style={{ verticalAlign: "middle" }} />
                      <span> {attachment.name}</span>
                    </div>
                  </Typography>
                </a>
              );
            })}
          </Grid>
          {/* {liked ? (
            <Grid item md={12} className={classes.likedIcon}>
              <Chip
                variant="outlined"
                size="small"
                icon={<ThumbUpIcon />}
                label={12}
              />
            </Grid>
          ) : (
            <Grid item md={12} className={classes.notLikedIcon}>
              <ThumbUpIcon />
            </Grid>
          )} */}
        </Grid>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    color: "#6BAFFF",
    textTransform: "none",
    fontSize: 12,
    "&:hover": {
      textDecoration: "underline",
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
  datetime: {
    color: "#7A7A7A",
  },
  contentSection: {
    marginLeft: 45,
  },
  pinned: {
    color: theme.palette.error.main,
    "&.MuiSvgIcon-root": {
      fontSize: 18,
      transform: "rotate(40deg)",
    },
  },
  notPinned: {
    color: theme.palette.grey.A700,
    "&.MuiSvgIcon-root": {
      fontSize: 18,
      transform: "rotate(40deg)",
    },
  },
  likedIcon: {
    "& .MuiChip-outlined": {
      borderColor: "#5182FF",
    },
    "& .MuiSvgIcon-root": {
      fontSize: 14,
      color: "#5182FF",
      paddingLeft: 3,
      cursor: "pointer",
    },
    "& .MuiChip-label": {
      color: "#FFF",
      cursor: "pointer",
    },
  },
  notLikedIcon: {
    "& .MuiSvgIcon-root": {
      fontSize: 14,
      cursor: "pointer",
    },
  },
  attachmentsContainer: {
    border: "rem(1) solid #e5e9eb",
    width: "fit-content",
    marginLeft: "rem(8)",
    fontSize: 12,

    "&:hover": {
      boxShadow: "0 1px 3px #999fa3",
    },
  },

  downloadLink: {
    textDecoration: "none",
  },
}));
