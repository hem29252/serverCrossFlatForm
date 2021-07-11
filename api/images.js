const express = require('express')
const router = express.Router()
const db = require('../db') 
 
router.route('/images?')
    .get((req, res, next) => { 
        let sql = ' SELECT * FROM pphoto '
        db.query(sql,(error, results, fields)=>{
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
    .post((req, res, next) => {   
        let image = {
             "ptname": req.body.ptname,
             "pid": req.body.pid
        }

        let sql = ' INSERT INTO pphoto SET ? '
        db.query(sql, image, (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            image = [{'ptid':results.insertId, ...image}]
            const result = {
                "status": 200,
                "data": image
            }
            return res.json(result)        
        })
    })
 
router.route('/image/:id')
    .all((req, res, next) => { 
        let sql = ' SELECT * FROM pphoto WHERE ptid = ? '
        db.query(sql, [req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            })
            res.image = results 
            next()  
        })        
    })
    .get((req, res, next) => { 
        const result = {
            "status": 200,
            "data": res.image
        }
        return res.json(result)
    })
    .put((req, res, next) => {   
        let image = {
             "ptname": req.body.ptname,
             "pid": req.body.pid
        }
        let sql = ' UPDATE pphoto SET ? WHERE ptid = ? '
        db.query(sql, [image, req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            if(results.affectedRows > 0) {
                image = Object.assign(res.image[0], image)
            }else{ 
                user = res.image
            }
            const result = {
                "status": 200,
                "data": image
            }
            return res.json(result)        
        })
    })
    .delete((req, res, next) => { 
        let sql = 'DELETE FROM pphoto WHERE ptid = ? '
        db.query(sql, [req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            const result = {
                "status": 200,
                "data": res.image
            }
            return res.json(result)        
        })
    })
 
module.exports = router
