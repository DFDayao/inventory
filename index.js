const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'inventorydb',
     multipleStatements: true
});

    con.connect((err) => {
    if (!err)
        console.log('DB connection succeeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is running!'));


//Get all items
app.get('/items', (req, res) => {
    con.query('SELECT * FROM inventorydb.items', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get items
app.get('/items/:id', (req, res) => {
    con.query('SELECT * FROM inventorydb.items WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete items
app.delete('/items/:id', (req, res) => {
    con.query('DELETE FROM inventorydb.items WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert item
app.post('/items', (req, res) => {
    let tem = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @quantity = ?;SET @amount = ?; \
    CALL new_procedure(@id,@name,@quantity,@amount);";
    con.query(sql, [tem.id, tem.name, tem.quantity, tem.amount], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted item id : '+element[0].id);
            });
        else
            console.log(err);
    })
});


//Update item
app.put('/items', (req, res) => {
    let tem = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @quantity = ?;SET @amount = ?; \
    CALL new_procedure(@id,@name,@quantity,@amount);";
    con.query(sql, [tem.id, tem.name, tem.quantity, tem.amount], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});