const express = require('express')
const router = express.Router()
const db = require('../db') 

router.route('/chatrooms?')
    .get((req, res, next) => { 
        let sql = ' SELECT * FROM chatroom '
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
        let room = {
               "member_01":req.body.member_01,
               "member_02":req.body.member_02
        }

        let sql = ' INSERT INTO chatroom SET ? '
        db.query(sql, room, (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            room = [{'chatroom_id':results.insertId, ...room}]
            const result = {
                "status": 200,
                "data": room
            }
            return res.json(result)        
        })
    })

router.route('/chatroom/:id')
    .all((req, res, next) => { 
        let sql = ' SELECT * FROM chatroom WHERE chatroom_id = ? '
        db.query(sql, [req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            if(results.length ===0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            }) 
            res.room = results 
            next()  
        })        
    })
    .get((req, res, next) => { 
        const result = {
            "status": 200,
            "data": res.room
        }
        return res.json(result)
    })
    .put((req, res, next) => {   
        let room = {
               "member_01":req.body.member_01,
               "member_02":req.body.member_02
        }
        let sql = ' UPDATE chatroom SET ? WHERE chatroom_id = ? '
        db.query(sql, [room, req.params.id], (error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            if(results.affectedRows > 0) {
                room = Object.assign(res.room[0], room)
            }else{ 
                room = res.room
            }
            const result = {
                "status": 200,
                "data": room
            }
            return res.json(result)        
        })
    })
    .delete((req, res, next) => { 
        let sql = ' DELETE FROM chatroom WHERE chatroom_id = ? '
        db.query(sql, [req.params.id],(error, results, fields)=>{
            if(error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" 
            })
            const result = {
                "status": 200,
                "data": res.room
            }
            return res.json(result)        
        })
    })

router.get('/chatroom/user/:id',(req, res, next)=>{
        let sql = 'SELECT * FROM `chatroom` INNER JOIN users ON ( chatroom.member_01 = users.user_id OR chatroom.member_02 = users.user_id ) WHERE (chatroom.member_01 = ? OR chatroom.member_02 = ?) AND users.user_id != ?;'
        db.query(sql,[req.params.id, req.params.id, req.params.id],(error, results, fields)=>{
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
