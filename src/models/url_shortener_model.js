const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
    full:{
        type:String,
        required: true,
    },
    shortUrl:{
        type:String,
        required: true,
    },
    clicks:{
        type:Number,
        default: 0
    }
});

const ShortUrlModel = new mongoose.model("short_url", shortUrlSchema);

module.exports = ShortUrlModel; 