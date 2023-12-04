import React, { useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

const CustomStarRating = ({
  totalStars = 5,
  initialRating = 0,
  customIcon,
  onChange,
}) => {
  const [uuid, setUuid] = useState(uuidv4());
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const getIcon = (index) => {
    // Si l'utilisateur survole les étoiles
    if (hoverRating > 0) {
      if (hoverRating > index + 0.5) {
        return customIcon.full;
      }
      if (hoverRating > index) {
        return customIcon.half;
      }
      return customIcon.empty;
    }

    // Si l'utilisateur ne survole pas, afficher la note actuelle
    if (rating > index + 0.5) {
      return customIcon.full;
    }
    if (rating > index) {
      return customIcon.half;
    }
    return customIcon.empty;
  };

  const handleMouseMove = (e, index) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const half = rect.width / 2;
    setHoverRating(x < half ? index + 0.5 : index + 1);
  };

  const handleMouseEnter = (index) => {
    setHoverRating(index);
  };

  const handleOnClick = (rate) => {
    setRating(rate);
    onChange(rate);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div data-tooltip-id={`tooltip${uuid}`}>
      <ReactTooltip
        id={`tooltip${uuid}`}
        place="top"
        content={<div>{hoverRating}</div>}
      />
      <div className="flex flex-wrap gap-0">
        {[...Array(totalStars)].map((_, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <img
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            src={getIcon(index)}
            onMouseEnter={() => handleMouseEnter(index + 0.5)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleOnClick(hoverRating)}
            alt="rating star"
            className="cursor-pointer w-[23px] h-[23px]"
          />
        ))}
      </div>
    </div>
  );
};

export default CustomStarRating;
