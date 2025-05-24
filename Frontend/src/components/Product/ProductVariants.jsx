import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ProductVariants = ({
    colors,
    sizes,
    selectedColor,
    selectedSize,
    handleSelectColor,
    setSelectedSize,
    isInStock,
}) => {
    if (!isInStock) {
        return <div className="text-center text-sm text-red-500"></div>;
    }
    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">
                        Color
                    </h4>
                </div>

                <div className="mt-4">
                    <RadioGroup
                        value={selectedColor}
                        onValueChange={handleSelectColor}
                        className="flex flex-wrap gap-2"
                        defaultValue={selectedColor}
                    >
                        { colors.map((color, index) => {
                            const colorName = Object.keys(color)[0];
                            if (color[colorName].length > 0)
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <RadioGroupItem
                                                value={colorName}
                                                id={`color-${colorName}`}
                                                className="peer sr-only"
                                                checked={
                                                    selectedColor === colorName
                                                }
                                            />
                                            <Label
                                                htmlFor={`color-${colorName}`}
                                                className="flex items-center justify-center px-3 py-2 text-sm rounded-md border border-border bg-background hover:bg-accent peer-data-[state=checked]:bg-pink-500 peer-data-[state=checked]:text-primary-foreground cursor-pointer"
                                            >
                                                {colorName}
                                            </Label>
                                        </motion.div>
                                    </div>
                                );
                        })}
                    </RadioGroup>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">
                        Size
                    </h4>
                </div>

                <div className="mt-4">
                    <RadioGroup
                        value={selectedSize}
                        onValueChange={setSelectedSize}
                        className="flex flex-wrap gap-2"
                        defaultValue={selectedSize}
                    >
                        {sizes.map((size, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <RadioGroupItem
                                        value={size}
                                        id={`size-${size}`}
                                        className="peer sr-only"
                                        checked={selectedSize === size}
                                    />
                                    <Label
                                        htmlFor={`size-${size}`}
                                        className="flex items-center justify-center min-w-[3rem] px-3 py-2 text-sm rounded-md border border-border bg-background hover:bg-accent peer-data-[state=checked]:bg-pink-500 peer-data-[state=checked]:text-primary-foreground cursor-pointer"
                                    >
                                        {size}
                                    </Label>
                                </motion.div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>
        </div>
    );
};

export default ProductVariants;
