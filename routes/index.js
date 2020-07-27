var express = require('express');
var Brand = require('../models/Brand');
var Car = require('../models/Car');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/brands', async (req, res) => {
  let keyword = 
      req.query.keyword == undefined ? "" : req.query.keyword;
  
  let brands = await Brand.find({
    name: new RegExp(keyword, 'i')
  });
  res.render('brands/index', {
    brands, 
    keyword
  });
});

router.get('/brands/create', function(req, res){
  res.render('brands/create');
});

router.post('/brands/create-save', async function(req, res){
  let data = {
    name: req.body.name,
    logo: req.body.logo
  };
  let model = await Brand.create(data);
  if(model.id != undefined){
    res.redirect('/brands');
  }
  res.send("Đã có lỗi xảy ra trong quá trình tạo mới hãng xe");
});

router.get('/brands/remove/:brandId', async function(req, res){
  let brandId = req.params.brandId;
  
  // thực hiện xóa
  await Brand.findOneAndRemove({_id: brandId})
      .catch((err) => {
        res.send("Không tìm thấy thông tin hãng ô tô");
      })
  res.redirect('/brands');
});

router.get('/brands/:brandId', async function(req, res){
  let brandId = req.params.brandId;
  // kiểm tra xem có tồn tại bản ghi trong db với id nhận đc hay không
  let brand = await Brand.findById(brandId)
                          .catch((err) => {
                            res.send("Không tìm thấy thông tin hãng ô tô");
                          });

  let cars = await Car.find({
                    brand_id: brandId 
                  });
  
  res.render('brands/detail', {brand, cars});
});







// url: brands/create => hiển thị màn hình thêm hãng
// url: brands/save-create => lưu thông tin gửi lên từ màn hình create
// url: brands/update/{id} => hiển thị màn hình sửa thông tin hãng
// url: brands/save-update/{id} => lưu thông tin cập nhật hãng
// url: brands/remove/{id} => xóa thông tin của 1 hãng xe



module.exports = router;
