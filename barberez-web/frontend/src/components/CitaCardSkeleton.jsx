import React from 'react';

export default function CitaCardSkeleton({ size = 'normal', count = 6 }) {
    const getSizeClasses = () => {
        switch (size) {
            case 'compact':
                return 'p-2 space-y-1';
            case 'comfortable':
                return 'p-5 space-y-4';
            default:
                return 'p-3 space-y-2';
        }
    };

    const classes = getSizeClasses();

    const SkeletonCard = () => (
        <div className={`border-2 border-gray-200 rounded-lg ${classes} animate-pulse bg-white`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-2">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>

            {/* Buttons */}
            {size !== 'compact' && (
                <div className="flex gap-2">
                    <div className="flex-1 h-9 bg-gray-200 rounded"></div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </>
    );
}
