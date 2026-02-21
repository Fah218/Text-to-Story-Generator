import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAdvancedOpen: false,
    isExamplesOpen: false,
    authModal: { isOpen: false, type: 'login' },
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleAdvancedOpen: (state) => { state.isAdvancedOpen = !state.isAdvancedOpen; },
        setIsExamplesOpen: (state, action) => { state.isExamplesOpen = action.payload; },
        setAuthModal: (state, action) => { state.authModal = action.payload; },
    },
});

export const { toggleAdvancedOpen, setIsExamplesOpen, setAuthModal } = uiSlice.actions;

export default uiSlice.reducer;
