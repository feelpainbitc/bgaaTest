import { configureStore } from "@reduxjs/toolkit";
import subjectsReducer from "./slices/subjectSlice";

export const store = configureStore({
  reducer: {
    subjects: subjectsReducer,
  },
});