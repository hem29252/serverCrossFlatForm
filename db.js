const mysql = require('mysql')

const db = mysql.createConnection({
      host: '128.199.105.221',
      user: 'root',
      password: 'admin123',
      database: 'myDb',
      port: '3306'
})

db.connect((err) => {
  if(err){
    console.log('Error connected as ' + err.stack )
  }

  console.log('connected as ' + db.threadId)
})


module.exports = db
