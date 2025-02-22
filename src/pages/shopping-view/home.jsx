import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Gift,
  Coffee,
  Cookie,
  Droplet,
  Package,
  ShoppingBag,
  Smile,
  Heart,
  PenTool,
  Leaf,
  Sun,
  Star,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import './ShoppingHome.css'; // Import the CSS file
import VideoSection from "@/components/shopping-view/videosection";

const categoriesWithIcon = [
  { id: "stationery", label: "Stationery", icon: BookOpen },
  { id: "dry-fruits", label: "Dry Fruits", icon: Gift },
  { id: "biscuits", label: "Biscuits", icon: Cookie },
  { id: "chocolates", label: "Chocolates", icon: Heart },
  { id: "soaps", label: "Soaps", icon: Droplet },
  { id: "dals", label: "Dals", icon: Package },
  { id: "snacks", label: "Snacks", icon: ShoppingBag },
  { id: "soft-drinks", label: "Soft Drinks", icon: Coffee },
  { id: "personal-care", label: "Personal Care", icon: Smile },
];

const brandsWithIcon = [
  // Stationery Brands
  { id: "classmate", label: "Classmate", icon: PenTool },
  { id: "camlin", label: "Camlin", icon: PenTool },
  { id: "navneet", label: "Navneet", icon: BookOpen },

  // Dry Fruits Brands
  { id: "happilo", label: "Happilo", icon: Gift },
  { id: "nutraj", label: "Nutraj", icon: Leaf },
  { id: "vedaka", label: "Vedaka", icon: Star },

  // Biscuits Brands
  { id: "britannia", label: "Britannia", icon: Cookie },
  { id: "parle", label: "Parle", icon: Package },
  { id: "sunfeast", label: "Sunfeast", icon: Sun },

  // Chocolates Brands
  { id: "cadbury", label: "Cadbury", icon: Heart },
  { id: "nestle", label: "Nestlé", icon: Smile },
  { id: "amul", label: "Amul", icon: Gift },

  // Soaps Brands
  { id: "santoor", label: "Santoor", icon: Droplet },
  { id: "dove", label: "Dove", icon: Droplet },
  { id: "dettol", label: "Dettol", icon: Droplet },

  // Dals Brands
  { id: "tata-sampann", label: "Tata Sampann", icon: Package },
  { id: "fortune", label: "Fortune", icon: Star },
  { id: "organic-tattva", label: "Organic Tattva", icon: Leaf },

  // Snacks Brands
  { id: "haldirams", label: "Haldiram's", icon: ShoppingBag },
  { id: "kurkure", label: "Kurkure", icon: ShoppingBag },
  { id: "lays", label: "Lays", icon: ShoppingBag },

  // Soft Drinks Brands
  { id: "coca_cola", label: "Coca-Cola", icon: Coffee },
  { id: "pepsi", label: "Pepsi", icon: Coffee },

  // Personal Care Brands
  { id: "himalaya", label: "Himalaya", icon: Leaf },
  { id: "nivea", label: "Nivea", icon: Smile },
  { id: "garnier", label: "Garnier", icon: Heart },
];  

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

        {/* Categories Section */}
        <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="carousel-container">
            <div className="carousel-track">
              {[...categoriesWithIcon, ...categoriesWithIcon].map((categoryItem, index) => (
                <Card
                  key={`category-${index}-${categoryItem.id}`}
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="carousel-item"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{categoryItem.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="carousel-container">
            <div className="carousel-track">
              {[...brandsWithIcon, ...brandsWithIcon].map((brandItem, index) => (
                <Card
                  key={`brand-${index}-${brandItem.id}`}
                  onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                  className="carousel-item"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{brandItem.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div>
        <VideoSection />
      </div>


      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
