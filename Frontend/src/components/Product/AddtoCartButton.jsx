import { motion } from "framer-motion"
import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

const AddToCartButton = ({ handleAddToCart, isAdding, added, isUpdated }) => {
  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.div className="flex-1" whileHover={!isAdding && !added ? { scale: 1.02 } : undefined} whileTap={!isAdding && !added ? { scale: 0.98 } : undefined}>
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="lg"
            disabled={isAdding}
            variant={added || isUpdated ? "success" : "default"}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : added ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Added to Cart
              </>
            ) : isUpdated ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Updated Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Heart className="w-4 h-4 mr-2 text-primary" />
            Wishlist
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default AddToCartButton
