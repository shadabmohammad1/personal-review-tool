import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import previewVideoReducer from "store/preview-video/videoList";

export const store = configureStore({
  reducer: {
    previewVideo: previewVideoReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
