import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { RootState } from "app/store";
import graphqlClient from "clients/graphql";
import shotVersionsQuery from "gql-queries/shot-versions";
import { PreviewVideoListType, ShotInterface } from "models/PreviewVideo";

export interface PreviewVideoState {
  allPreviews: PreviewVideoListType;
  selectedVideoList: PreviewVideoListType;
  playingVideoIndex: number;
  curerentFrame: number;
  apiStatus: "idle" | "loading" | "failed";
  sidebarOpen: boolean;
  versionSelectorOpen: boolean;
  annotatedImage: string | undefined;
  selectedShotId: string;
  playing: boolean;
  sendingNote: boolean;
  commentText: string;
  currentTime: number;
  errorMessage: string;
  error: boolean;
}

const initialState: PreviewVideoState = {
  allPreviews: [],
  selectedVideoList: [],
  playingVideoIndex: 0,
  curerentFrame: 1,
  apiStatus: "idle",
  sidebarOpen: false,
  versionSelectorOpen: false,
  annotatedImage: undefined,
  selectedShotId: "",
  playing: false,
  sendingNote: false,
  commentText: "",
  currentTime: 0,
  errorMessage: "",
  error: false,
};

export const videoListAsync = createAsyncThunk(
  "previewVideo/fetchCount",
  async (a, b) => {
    const {
      data: { previews },
    } = await graphqlClient.query({
      query: shotVersionsQuery,
      variables: {
        taskShotIds: new URLSearchParams(window.location.search).get(
          "taskShotIds",
        ),
      },
      fetchPolicy:
        localStorage.getItem("fetch_data") === "true"
          ? "network-only"
          : "cache-first",
    });
    if (localStorage.getItem("fetch_data") === "true") {
      localStorage.removeItem("fetch_data");
    }
    return previews;
  },
);

export const previewVideoSlice = createSlice({
  name: "previewVideo",
  initialState,
  reducers: {
    setPlaying: (state, { payload }) => {
      state.playing = payload;
    },
    setNextVideo: (state, { payload }) => {
      state.playingVideoIndex = (state.playingVideoIndex + 1) % payload;
    },
    setPreviousVideo: (state, { payload }) => {
      state.playingVideoIndex =
        (payload + state.playingVideoIndex - 1) % payload;
    },
    setSelectedVideos: (state, action) => {
      state.selectedVideoList = state.allPreviews.filter(preview =>
        action.payload.includes(preview.id),
      );
    },
    setPlayingVideoIndex: (state, { payload }) => {
      state.playingVideoIndex = payload;
    },
    setcurerentFrame: (state, { payload }) => {
      state.curerentFrame = payload;
    },
    openSidebar: state => {
      state.sidebarOpen = true;
    },
    closeSidebar: state => {
      state.sidebarOpen = false;
    },
    openVersionSelector: state => {
      state.versionSelectorOpen = true;
    },
    closeVersionSelector: state => {
      state.versionSelectorOpen = false;
    },
    setsendingNote: (state, { payload }) => {
      state.sendingNote = payload;
    },
    setCommentText: (state, { payload }) => {
      state.commentText = payload;
    },
    setAnnotatedImage: (state, action) => {
      state.annotatedImage = action.payload;
    },
    setSelectedShotId: (state, action) => {
      state.selectedShotId = action.payload;
      // state.selectedVideoList = [];
    },
    setCurrentTime: (state, { payload }) => {
      state.currentTime = payload;
    },
    setAllPreviews: (state, { payload }) => {
      state.allPreviews = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(videoListAsync.pending, state => {
        state.apiStatus = "loading";
      })
      .addCase(videoListAsync.fulfilled, (state, action) => {
        state.apiStatus = "idle";
        if (
          action.payload.length === 0 ||
          !localStorage.getItem("access") ||
          action.payload[0].errorMessage ===
            "You are not authorized to the current project"
        ) {
          state.error = true;
          return;
        }
        state.allPreviews = action.payload as PreviewVideoListType;
        if (action.payload.length > 0) {
          state.selectedShotId = action.payload[0].shotDetails.id;
          state.playingVideoIndex = action.payload[0].shotDetails.sourceURL
            ? 1
            : 0;
          state.sendingNote = false;
          state.annotatedImage = undefined;
          state.commentText = "";
        }
      })
      .addCase(videoListAsync.rejected, state => {
        state.apiStatus = "failed";
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setPlaying,
  setNextVideo,
  setPreviousVideo,
  setSelectedVideos,
  openSidebar,
  closeSidebar,
  openVersionSelector,
  closeVersionSelector,
  setsendingNote,
  setCommentText,
  setAnnotatedImage,
  setSelectedShotId,
  setPlayingVideoIndex,
  setCurrentTime,
  setcurerentFrame,
  setAllPreviews,
} = previewVideoSlice.actions;

// Getters
export const getPlaying = (state: RootState) => state.previewVideo.playing;

export const allVideosList = (state: RootState) =>
  state.previewVideo.allPreviews;

export const previewVideoList = (state: RootState) =>
  state.previewVideo.selectedVideoList;

export const getPlayingVideoIndex = (state: RootState) =>
  state.previewVideo.playingVideoIndex;

export const getsendingNote = (state: RootState) =>
  state.previewVideo.sendingNote;

export const getApiStatus = (state: RootState) => state.previewVideo.error;

export const getCommentText = (state: RootState) =>
  state.previewVideo.commentText;

export const videoCount = (state: RootState) =>
  state.previewVideo.selectedVideoList.length;

export const sidebarOpen = (state: RootState) => state.previewVideo.sidebarOpen;

export const versionSelectorOpen = (state: RootState) =>
  state.previewVideo.versionSelectorOpen;

export const getAnnotatedImage = (state: RootState) =>
  state.previewVideo.annotatedImage;

export const getcurerentFrame = (state: RootState) =>
  state.previewVideo.curerentFrame;

export const getAllShots = (state: RootState) => {
  const addedIds: string[] = [];
  const uniqueShots: ShotInterface[] = [];

  state.previewVideo.allPreviews.forEach(preview => {
    if (addedIds.includes(preview.shotDetails.id)) return;

    addedIds.push(preview.shotDetails.id);
    uniqueShots.push({
      ...preview.shotDetails,
      projectName: preview.projectDetails.name,
    });
  });
  return uniqueShots;
};

export const getSelectedShotVideos = (state: RootState) =>
  state.previewVideo.allPreviews.filter(
    preview => preview.shotDetails.id === state.previewVideo.selectedShotId,
  );

export const getCurrentShotSource = (state: RootState) => {
  return state.previewVideo.allPreviews
    .filter(
      preview => preview.shotDetails.id === state.previewVideo.selectedShotId,
    )
    .slice(0, 1)[0];
};
export const getSourceURL = (state: RootState) => {
  return state.previewVideo.allPreviews
    .filter(
      preview => preview.shotDetails.id === state.previewVideo.selectedShotId,
    )
    ?.slice(0, 1)[0]?.shotDetails?.sourceURL;
};

export const getSelectedVideoList = (state: RootState) => {
  if (
    state.previewVideo.selectedVideoList &&
    state.previewVideo.selectedVideoList.length > 0
  ) {
    return getSourceURL(state)
      ? [getCurrentShotSource(state), ...state.previewVideo.selectedVideoList]
      : state.previewVideo.selectedVideoList;
  }
  return getSourceURL(state)
    ? [
        getCurrentShotSource(state),
        ...state.previewVideo.allPreviews
          .filter(
            preview =>
              preview.shotDetails.id === state.previewVideo.selectedShotId,
          )
          .slice(0, 5),
      ]
    : state.previewVideo.allPreviews
        .filter(
          preview =>
            preview.shotDetails.id === state.previewVideo.selectedShotId,
        )
        .slice(0, 5);
};

export const getPlayingVideo = (state: RootState) => {
  const selectedVideos = getSelectedVideoList(state);
  return (
    selectedVideos[state.previewVideo.playingVideoIndex] || selectedVideos[0]
  );
};

export const getCurrentTime = (state: RootState) =>
  state.previewVideo.currentTime;

export default previewVideoSlice.reducer;
