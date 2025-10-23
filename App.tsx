import React, { useState, useEffect, useCallback } from 'react';
import { Page, KanaProgress } from './types';
import { ALL_KANA, ROMAJI_MAP } from './constants';
import MenuPage from './components/MenuPage';
import QuizPage from './components/QuizPage';
import ProgressModal from './components/ProgressModal';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>(Page.Menu);
    const [progress, setProgress] = useState<KanaProgress>({});
    const [unlockedKanaCount, setUnlockedKanaCount] = useState<number>(5);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        // Load progress from localStorage on initial mount
        const savedState = localStorage.getItem('hiraganaGrinderProgress');
        const initialProgress: KanaProgress = {};
        ALL_KANA.forEach(kana => {
            initialProgress[kana] = 0;
        });

        if (savedState) {
            const { p, uKC } = JSON.parse(savedState);
            // Merge saved progress with the full list to handle app updates
            Object.assign(initialProgress, p);
            setProgress(initialProgress);
            setUnlockedKanaCount(uKC || 5);
        } else {
            setProgress(initialProgress);
        }
    }, []);

    useEffect(() => {
        // Save progress to localStorage whenever it changes
        if (Object.keys(progress).length > 0) {
            localStorage.setItem('hiraganaGrinderProgress', JSON.stringify({ p: progress, uKC: unlockedKanaCount }));
        }
    }, [progress, unlockedKanaCount]);

    const handleStartQuiz = () => setPage(Page.Quiz);
    const handleShowMenu = () => setPage(Page.Menu);
    const handleShowProgress = () => setIsModalOpen(true);
    const handleCloseProgress = () => setIsModalOpen(false);

    // FIX: Explicitly convert value to a number to resolve a TypeScript type inference issue. This fixes both compilation errors.
    const totalStars = Object.values(progress).reduce((sum, value) => sum + Number(value), 0);
    const maxStars = ALL_KANA.length * 10;
    const overallProgressPercent = maxStars > 0 ? (totalStars / maxStars) * 100 : 0;

    const updateProgress = useCallback((kana: string, change: number) => {
        setProgress(prev => ({
            ...prev,
            [kana]: Math.max(0, Math.min(10, (prev[kana] || 0) + change))
        }));
    }, []);

    return (
        <div className="text-[#f0f0f0] flex justify-center items-center min-h-screen p-4 font-sans">
            <div className="w-full max-w-md bg-[#2e2e5c] rounded-3xl shadow-2xl p-7 text-center relative">
                {page === Page.Menu && (
                    <MenuPage onStartQuiz={handleStartQuiz} onShowProgress={handleShowProgress} />
                )}
                {page === Page.Quiz && (
                    <QuizPage
                        progress={progress}
                        updateProgress={updateProgress}
                        unlockedKanaCount={unlockedKanaCount}
                        setUnlockedKanaCount={setUnlockedKanaCount}
                        onShowMenu={handleShowMenu}
                        overallProgressPercent={overallProgressPercent}
                    />
                )}
            </div>
            <ProgressModal
                isOpen={isModalOpen}
                onClose={handleCloseProgress}
                progress={progress}
                allKana={ALL_KANA}
                romajiMap={ROMAJI_MAP}
            />
        </div>
    );
};

export default App;
