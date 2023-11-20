import ReactStars from 'react-rating-stars-component';

const Rating = ({ rating, ratingChanged }) => {
  return (
    <ReactStars
      value={rating}
      count={5}
      onChange={ratingChanged}
      isHalf
      // emptyIcon={<i className="fa fa-bath" aria-hidden="true"></i>}
      // emptyIcon={<img src={emptyRatingIcon} className="w-8 h-8" alt="" />}
      // halfIcon={<img src={halfRatingIcon} alt="" />}
      // fullIcon={<img src={fullRatingIcon} alt="" />}
      size={20}
      // activeColor="#00ff6a"
    />
  );
};

export default Rating;
