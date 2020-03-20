const express = require('express');
const app = express();
const Odoo = require('odoo-xmlrpc');
const port = 3000

var odoo = new Odoo({
    url: 'http://localhost',
    port: '8069',
    db: 'test',
    username: 'andres',
    password: '1966'
});


odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    var params = [];
    params.push(inParams);
    odoo.execute_kw('res.partner', 'search_count', params, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});


app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening on port port!`))