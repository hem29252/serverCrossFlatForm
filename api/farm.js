const express = require('express')
const router = express.Router()
const db = require('../db')

router.route('/farms?')
    .get((req, res, next) => {
        let sql = ' SELECT a.*, (SELECT COUNT(b.farm_id) FROM farms b) AS total FROM farms a'
        let per_page = 10  
        let page = 1  
        let offset = 0 
        let total = 0 
        if(req.query.page){ 
            page = req.query.page  
            offset = (page-1) * per_page  
            sql += ' LIMIT '+ offset +','+ per_page +' ' 
        }
        db.query(sql,(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            total = results.length 
            if(req.query.page && total>0) total = results[0].total 

            const result = {
                "status": 200,
                "total":total, 
                "current_page":page, 
                "total_page":Math.ceil(total/per_page), 
                "data": results  
            }
            return res.json(result)        
        })
    })
    .post((req, res, next) => {   
        let farm = {
            "farm_name": req.body.farm_name,
            "farm_address": req.body.farm_address,
            "user_id": req.body.user_id,
            "farm_logo": req.body.farm_logo,
            "lat": req.body.lat,
            "lon": req.body.lon
        }
        let sql = ' INSERT INTO farms SET ? '
        db.query(sql, farm, (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            })
            farm = [{'farm_id':results.insertId, ...farm}]
            const result = {
                "status": 200,
                "data": farm
            }
            return res.json(result)
        })
    })

router.route('/farm/:id')
    .all((req, res, next) => {
        let sql = ' SELECT * FROM farms WHERE farm_id = ? '
        db.query(sql, [req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            })
            res.farm = results
            next()
        })
    })
    .get((req, res, next) => {
        const result = {
            "status": 200,
            "data": res.farm
        }
        return res.json(result)
    })
    .put((req, res, next) => {
        let farm = {
            "farm_name": req.body.farm_name,
            "farm_address": req.body.farm_address,
            "user_id": req.body.user_id,
            "farm_logo": req.body.farm_logo,
            "lat": req.body.lat,
            "lon": req.body.lon
        }
        let sql = ' UPDATE farms SET ? WHERE farm_id = ? '
        db.query(sql, [farm, req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            if(results.affectedRows > 0) {
                farm = Object.assign(res.farm[0], farm)
            }else{
                farm = res.farm
            }
            const result = {
                "status": 200,
                "data": farm
            }
            return res.json(result)
        })
    })
    .delete((req, res, next) => { 
        let sql = ' DELETE FROM farms WHERE farm_id = ? '
        db.query(sql, [req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            const result = {
                "status": 200,
                "data": res.province
            }
            return res.json(result)
        })
    })

router.get('/farm/user/:id', (req, res, next)=>{
        let sql = ' SELECT * FROM farms WHERE user_id = ? '
        db.query(sql,[req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            })
            const result = {
                "status": 200,
                "data": results
            }
            return res.json(result)
        })
})

module.exports = router
