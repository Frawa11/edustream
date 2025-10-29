import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`bg-surface rounded-lg shadow-xl border border-border ${className}`}>
            {children}
        </div>
    );
};

export default Card;
