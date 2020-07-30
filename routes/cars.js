var express = require('express');
var Brand = require('../models/Brand');
var Car = require('../models/Car');
const { response } = require('express');
var router = express.Router();

router.get('/', async function(req, res){
    let cars = await Car.find({});
    let keyword = "";
    console.log(cars);

    res.render('cars/index', 
                    {cars, keyword});
});
router.get('/create', function(req, res){
    res.send('Tạo mới ô tô');
});



module.exports = router;