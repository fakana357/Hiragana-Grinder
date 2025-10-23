
import React from 'react';
import { KanaProgress } from '../types';
import StarRating from './StarRating';
import UtilityButton from './UtilityButton';

interface ProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    progress: KanaProgress;
    allKana: string[];
    romajiMap: { [key: string]: string };
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose, progress, allKana, romajiMap }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#2e2e5c] text-[#f0f0f0] p-6 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
                <div className="overflow-y-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#445]">
                                <th className="p-2.5 text-center font-bold text-white">Hiragana</th>
                                <th className="p-2.5 text-center font-bold text-white">Romaji</th>
                                <th className="p-2.5 text-center font-bold text-white">Stars</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allKana.map(kana => (
                                <tr key={kana} className="border-b border-[#445] last:border-b-0">
                                    <td className="p-2.5 text-center text-2xl">{kana}</td>
                                    <td className="p-2.5 text-center">{romajiMap[kana]}</td>
                                    <td className="p-2.5 text-center text-[#f9d71c] tracking-wider">
                                        <StarRating rating={progress[kana] || 0} totalStars={10} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 text-center">
                    <UtilityButton onClick={onClose}>Close</UtilityButton>
                </div>
            </div>
        </div>
    );
};

export default ProgressModal;
