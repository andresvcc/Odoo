const express = require('express');
const app = express();
// const Odoo = require('odoo-xmlrpc');
const port = 3000

var Odoo = require('node-odoo');
 
var odoo = new Odoo({
  host: 'localhost',
  port: 8069,
  database: 'test',
  username: 'demo',
  password: '1966'
});
 
// Connect to Odoo
odoo.connect(function (err) {
  if (err) { return console.log(err); }
 
  // Get a partner
  odoo.get('res.partner', 4, function (err, partner) {
    if (err) { return console.log(err); }
 
     console.log('Partner', partner);
  });
});



app.get('/', (req, res) => {
    var all = []

    var params = {
        fields: [ 'name', 'list_price'],
        limit: 5,
        offset: 0,  
      }; //params


    odoo.get('product.product', params, function (err, partner) {
        if (err) { return console.log(err); }
        all = partner
        console.log(partner)
    });

    res.send({all, info:'res.user'})
})


app.listen(port, () => console.log(`Example app listening on port port!`))