import { Grid, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CropFreeIcon from "@mui/icons-material/CropFree";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import Slider from "@mui/material/Slider";
import * as markerjs2 from "markerjs2";
import React, { useEffect, useState, useMemo } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useAppSelector, useAppDispatch } from "app/hooks";
import IconButton from "components/Core/IconButton";
import {
  setAnnotatedImage,
  setcurerentFrame,
  getSelectedVideoList,
  setPlayingVideoIndex,
  getPlayingVideoIndex,
  getSourceURL,
} from "store/preview-video/videoList";

const frameRate = 25;

function VideoPlayer() {
  const dispatch = useAppDispatch();
  const selectedVideos = useAppSelector(getSelectedVideoList);
  const playingVideoIndex = useAppSelector(getPlayingVideoIndex);
  const isSourceURLexist = useAppSelector(getSourceURL);

  const classes = useStyles();
  const [videoPlayers, setVideoPlayers] = useState<HTMLVideoElement[]>([]);
  const [playing, setPlaying] = useState(false);
  const [playerCurrentTime, setplayerCurrentTime] = useState<number>(0);
  const [playerDuration, setPlayerDuration] = useState<number>(0);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [showZoom, setshowZoom] = useState(false);
  const [imageForAnnotation, setImageForAnnotation] = useState<
    string | undefined
  >(undefined);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [timeUpdateTimeout, setTimeUpdateTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const playingVideoPlayer = useMemo(() => {
    return videoPlayers[
      selectedVideos.length > playingVideoIndex ? playingVideoIndex : 0
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoPlayers, playingVideoIndex]);

  function play() {
    setAnnotationMode(false);
    // videoPlayers.forEach(async player => player.play());
    playingVideoPlayer.play();
    setPlaying(true);
  }

  function togglePlay() {
    setPlaying(!playing);
  }

  function videoZoom() {
    setshowZoom(!showZoom);
  }

  function resetZoom() {
    const resetButton = document.getElementById("reset_zoom");
    if (!resetButton) return;
    resetButton.click();
    setTimeout(videoZoom, 300);
  }

  function pause() {
    videoPlayers.forEach(async player => player.pause());
    playingVideoPlayer.pause();
    setPlaying(false);
  }

  function setVideoTime(currentTime: number) {
    videoPlayers.forEach(async player => {
      player.currentTime = currentTime / 1000;
    });
    setplayerCurrentTime(currentTime);
  }

  async function handlerVideoChange(index: number) {
    const { currentTime } = playingVideoPlayer;

    const player = videoPlayers[index];
    player.currentTime = currentTime;
    if (playing) player.play();
    else player.pause();
    dispatch(setPlayingVideoIndex(index));
  }

  async function handleAnnotationMode() {
    await setAnnotationMode(true);

    const canvas = document.getElementById(
      "video-player-canvas",
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(playingVideoPlayer, 0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = canvas.toDataURL("image/jpeg");
    await setImageForAnnotation(image.src);

    const markerArea = new markerjs2.MarkerArea(
      document.getElementById("image-for-annotation") as HTMLElement,
    );
    markerArea.addEventListener("render", event => {
      // we are setting the markup result to replace our original image on the page
      // but you can set a different image or upload it to your server
      // document.getElementById('myimg').src = event.dataUrl;
      setImageForAnnotation(event.dataUrl);
      dispatch(setAnnotatedImage(event.dataUrl));
    });

    markerArea.show();
  }

  function togglePlayPause() {
    return playing ? pause() : play();
  }

  function updateSeekbarData() {
    if (!playingVideoPlayer) return;
    const { currentTime, duration } = playingVideoPlayer;
    setplayerCurrentTime(currentTime * 1000);
    if (isNaN(duration)) return;
    setPlayerDuration(duration * 1000);
  }
  // console.log(browserProp, coords, globalCoords);

  useEffect(() => {
    setWidth(document.querySelector("#player-actions")?.clientWidth || 900);
  }, []);

  useEffect(() => {
    setVideoPlayers([]);
    selectedVideos.forEach(previewVideo => {
      const video = document.getElementById(
        previewVideo.id,
      ) as HTMLVideoElement;
      video.addEventListener("loadedmetadata", e => {
        setHeight((video.videoHeight / (video.videoWidth || 1)) * width);
      });
      setVideoPlayers(previousValues => [...previousValues, video]);
    });
    if (selectedVideos.length > 0 && isSourceURLexist) {
      const video = document.getElementById(
        selectedVideos[0].shotDetails.id,
      ) as HTMLVideoElement;
      video.addEventListener("loadedmetadata", e => {
        setHeight((video.videoHeight / (video.videoWidth || 1)) * width);
      });
      setVideoPlayers(previousValues => [video, ...previousValues]);
      // eslint-disable-next-line no-console
      console.log(isSourceURLexist);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideos, width]);
  useEffect(() => {
    // eslint-disable-next-line func-names
    window.onkeypress = async function ({ key }) {
      if (document.activeElement?.className.indexOf("commentArea") !== -1) {
        return;
      }
      if (key === " ") {
        togglePlayPause();
      }

      if (!["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) return;
      if (!playingVideoPlayer) return;
      const index = parseInt(key, 10) - 1;
      handlerVideoChange(index);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingVideoPlayer, videoPlayers, playing]);

  useEffect(() => {
    if (timeUpdateTimeout) clearInterval(timeUpdateTimeout);
    setTimeUpdateTimeout(
      setInterval(
        updateSeekbarData,
        Math.round(Math.round(playerDuration) / (1000 / frameRate)),
      ),
    );
    const currrentFrame =
      Math.round(Math.round(playerCurrentTime) / (1000 / frameRate)) === 0
        ? Math.round(Math.round(playerCurrentTime) / (1000 / frameRate)) + 1
        : Math.round(Math.round(playerCurrentTime) / (1000 / frameRate));
    dispatch(setcurerentFrame(currrentFrame));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingVideoPlayer, playing, playerCurrentTime]);
  return (
    <Grid container className={classes.root}>
      <Grid item md={12} className={classes.videoButtons}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          {selectedVideos.map((video, index) => (
            <Grid
              item
              md="auto"
              key={
                isSourceURLexist && index === 0
                  ? video.shotDetails.id
                  : video.id
              }
            >
              <Button
                size="small"
                color="primary"
                variant={index === playingVideoIndex ? "contained" : "text"}
                className={classes.videoSelectButton}
                onClick={() => {
                  handlerVideoChange(index);
                }}
              >
                {index === 0 && isSourceURLexist ? (
                  <Typography
                    variant="body2"
                    style={
                      {
                        // color: index === playingVideoIndex ? "black" : "white",
                      }
                    }
                  >
                    Source - 1
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    style={
                      {
                        // color: index === playingVideoIndex ? "black" : "white",
                      }
                    }
                  >
                    {index + 1} -{" "}
                    {`v${video.versionNumber} - ${playingVideoIndex}`}
                  </Typography>
                )}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {selectedVideos.length > 0 ? (
        <Grid item md={12}>
          <Grid
            container
            style={{
              display: annotationMode ? "none" : "inline",
            }}
            justifyContent="center"
          >
            <TransformWrapper maxScale={100} disabled={!showZoom}>
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <>
                  <div className="tools">
                    <Button
                      onClick={() => resetTransform()}
                      id="reset_zoom"
                      style={{ display: "none" }}
                    >
                      x
                    </Button>
                  </div>
                  <TransformComponent>
                    {selectedVideos.map((previewVideo, i) => (
                      <Grid
                        item
                        key={
                          isSourceURLexist && i === 0
                            ? previewVideo.shotDetails.id
                            : previewVideo.id
                        }
                        md="auto"
                        onClick={() => togglePlay()}
                        style={{ overflow: "hidden" }}
                      >
                        <video
                          id={
                            isSourceURLexist && i === 0
                              ? previewVideo.shotDetails.id
                              : previewVideo.id
                          }
                          loop
                          preload="auto"
                          style={{
                            display:
                              i === playingVideoIndex ? "inline" : "none",
                            margin: "auto",
                            cursor: showZoom ? "zoom-in" : "pointer",
                            position: "relative",
                            width: "100%",
                          }}
                          height={height}
                          width={width}
                          crossOrigin="anonymous"
                          onClick={togglePlayPause}
                        >
                          <source
                            src={
                              isSourceURLexist && i === 0
                                ? previewVideo.shotDetails.sourceURL
                                : previewVideo.deliveryDetails.video
                            }
                            type="video/webm"
                          />
                          <source
                            src={
                              isSourceURLexist && i === 0
                                ? previewVideo.shotDetails.sourceURL
                                : previewVideo.deliveryDetails.video
                            }
                            type="video/mp4"
                          />
                          <track
                            src="captions_en.vtt"
                            kind="captions"
                            srcLang="en"
                            label="english_captions"
                          />
                        </video>
                      </Grid>
                    ))}
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </Grid>
          <canvas
            id="video-player-canvas"
            width={width}
            height={height}
            style={{ display: "none" }}
          />
          <img
            id="image-for-annotation"
            src={imageForAnnotation}
            width={width}
            height={height}
            style={{ display: annotationMode ? "inline" : "none" }}
            alt=""
          />
        </Grid>
      ) : (
        <div
          style={{
            color: "brown",
            textAlign: "center",
            width: "100%",
            fontFamily: "Poppins-Light",
            minHeight: "75vh",
          }}
        >
          <img
            src="loading.gif"
            alt="loading"
            style={{ width: "30px", verticalAlign: "middle" }}
          />
          <div>please wait while we load the content!</div>
        </div>
      )}
      <Grid
        item
        md={12}
        id="player-actions"
        className={classes.playerActionBar}
      >
        {playingVideoPlayer ? (
          <Grid>
            <Slider
              id="video_slider"
              aria-label="Seekbar"
              defaultValue={0}
              step={
                playerDuration /
                Math.floor(Math.round(playerDuration) / (1000 / frameRate))
              }
              min={0}
              value={playerCurrentTime}
              max={playerDuration} // milliseconds
              onChange={event => {
                setVideoTime(
                  parseFloat((event.target as HTMLInputElement).value),
                );
              }}
            />
          </Grid>
        ) : null}
        <Grid
          container
          className={classes.playerButtonSection}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item md={3}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                {playing ? (
                  <IconButton Icon={PauseIcon} onClick={() => pause()} />
                ) : (
                  <IconButton Icon={PlayArrowIcon} onClick={() => play()} />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={2}>
            <Typography variant="body1">
              {Math.round(
                Math.round(playerCurrentTime) / (1000 / frameRate),
              ) === 0
                ? Math.round(
                    Math.round(playerCurrentTime) / (1000 / frameRate),
                  ) + 1
                : Math.round(
                    Math.round(playerCurrentTime) / (1000 / frameRate),
                  )}{" "}
              / {Math.round(Math.round(playerDuration) / (1000 / frameRate))}
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              {(isSourceURLexist && playingVideoIndex !== 0) ||
              !isSourceURLexist ? (
                <Grid item>
                  {annotationMode ? (
                    <IconButton
                      Icon={BorderColorIcon}
                      onClick={() => {
                        setAnnotationMode(false);
                      }}
                    />
                  ) : (
                    <IconButton
                      Icon={ModeEditIcon}
                      onClick={() => {
                        handleAnnotationMode();
                      }}
                    />
                  )}
                </Grid>
              ) : null}

              {showZoom ? (
                <Grid item>
                  <IconButton
                    Icon={RestartAltIcon}
                    onClick={() => resetZoom()}
                  />
                </Grid>
              ) : (
                <Grid item>
                  <IconButton Icon={SearchIcon} onClick={() => videoZoom()} />
                </Grid>
              )}

              <Grid item>
                <IconButton
                  Icon={CropFreeIcon}
                  onClick={() => {
                    playingVideoPlayer.requestFullscreen();
                  }}
                />
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
    background: theme.palette.background.default,
  },
  playerActionBar: {
    marginTop: 10,
  },
  playerButtonSection: {
    backgroundColor: "#292929",
    padding: 0,
  },
  videoSelectButton: {
    border: "1px solid #FFF",
  },
  videoButtons: {
    marginBottom: 10,
  },
}));

export default VideoPlayer;
