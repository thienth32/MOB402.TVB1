var express = require('express');
var Brand = require('../models/Brand');
var Car = require('../models/Car');
const { response } = require('express');
var router = express.Router();
var uniqid = require('uniqid');
let fs = require('fs');

// npm install  body-parser cors express-fileupload morgan lodash --save

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
    logo: null
  };
  if(req.files){
    // let logo = req.files.logo;
    const {logo} = req.files;
    const filename = "logo/" + uniqid() + "-" + logo.name;
    // const filename = `logo/${uniqid()}-${logo.name}`;
    // lưu file sang thư mục đích => uploads/logo/filename
    logo.mv(`./uploads/${filename}`);
    data.logo = filename;
  }
  let model = await Brand.create(data);
  if(model.id != undefined){
    res.redirect('/brands');
  }
  res.send("Đã có lỗi xảy ra trong quá trình tạo mới hãng xe");
});

router.get('/brands/remove/:brandId', async function(req, res){
  let brandId = req.params.brandId;
  // let brand = await Brand.findById(brandId);
  // fs.unlinkSync(`./uploads/${brand.logo}`);
  // res.send(brand);
  // thực hiện xóa
  await Brand.findOneAndRemove({_id: brandId})
      .catch((err) => {
        res.send("Không tìm thấy thông tin hãng ô tô");
      })
  res.redirect('/brands');
});

router.get('/brands/update/:brandId', async function(req, res){
  let brandId = req.params.brandId;
  let brand = await Brand.findById(brandId)
                        .catch((err) => {
                          res.send("Không tìm thấy thông tin hãng ô tô");
                        });
  res.render('brands/update', {brand});
});

router.post('/brands/save-update/:brandId', async function(req, res){
  let brandId = req.params.brandId;

  let brand = await Brand.findById(brandId)
                        .catch((err) => {
                          res.send("Không tìm thấy thông tin hãng ô tô");
                        });
  let data = {
    name: req.body.name,
    logo: brand.logo
  };
  if(req.files){
    let logo = req.files.logo;
    const filename = "logo/" + uniqid() + "-" + logo.name;
    logo.mv(`./uploads/${filename}`);
    data.logo = filename;
  }
  brand.overwrite(data);
  await brand.save();
  res.redirect('/brands');
})

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
