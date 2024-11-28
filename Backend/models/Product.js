const { default: mongoose, Schema } = require("mongoose");

// Variation Schema
const VariantSchema = new Schema({
    color: { 
        type: String, 
        required: true  
    },
    size: { 
        type: String, 
        required: true, 
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    stock: { 
        type: Number, 
        required: true, 
        min: 0 
    }
}, { _id: false }); 

// ProductSchema
const ProductSchema = new Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    mrp: {
        type : Number,
        required: true,
        min: 0
    },
    category: { 
        type: [String],
        required: true
    },
    material: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true,
        trim: true 
    },
    tags: { 
        type: [String], 
        default: [] 
    },
    variants: { 
        type: [VariantSchema], 
        required: true 
    },
    images: { 
        type: [String], 
        required: true 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

ProductSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
