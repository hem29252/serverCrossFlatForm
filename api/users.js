const express = require('express')
const router = express.Router()
const db = require('../db')

router.route('/users?')
    .get((req, res, next) => {
        let sql = ' SELECT * FROM users'
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
        let user = {
            "email": req.body.email,
            "password": req.body.password,
            "user_type": req.body.user_type
        }

        let sql = ' INSERT INTO users SET ? '
        db.query(sql, user, (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            user = [{'id':results.insertId, ...user}]
            const result = {
                "status": 200,
                "data": user
            }
            return res.json(result)
        })
    })

router.route('/user/:id')
    .all((req, res, next) => {
        let sql = ' SELECT * FROM users WHERE user_id = ? '
        db.query(sql, [req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            })
            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            })
            res.user = results
            next()
        })
    })
    .get((req, res, next) => {
        const result = {
            "status": 200,
            "data": res.user
        }
        return res.json(result)
    })
    .put((req, res, next) => {
        let user = {
            "email": req.body.email,
            "password": req.body.password,
            "user_type": req.body.user_type
        }
        let sql = ' UPDATE users SET ? WHERE user_id = ? '
        db.query(sql, [user, req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            })
            if(results.affectedRows > 0) {
                user = Object.assign(res.user[0], user)
            }else{
                user = res.user
            }
            const result = {
                "status": 200,
                "data": user
            }
            return res.json(result)
        })
    })
    .delete((req, res, next) => {
        let sql = ' DELETE FROM users WHERE user_id = ? '
        db.query(sql, [req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            })
            const result = {
                "status": 200,
                "data": res.user
            }
            return res.json(result)
        })
    })


router.route('/login')
      .post((req, res, nex) => {
        let sql = ' SELECT * FROM users WHERE email = ? AND password = ?'
        
        db.query(sql,[req.body.email, req.body.password],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            })

            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            })

            const result = {
                "status": 200,
                "data": results
            }
            return res.json(result)
        })
})
module.exports = router
