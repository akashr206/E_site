"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const ProductGallery = ({ images, selectedImage, setSelectedImage, productName }) => {
  return (
    <div className="lg:sticky lg:top-24">
      <Card className="overflow-hidden shadow-none border-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-[420px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={selectedImage}
                alt={productName}
                className="object-contain h-full max-w-full rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-4">
        {images.map((url, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(url)}
            className={`relative bg-transparent overflow-hidden rounded-md ${
              selectedImage === url ? "ring-2 ring-pink-500" : "ring-1 ring-border"
            }`}
          >
            <AspectRatio ratio={1 / 1}>
              <img
                className="h-full w-full hover:scale-105 transition-transform object-contain"
                src={url}
                alt={`${productName} view ${index + 1}`}
              />
            </AspectRatio>
            {selectedImage === url && <div className=""></div>}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ProductGallery
