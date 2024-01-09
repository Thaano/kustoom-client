// import ReactStars from 'react-rating-stars-component';

// import rateFull from '../../../assets/rating/rating-7.png';
// import rateHalf from '../../../assets/rating/rating-5.png';
// import rateEmpty from '../../../assets/rating/rating-1.png';
import rateFull from '../../../assets/rating/star-full.svg';
import rateHalf from '../../../assets/rating/star-half.svg';
import rateEmpty from '../../../assets/rating/star-empty.svg';
import CustomStarRating from './CustomStarRating';

const RatingComponent = ({ rating, ratingChanged }) => {
  return (
    <CustomStarRating
      totalStars={5}
      initialRating={rating}
      onChange={ratingChanged}
      customIcon={{
        full: rateFull,
        half: rateHalf,
        empty: rateEmpty,
      }}
    />

    // <ReactStars
    //   value={rating}
    //   count={5}
    //   onChange={ratingChanged}
    //   isHalf
    //   // emptyIcon={<i className="fa fa-bath" aria-hidden="true"></i>}
    //   // emptyIcon={<img src={rateEmpty} className="w-[24px]" alt="empty star" />}
    //   // halfIcon={<img src={rateHalf} className="w-[24px]" alt="half star" />}
    //   // fullIcon={<img src={rateFull} className="w-[24px]" alt="full star" />}
    //   size={20}
    // />
  );
};

export default RatingComponent;
