const express = require('express')
const router = express.Router()
const db = require('../db') 

router.route('/messages?')
    .get((req, res, next) => { 
        let sql = ' SELECT * FROM message '
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
        let message = {
             "chatroom_id": req.body.chatroom_id,
             "sender": req.body.sender,
             "content": req.body.content
        }

        let sql = ' INSERT INTO message SET ? '
        db.query(sql, message, (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            message = [{'message_id':results.insertId, ...message}]
            const result = {
                "status": 200,
                "data": message
            }
            return res.json(result)
        })
    })

router.route('/message/:id')
    .all((req, res, next) => { 
        let sql = ' SELECT * FROM message WHERE message_id = ? '
        db.query(sql, [req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            })
            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            })
            res.message = results
            next()
        })
    })
    .get((req, res, next) => {
        const result = {
            "status": 200,
            "data": res.message
        }
        return res.json(result)
    })
    .put((req, res, next) => {
        let message = {
             "chatroom_id": req.body.chatroom_id,
             "sender": req.body.sender,
             "content": req.body.content
        }
        let sql = ' UPDATE message SET ? WHERE message_id = ? '
        db.query(sql, [message, req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            if(results.affectedRows > 0) {
                message = Object.assign(res.message[0], message)
            }else{
                user = res.message
            }
            const result = {
                "status": 200,
                "data": message
            }
            return res.json(result)
        })
    })
    .delete((req, res, next) => {
        let sql = ' DELETE FROM message WHERE message_id = ? '
        db.query(sql, [req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            })
            const result = {
                "status": 200,
                "data": res.message
            }
            return res.json(result)
        })
    })

router.get('/chatroom/message/:id', (req, res, next) => {
        let sql = ' SELECT * FROM message WHERE chatroom_id = ?'
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
