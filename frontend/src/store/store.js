import { configureStore } from '@reduxjs/toolkit';
import storyReducer from './storySlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        story: storyReducer,
        ui: uiReducer,
    },
});
