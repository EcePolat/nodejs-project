const express = require("express");
const Response = require("../lib/Response");
const router = express.Router();
const moment = require("moment");
const AuditLogs = require("../db/models/AuditLogs");
const Categories = require("../db/models/Categories");
const Users = require("../db/models/Users");
const auth = require("../lib/auth")();

router.all("*", auth.authenticate(), (req,res,next) => {
    next();
});

// Audit logs tablosunda işlem yapan kişilerin hangi tip işlemi kaç kez yaptığını veren bir sorgu.
router.post("/auditlogs/categories", async (req, res) => {
    
    try{

        let result = await AuditLogs.aggregate([
            {$match: {location: "Categories"}},
            {$group: {_id: {email: "$email", proc_type: "$proc_type"}, count: {$sum: 1}}},
            {$sort: {count: -1}}
        ]);

        res.json(Response.successResponse(result));

    } catch(err){
        let errorResponse = Response.errorResponse(err, req.user?.language);
        res.status(errorResponse.code).json(errorResponse);
    }
});


//Kategori tablosunda tekil veri sayısı
router.post("/categories/unique", async (req, res) => {
    
    try{

        let body = req.body;
        let filter = {};

        if(typeof body.is_active === "boolean") filter.is_active = body.is_active;

        let result = await Categories.distinct("name", filter);

        res.json(Response.successResponse({result, count: result.length}));

    } catch(err){
        let errorResponse = Response.errorResponse(err, req.user?.language);
        res.status(errorResponse.code).json(errorResponse);
    }
});

//Sistemde tanımlı kaç kullanıcı var
router.post("/users/count", async (req, res) => {
    
    try{

        let result = await Users.countDocuments({is_active: true});

        res.json(Response.successResponse(result));

    } catch(err){
        let errorResponse = Response.errorResponse(err, req.user?.language);
        res.status(errorResponse.code).json(errorResponse);
    }
});


module.exports = router;