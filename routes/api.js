var express = require('express');
var Brand = require('../models/Brand');
var Car = require('../models/Car');
const { response } = require('express');
var router = express.Router();
var uniqid = require('uniqid');

router.get('/brands', async function(req, res){
    let keyword = req.query.keyword != undefined ? req.query.keyword : "";

    let brands = await Brand.find({
                    name: new RegExp(keyword, 'i')
                });
    res.json({
        keyword: keyword,
        data: brands
    });
});

router.post('/brands', async function(req, res){
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
        res.json({
            result: true,
            data: model
        });
    }else{
        res.json({
            result: false,
            message: "Tạo hãng không thành công"
        });
    }
});
router.post('/brands/:brandId', async function(req, res){
    let brandId = req.params.brandId;

    let brand = await Brand.findById(brandId)
                            .catch((err) => {
                                res.json({
                                    result: false,
                                    message: "Không tìm thấy thông tin hãng ô tô"
                                });
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
    res.json({
        result: true,
        data: brand
    });
});

router.get('/brands/:brandId', async function(req, res){
    let brandId = req.params.brandId;

    let brand = await Brand.findById(brandId)
                            .catch((err) => {
                                res.json({
                                    result: false,
                                    message: "Không tìm thấy thông tin hãng ô tô"
                                });
                            });
    res.json(brand);
});

    

module.exports = router;
