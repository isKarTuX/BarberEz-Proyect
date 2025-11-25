import React, { memo, useMemo, useCallback } from 'react';
import { FaUserFriends, FaUserTie } from 'react-icons/fa';

const ToggleSwitch = memo(function ToggleSwitch({ 
    value, 
    onChange, 
    leftLabel, 
    rightLabel, 
    leftIcon: LeftIcon, 
    rightIcon: RightIcon, 
    isRight, 
    onToggle 
}) {
    // Soporte para ambas APIs: nueva (value/onChange) y legacy (isRight/onToggle)
    const currentValue = useMemo(() => 
        value !== undefined ? value : (isRight ? 'right' : 'left'),
        [value, isRight]
    );

    const handleChange = useMemo(() => 
        onChange || ((val) => onToggle && onToggle(val === 'right')),
        [onChange, onToggle]
    );

    // Callbacks memoizados para los botones
    const handleLeft = useCallback(() => handleChange('left'), [handleChange]);
    const handleRight = useCallback(() => handleChange('right'), [handleChange]);

    return (
        <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md border-2 border-primary/20">
            <button
                onClick={handleLeft}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    currentValue === 'left'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
                aria-label={leftLabel}
                aria-pressed={currentValue === 'left'}
            >
                {LeftIcon && <LeftIcon className="w-5 h-5" aria-hidden="true" />}
                <span>{leftLabel}</span>
            </button>
            <button
                onClick={handleRight}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    currentValue === 'right'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
                aria-label={rightLabel}
                aria-pressed={currentValue === 'right'}
            >
                {RightIcon && <RightIcon className="w-5 h-5" aria-hidden="true" />}
                <span>{rightLabel}</span>
            </button>
        </div>
    );
}, (prevProps, nextProps) => {
    // Solo re-renderizar si cambian las props relevantes
    return prevProps.value === nextProps.value &&
           prevProps.isRight === nextProps.isRight;
});

export default ToggleSwitch;
