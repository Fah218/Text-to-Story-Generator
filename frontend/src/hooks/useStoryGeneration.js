import { useDispatch, useSelector } from 'react-redux';
import {
    setIsGenerating,
    setLoadingStage,
    setGeneratedStory,
    setActiveScene
} from '../store/storySlice';

export const useStoryGeneration = () => {
    const dispatch = useDispatch();
    const { prompt, sceneCount, selectedGenre, selectedTone } = useSelector(state => state.story);

    const generateStory = () => {
        if (!prompt) return;

        dispatch(setIsGenerating(true));
        dispatch(setLoadingStage(0));
        dispatch(setGeneratedStory(null));
        dispatch(setActiveScene(0));

        // Wait, mock the generation process for demo
        let currentStage = 0;
        const interval = setInterval(() => {
            currentStage++;
            if (currentStage > 2) {
                clearInterval(interval);
                setTimeout(() => {
                    dispatch(setIsGenerating(false));
                    dispatch(setGeneratedStory({
                        title: "The Neon Enigma",
                        concept: prompt,
                        scenes: Array.from({ length: sceneCount }).map((_, i) => ({
                            id: i + 1,
                            title: `Scene ${i + 1}: The Discovery`,
                            text: "The neon lights flickered over the wet pavement, reflecting a city that never slept but always dreamed. Detective Aris pulled his collar up against the chill, his cybernetic eye scanning the alleyway. The jazz club 'Blue Note' was just ahead, its neon sign buzzing like a dying insect. Inside, the conspiracy lay waiting...",
                            imageUrl: `https://images.unsplash.com/photo-1517594422361-5e1f74bc9338?auto=format&fit=crop&q=80&w=800&h=400`
                        }))
                    }));
                }, 1500);
            } else {
                dispatch(setLoadingStage(currentStage));
            }
        }, 2000);
    };

    return { generateStory };
};
