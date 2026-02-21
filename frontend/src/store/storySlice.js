import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    prompt: '',
    selectedGenre: '',
    selectedTone: '',
    sceneCount: 3,
    targetAudience: 'Teens',
    isGenerating: false,
    loadingStage: 0,
    generatedStory: null,
    activeScene: 0,
};

export const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        setPrompt: (state, action) => { state.prompt = action.payload; },
        setSelectedGenre: (state, action) => { state.selectedGenre = action.payload; },
        setSelectedTone: (state, action) => { state.selectedTone = action.payload; },
        setSceneCount: (state, action) => { state.sceneCount = action.payload; },
        setTargetAudience: (state, action) => { state.targetAudience = action.payload; },
        setIsGenerating: (state, action) => { state.isGenerating = action.payload; },
        setLoadingStage: (state, action) => { state.loadingStage = action.payload; },
        setGeneratedStory: (state, action) => { state.generatedStory = action.payload; },
        setActiveScene: (state, action) => { state.activeScene = action.payload; },
        resetGeneration: (state) => {
            state.isGenerating = false;
            state.loadingStage = 0;
            state.generatedStory = null;
            state.activeScene = 0;
        }
    },
});

export const {
    setPrompt, setSelectedGenre, setSelectedTone, setSceneCount,
    setTargetAudience, setIsGenerating, setLoadingStage,
    setGeneratedStory, setActiveScene, resetGeneration
} = storySlice.actions;

export default storySlice.reducer;
