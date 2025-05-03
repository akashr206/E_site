import { motion } from "framer-motion"
import { Star } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

const ProductInfo = ({ product, ratings }) => {

  return (
    <div className="mb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            New Arrival
          </Badge>
          {product.inStock ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
              Out of Stock
            </Badge>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>

        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(ratings?.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : i < ratings?.averageRating
                      ? "fill-yellow-400 text-yellow-400 opacity-50"
                      : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <p className="ml-2 text-sm text-muted-foreground">
            {ratings?.averageRating} ({ratings?.totalReviews} reviews)
          </p>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Material: <span className="font-medium text-foreground">{product.material}</span>
        </p>

        <div className="mt-4 flex items-end">
          <p className="text-3xl font-bold text-pink-500">₹{product.price}.00</p>
          {product.mrp && (
            <>
              <p className="ml-3 text-sm mb-1 text-muted-foreground line-through">₹{product.mrp}.00</p>
              <p className="ml-2 text-sm mb-1 font-medium text-green-600">
                {Math.round((1 - product.price / product.mrp) * 100)}% off
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ProductInfo
