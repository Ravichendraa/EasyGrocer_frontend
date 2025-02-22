import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReviews } from '@/store/shop/review-slice';
import ReviewItem from './review-item';

function ShoppingReviews() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userReviews, isLoading, error } = useSelector((state) => state.shopReview);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserReviews(user.id));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>Error fetching reviews: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>
      {userReviews && userReviews.length > 0 ? (
        userReviews.map((review) => (
          <ReviewItem key={review._id} review={review} />
        ))
      ) : (
        <p>You haven't written any reviews yet.</p>
      )}
    </div>
  );
}

export default ShoppingReviews;
