
import React from 'react';
import UtilityButton from './UtilityButton';

interface MenuPageProps {
    onStartQuiz: () => void;
    onShowProgress: () => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ onStartQuiz, onShowProgress }) => {
    return (
        <div className="flex flex-col justify-center items-center gap-5 min-h-[500px]">
            <div className="absolute top-4 right-5">
                <UtilityButton onClick={onShowProgress}>Progress</UtilityButton>
            </div>
            <h1 className="text-5xl font-bold text-white">Hiragana Grinder</h1>
            <p className="text-lg text-indigo-200">Endlessly practice your Hiragana.</p>
            <button
                id="start-btn"
                onClick={onStartQuiz}
                className="w-4/5 px-8 py-4 mt-5 text-2xl text-white bg-[#5c67f2] rounded-xl shadow-[0_4px_15px_rgba(92,103,242,0.4)] transition-all duration-200 ease-in-out hover:bg-[#4a54c4] hover:-translate-y-0.5"
            >
                Start Learning
            </button>
        </div>
    );
};

export default MenuPage;
