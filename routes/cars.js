var express = require('express');
var Brand = require('../models/Brand');
var Car = require('../models/Car');
const { response } = require('express');
var router = express.Router();

// url: /cars
router.get('/', async function(req, res){
    // lấy toàn bộ dữ liệu của collection cars kèm theo thông tin brands mà mỗi xe thuộc về
    let cars = await Car.find({})
                        .populate('brand_id');
    let keyword = "";
    console.log(cars);

    res.render('cars/index', 
                    {cars, keyword});
});

// url: /cars/remove/tham số id của xe
router.get('/remove/:carId', async function(req, res){
    // lấy dữ liệu carId từ đường dẫn
    let carId = req.params.carId;
  
    // thực hiện xóa dựa trên carId tìm đc
    await Car.findOneAndRemove({_id: carId})
        .catch((err) => {
            res.send("Không tìm thấy thông tin xe ô tô");
        })
    // điều hướng website về url: /cars
    res.redirect('/cars');
});

// url: /cars/create => sinh ra màn hình để thêm mới 1 xe ô tô
router.get('/create', async function(req, res){
    // lấy ra tất cả các hãng xe để người dùng chọn hãng cho xe ô tô mới (hiển thị ở thẻ select)
    let brands = await Brand.find();
    res.render('cars/create', {brands});
});

router.post('/save-create', async function(req, res){
    // nhận dữ liệu từ form gửi lên
    let {name, image, brand_id, price} = req.body;
    
    // tạo mới Car dựa vào thông tin từ form
    let model = await Car.create({name, image, brand_id, price});
    // tạo thành công => id có giá trị => điều hướng về danh sách ô tô
    if(model.id != undefined){
        res.redirect('/cars');
    }

    res.send("Không tạo thành công !");
});



module.exports = router;