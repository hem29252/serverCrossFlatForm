const express = require('express')
const router = express.Router()
const db = require('../db')

router.route('/products?')
    .get((req, res, next) => { 
      
        let sql = ' SELECT a.*, (SELECT COUNT(b.pid) FROM products b) AS total FROM products a '
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
                "message": "Internal Server Error" // error.sqlMessage
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
        let product = {
            "pname": req.body.pname,
            "pdetails": req.body.pdetails,
            "farm_id": req.body.farm_id
        }

        let sql = ' INSERT INTO products SET ? '
        db.query(sql, product, (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            province = [{'pid':results.insertId, ...product}]
            const result = {
                "status": 200,
                "data": product
            }
            return res.json(result)        
        })
    })
 
router.route('/product/:id')
    .all((req, res, next) => { 
        let sql = ' SELECT * FROM products WHERE pid = ? '
        db.query(sql, [req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            }) 
            res.product = results 
            next()  
        })        
    })
    .get((req, res, next) => { 
        const result = {
            "status": 200,
            "data": res.product
        }
        return res.json(result)
    })
    .put((req, res, next) => {   
        let product = {
            "pname": req.body.pname,
            "pdetails": req.body.pdetails,
            "farm_id": req.body.farm_id
        }        
        let sql = ' UPDATE products SET ? WHERE pid = ? '
        db.query(sql, [product, req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            if(results.affectedRows > 0) {
                product = Object.assign(res.product[0], product)
            }else{
                product = res.product
            }
            const result = {
                "status": 200,
                "data": product
            }
            return res.json(result)        
        })
    })
    .delete((req, res, next) => { 
        let sql = ' DELETE FROM products WHERE pid = ? '
        db.query(sql, [req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            const result = {
                "status": 200,
                "data": res.product
            }
            return res.json(result)        
        })
    })

router.get('/products/show', (req, res, next) => {
        let sql = 'SELECT * from products INNER JOIN farms on (products.farm_id = farms.farm_id )'
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

router.get('/products/sigle/:id', (req, res, next) => {
        let sql = 'SELECT * from products INNER JOIN farms on (products.farm_id = farms.farm_id ) WHERE products.pid = ?'
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

router.get('/products/farm/:id', (req, res, next) => {
        let sql = 'SELECT * from products INNER JOIN farms on (products.farm_id = farms.farm_id ) WHERE farms.farm_id = ?'
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
