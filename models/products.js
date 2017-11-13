var mongoose = require('mongoose')

var ProductSchema = mongoose.Schema;
ProductSchema = new mongoose.Schema({
    name: {type:String, match: [/[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ0-9]/, 'only letter or number are allowed' ]},
    description:{type:String, minlength: 20, maxlength:500, message: 'must be between 20 and 500 characters'},
    price: {type:Number, min:0}
})
ProductSchema.methods.prettyPrice = function () {
    return '$' + parseFloat(this.price).toFixed(2);
};
mongoose.model('Product', ProductSchema);