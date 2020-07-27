var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var brandSchema = new Schema({
    name:  {
        type: String, 
        unique : true, 
        required : true, 
        dropDups: true
    },
    logo: {
        type: String, 
        default: null
    },
    cars: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'cars', 
        }
    ]
});
module.exports = mongoose.model('brands', brandSchema);