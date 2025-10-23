
import React from 'react';

interface StarRatingProps {
    rating: number;
    totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 10 }) => {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(totalStars - rating);

    return (
        <span>
            {fullStars}{emptyStars}
        </span>
    );
};

export default StarRating;
