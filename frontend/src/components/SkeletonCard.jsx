import React from 'react';

const SkeletonCard = ({ className }) => {
    return (
        <div className={`bg-white/5 animate-pulse rounded-2xl ${className}`}>
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer"></div>
        </div>
    );
};

export const SkeletonLine = ({ width = "100%", height = "1rem", className }) => (
    <div
        className={`bg-white/10 animate-pulse rounded ${className}`}
        style={{ width, height }}
    />
);

export default SkeletonCard;
