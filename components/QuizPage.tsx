
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { KanaProgress } from '../types';
import { ALL_KANA, ROMAJI_MAP } from '../constants';
import { speak } from '../services/audioService';
import StarRating from './StarRating';
import UtilityButton from './UtilityButton';

interface QuizPageProps {
    progress: KanaProgress;
    updateProgress: (kana: string, change: number) => void;
    unlockedKanaCount: number;
    setUnlockedKanaCount: React.Dispatch<React.SetStateAction<number>>;
    onShowMenu: () => void;
    overallProgressPercent: number;
}

interface Question {
    kana: string;
    options: string[];
    correctRomaji: string;
}

type AnswerStatus = 'correct' | 'incorrect' | 'unanswered';

const QuizPage: React.FC<QuizPageProps> = ({
    progress,
    updateProgress,
    unlockedKanaCount,
    setUnlockedKanaCount,
    onShowMenu,
    overallProgressPercent
}) => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [isAnswering, setIsAnswering] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const lastKanaRef = useRef<string | null>(null);

    const generateQuestion = useCallback(() => {
        const unlockedKana = ALL_KANA.slice(0, unlockedKanaCount);
        let weightedPool = unlockedKana.flatMap(k => {
            const stars = progress[k] || 0;
            if (stars === 10) return Math.random() < 0.05 ? [k] : [];
            return Array(11 - stars).fill(k);
        });

        if (weightedPool.length === 0) {
            weightedPool.push(...unlockedKana);
        }

        let currentKana: string;
        do {
            currentKana = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        } while (currentKana === lastKanaRef.current && weightedPool.length > 1);
        
        lastKanaRef.current = currentKana;
        
        const correctRomaji = ROMAJI_MAP[currentKana];
        const incorrectOptions = new Set<string>();
        const allRomaji = Object.values(ROMAJI_MAP);

        while (incorrectOptions.size < 2) {
            const randomRomaji = allRomaji[Math.floor(Math.random() * allRomaji.length)];
            if (randomRomaji !== correctRomaji) {
                incorrectOptions.add(randomRomaji);
            }
        }

        const options = [correctRomaji, ...incorrectOptions].sort(() => 0.5 - Math.random());

        setQuestion({ kana: currentKana, options, correctRomaji });
        setIsAnswering(false);
        setSelectedAnswer(null);

        if ((progress[currentKana] || 0) === 0) {
            speak(currentKana);
        }
    }, [unlockedKanaCount, progress]);

    useEffect(() => {
        generateQuestion();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAnswer = (selectedRomaji: string) => {
        if (isAnswering || !question) return;

        setIsAnswering(true);
        setSelectedAnswer(selectedRomaji);
        const { kana, correctRomaji } = question;

        if (selectedRomaji === correctRomaji) {
            updateProgress(kana, 1);
            const lastUnlockedKana = ALL_KANA[unlockedKanaCount - 1];
            if ((progress[lastUnlockedKana] || 0) >= 4 && unlockedKanaCount < ALL_KANA.length) {
                setUnlockedKanaCount(prev => prev + 1);
            }
        } else {
            updateProgress(kana, -1);
        }

        speak(kana);

        setTimeout(() => {
            generateQuestion();
        }, 1500);
    };

    const getButtonClass = (romaji: string): string => {
        if (!isAnswering) {
             if ((progress[question?.kana || ''] || 0) === 0 && romaji === question?.correctRomaji) {
                return 'border-[#5c67f2] shadow-[0_0_15px_var(--tw-shadow-color)] shadow-[#5c67f2]';
             }
             return 'border-white/20 hover:border-white/80 hover:bg-white/10';
        }

        if (romaji === question?.correctRomaji) {
            return 'bg-green-500 border-green-500 text-white';
        }
        if (romaji === selectedAnswer) {
            return 'bg-red-500 border-red-500 text-white';
        }
        return 'border-white/20 opacity-50';
    };

    if (!question) {
        return <div className="min-h-[500px] flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-[500px]">
            <div className="absolute top-4 right-5">
                <UtilityButton onClick={onShowMenu}>Menu</UtilityButton>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-5">
                <div
                    className="h-full bg-[#4d9de0] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${overallProgressPercent}%` }}
                />
            </div>

            <div className="text-3xl text-[#f9d71c] opacity-80 tracking-widest mb-4">
                <StarRating rating={progress[question.kana] || 0} />
            </div>

            <div className="flex-grow flex justify-center items-center text-[10rem] font-medium text-white">
                {question.kana}
            </div>

            <div className="flex justify-center gap-5 mt-5">
                {question.options.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswering}
                        className={`w-20 h-20 rounded-full border-2 bg-transparent text-white/80 text-2xl font-bold flex justify-center items-center transition-all duration-200 ${getButtonClass(option)}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuizPage;
