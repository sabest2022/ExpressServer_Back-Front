const express = require('express');
const { join } = require('path');
const Joi = require('joi');
const app = express();

var cors = require('cors');
app.use(cors());
fs = require('fs'),
    url = require('url');
app.use(express.json());

let fileproduct = __dirname + '/public/data.json';

const schema = Joi.number().required();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/')
});

app.get('/receive/:id', function (req, res) {
    // const response = request.body
    var obj = JSON.parse(fs.readFileSync(fileproduct, 'utf8'));
    var item = obj.find(c => c.id == parseInt(req.params.id));
    if (!item) {
        res.status(404).send({ product: "Product with given Id not found!" });
    } else {
        res.status(200).send(item);
    }
});

app.post('/create', function (request, respond) {

    var obj = JSON.parse(fs.readFileSync(fileproduct, 'utf8'));
    console.log(obj);
    request.on('data', (data) => {
        data = JSON.parse(data);
        var index = obj.find(item => item.id == data.id);
        if (!index) {
            obj.push(data);
            obj.sort((a, b) => { return a.id - b.id; });
            fs.writeFile(fileproduct, JSON.stringify(obj), (err) => {
                if (err) { console.log(err) }
                respond.status(200).send(`Product with id: ${data.id} and name: ${data.product}, added to database!`);
            });
        } else {
            respond.status(401).send(`Product with id: ${data.id} and name: ${index.product} exist on the database! you can use Put to replace a product... `);
            respond.end();
        }
    });
});
app.put('/update/:id', function (req, res) {
    var obj = JSON.parse(fs.readFileSync(fileproduct, 'utf8'));
    var item = obj.find(c => c.id == parseInt(req.params.id));
    if (!item) {
        res.status(404).send('Product with given Id not found!');
    } else {
        var index = obj.findIndex(item => item.id == parseInt(req.params.id));
        req.on('data', (data) => {
            data = JSON.parse(data);
            if (item.id === data.id) {
                obj.splice(index, 1);
                obj.push(data);
                obj.sort((a, b) => { return a.id - b.id; });
                fs.writeFile(fileproduct, JSON.stringify(obj), (err) => {
                    if (err) { console.log(err) }
                    res.end();
                });
                res.status(200).send("Product replaced on database.");
            } else {
                res.status(404).send("Product's id is not matched with your request id");
            }
        });
    }
});

app.delete('/delete/:id', function (req, res) {
    var obj = JSON.parse(fs.readFileSync(fileproduct, 'utf8'));
    var item = obj.find(c => c.id == parseInt(req.params.id));
    if (!item) {
        res.status(404).send('Product with given Id not found!');
    } else {
        var index = obj.findIndex(item => item.id == parseInt(req.params.id));
        obj.splice(index, 1);
        fs.writeFile(fileproduct, JSON.stringify(obj), (err) => {
            if (err) { console.log(err) }
            res.status(200).send("Product with given id, deleted from database.")
            res.end();
        });
    }
});





const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
