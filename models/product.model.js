const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide a Name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxlength: [6, "Price cannot exceed more than 6 numbers"]
    },
    images:[
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        maxlength: [4, "Stock cannot exceed numbers"]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews:[
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            Comment: {
                type: String,
                required: true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Products', productSchema);