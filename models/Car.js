var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var brandSchema = new Schema({
    name:  {
        type: String, 
        unique : true, 
        required : true, 
        dropDups: true
    },
    image: {
        type: String, 
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    brand_id: {
        type: Schema.Types.ObjectId, 
        ref: 'brands'
    }
});
module.exports = mongoose.model('cars', brandSchema);