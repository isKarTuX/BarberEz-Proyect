import React from 'react';
import { FaUserFriends, FaUserTie } from 'react-icons/fa';

export default function ToggleSwitch({ value, onChange, leftLabel, rightLabel, leftIcon: LeftIcon, rightIcon: RightIcon, isRight, onToggle }) {
    // Soporte para ambas APIs: nueva (value/onChange) y legacy (isRight/onToggle)
    const currentValue = value !== undefined ? value : (isRight ? 'right' : 'left');
    const handleChange = onChange || ((val) => onToggle && onToggle(val === 'right'));

    return (
        <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md border-2 border-primary/20">
            <button
                onClick={() => handleChange('left')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    currentValue === 'left'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
            >
                {LeftIcon && <LeftIcon className="w-5 h-5" />}
                <span>{leftLabel}</span>
            </button>
            <button
                onClick={() => handleChange('right')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    currentValue === 'right'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
            >
                {RightIcon && <RightIcon className="w-5 h-5" />}
                <span>{rightLabel}</span>
            </button>
        </div>
    );
}
