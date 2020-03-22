const express = require('express');
const cors = require('cors');
const app = express();
const Odoo = require('./odoo');

app
    .use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:4000', 'https://adminhapp.herokuapp.com', 'http://adminhapp.herokuapp.com'] })) // Configurer les options d'identification sur true, necesaire pour la detection des session avec une meme cle
    .use(express.json({ limit: '50mb' }))
    .use(express.urlencoded({ extended: true, limit: '50mb' }))
    .set('trust proxy', 1)

const port = 3000

var odoo = new Odoo({
  host: 'localhost',
  port: 8069,
  database: 'sie',
  username: 'admin',
  password: 'admin'
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

const searchOdoo = (data) => new Promise((resolve) => {
    const model = data.model || '';
    const params = data.params || '';
        odoo.search(model,params, function (err, partner) {
            if (err) return resolve({err})
            if(data.array === true) return resolve(partner)
            const obj = []
            partner.map((value)=>{
                obj.push({id: value})
            })
            resolve(obj)
        });
});

const getOdoo = (data) => new Promise((resolve) => {
    const model = data.model || '';
    const params = data.params || '';
    // Connect to Odoo
        odoo.get(model, params, function (err, obj) {
            if (err) { return resolve({err})}
            resolve(obj)
        });
});

const updateOdoo = (data) => new Promise((resolve) => {
    const model = data.model || '';
    const params = data.params || '';
    const id = data.id || ''
    // Connect to Odoo

        odoo.update(model, id, params, function (err, obj) {
            if (err) { 
                console.log({err})
                return resolve({err})
            }
            resolve(obj)
        });
}); 

const createOdoo = (data) => new Promise((resolve) => {
    const model = data.model || '';
    const params = data.params || '';
    // Connect to Odoo

    odoo.create(model, params, function (err, obj) {
        if (err) { return resolve({err})}
        resolve(obj)
    });

});

// const getOdooS = async (data)=> await getOdoo (data)

app.post('/', async(req, res) => {

    const {
        model,
        params,
        select,
    }  = req.body

    const ff = await searchOdoo ({
        model:model,
        params: params || [['id', '=', true]],
        array: true
    })

    if(ff.err) return res.send({errorINsearch: ff})

    const list = await getOdoo ({
        model:model,
        params: ff
    })

    if(list.err) return res.send({errorINget: list})


    if (select == "all") return  res.send({info: '♠', quantity: list.length, resultat: list.sort((a,b)=>a.id - b.id)}) 

    const rest = await Promise.all(list.map(item => {
        // console.log(item)
        const element = {
            id: item.id,
            name: item.name
        }

        select.map((value)=>{
            if(value === 'image' && model === 'product.product') element.image = `/web/image/product.product/${item.id}/image_1024/`
            else element[value] = item[value] || null 
        })

        return element
    }))

    res.send({info: '♠', quantity: rest.length, resultat: rest.sort((a,b)=>a.id - b.id)})
})

app.post('/create', async(req, res) => {

    const {
        model,
        params
    }  = req.body

    const ff = await createOdoo ({
        model:model,
        params: params
    })

    res.send({ff})
})


app.post('/update', async(req, res) => {

    const {
        model,
        params,
        id
    }  = req.body

    const ff = await updateOdoo ({
        model:model,
        params: params,
        id: id
    })

    res.send(ff)
})




app.listen(port, () => console.log(`Example app listening on port port!`))


