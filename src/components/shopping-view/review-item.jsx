import React from 'react';
import StarRatingComponent from '../common/star-rating';
import { Link } from 'react-router-dom';

function ReviewItem({ review }) {
  const product = review.productId;

  if (!product) {
    // Handle cases where product details are missing
    return null;
  }

  return (
    <div className="border p-4 rounded mb-4 flex">
      {/* Product Image */}
      <div className="w-1/4">
        <img
          src={product.image || '/images/placeholder.png'}
          alt={product.title || 'Product Image'}
          className="object-cover w-full h-24 rounded"
        />
      </div>
      {/* Review and Product Details */}
      <div className="ml-4 flex-1">
        {/* Product Title */}
        <h3 className="font-semibold text-lg">
          
            {product.title || 'Product'}
        </h3>
        {/* Price */}
        {product.price && (
          <p className="text-sm text-primary font-semibold">
            ₹{product.price}
          </p>
        )}
        {/* Review Rating and Date */}
        <div className="flex items-center gap-2 mt-1">
          <StarRatingComponent rating={review.reviewValue} isDisabled={true} />
          <span className="text-sm text-muted-foreground">
            {new Date(review.date).toLocaleDateString()}
          </span>
        </div>
        {/* Review Message */}
        <p className="mt-2">{review.reviewMessage}</p>
      </div>
    </div>
  );
}

export default ReviewItem;
