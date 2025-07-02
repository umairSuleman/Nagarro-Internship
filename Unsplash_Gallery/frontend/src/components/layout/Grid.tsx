import React from "react";

interface GridProps {
    children: React.ReactNode;
    cols ?: 1|2|3|4|5|6;
    gap?: 2|3|4|5|6|8;
    className?: string;
}

export const Grid: React.FC<GridProps> =({
    children,
    cols=4,
    gap=6,
    className=''
}) => {
    const colsMap = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
    };

    const getGapClass =(gap: number) => `gap-${gap}`;

    return (
        <div className={ `grid ${colsMap[cols]} ${getGapClass(gap)} ${className}`}>
            {children}
        </div>
    );
};