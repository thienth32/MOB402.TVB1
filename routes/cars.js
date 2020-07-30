var express = require('express');
var Brand = require('../models/Brand');
var Car = require('../models/Car');
const { response } = require('express');
var router = express.Router();

router.get('/', async function(req, res){
    let cars = await Car.find({})
                        .populate('brand_id');
    let keyword = "";
    console.log(cars);

    res.render('cars/index', 
                    {cars, keyword});
});

router.get('/remove/:carId', async function(req, res){
    let carId = req.params.carId;
  
    // thực hiện xóa
    await Car.findOneAndRemove({_id: carId})
        .catch((err) => {
            res.send("Không tìm thấy thông tin xe ô tô");
        })
    res.redirect('/cars');
});

router.get('/create', async function(req, res){
    let brands = await Brand.find();
    res.render('cars/create', {brands});
});



module.exports = router;