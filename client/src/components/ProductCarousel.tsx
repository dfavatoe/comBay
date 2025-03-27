import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard"; // Ensure this is correctly imported
import { ProductT } from "../types/customTypes";
import "../style/Carousel.css";

interface ProductCarouselProps {
  productsRecords: ProductT[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  productsRecords,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="scrollmenu relative mb-4">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="carousel-button left"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scrollable Container */}
      <div ref={scrollContainerRef} className="scroll-container">
        {productsRecords.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="carousel-button right"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ProductCarousel;
