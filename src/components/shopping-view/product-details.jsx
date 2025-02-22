import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import StarRatingComponent from "../common/star-rating";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setIsDescriptionExpanded(false);
    setIsTitleExpanded(false);
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // Implement 'Show More' functionality for title and description
  const titleLimit = 60; // Adjust as needed
  const descriptionLimit = 150; // Adjust as needed

  const title = productDetails?.title || "";
  const description = productDetails?.description || "";

  const isTitleLong = title.length > titleLimit;
  const isDescriptionLong = description.length > descriptionLimit;

  const displayedTitle = isTitleExpanded ? title : title.slice(0, titleLimit);
  const displayedDescription = isDescriptionExpanded
    ? description
    : description.slice(0, descriptionLimit);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[90vw] sm:max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center h-[400px]">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          {/* Details Section */}
          <div className="flex flex-col">
            <div>
              {/* Product Title */}
              <h1 className="text-2xl font-extrabold mb-2">
                {displayedTitle}
                {isTitleLong && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm ml-2"
                    onClick={() => setIsTitleExpanded(!isTitleExpanded)}
                  >
                    {isTitleExpanded ? "Show Less" : "Show More"}
                  </Button>
                )}
              </h1>
              {/* Product Description */}
              <div className="text-muted-foreground text-base mb-4">
                <p>{displayedDescription}</p>
                {isDescriptionLong && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                  >
                    {isDescriptionExpanded ? "Show Less" : "Show More"}
                  </Button>
                )}
              </div>
            </div>
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                {productDetails?.salePrice > 0 ? (
                  <>
                    <p className="text-2xl font-bold text-primary">
                      ₹{productDetails?.salePrice}
                    </p>
                    <p className="text-xl line-through text-muted-foreground">
                      ₹{productDetails?.price}
                    </p>
                    <p className="text-sm text-red-600">
                      {Math.round(
                        ((productDetails.price - productDetails.salePrice) /
                          productDetails.price) *
                          100
                      )}
                      % Off
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    ₹{productDetails?.price}
                  </p>
                )}
              </div>
            </div>
            {/* Average Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent
                  rating={averageReview}
                  isDisabled={true} // Disable interaction
                />
              </div>
              <span className="text-muted-foreground">
                ({averageReview.toFixed(1)})
              </span>
            </div>
            {/* Add to Cart Button */}
            <div className="mt-5 mb-5">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>
            <Separator />
            {/* Reviews Section */}
            <div className="max-h-[300px] overflow-auto">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              <div className="grid gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem, index) => (
                    <div className="flex gap-4" key={index}>
                      <Avatar className="w-10 h-10 border">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent
                            rating={reviewItem?.reviewValue}
                            isDisabled={true} // Disable interaction
                          />
                        </div>
                        <p className="text-muted-foreground">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No Reviews</h1>
                )}
              </div>
              {/* Review Input Section */}
              <div className="mt-10 flex-col flex gap-2">
                <Label>Write a review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Write a review..."
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
