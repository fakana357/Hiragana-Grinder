
import React from 'react';

interface UtilityButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const UtilityButton: React.FC<UtilityButtonProps> = ({ onClick, children, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 text-sm text-indigo-200 bg-transparent border border-[#556] rounded-full cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#445] hover:border-[#889] ${className}`}
        >
            {children}
        </button>
    );
};

export default UtilityButton;
