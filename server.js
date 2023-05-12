// Import Express
import express from 'express';
import connect from './modules/db.js'
import cors from 'cors'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3001" }));
  
app.get('/', function (req, res) {
  res.send('Hello World!');
});

function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }
  return true;
}

connect()
  .then((client) => {
    var pet = client.db("Pet");
    var board = client.db("Board");

    console.log('Connected to the Pet database');

    app.post('/login', async (req, res) => {
      const { email, pwd } = req.body;
      if (!(email && pwd)) {
        res.send(400)
      } else {
        var pre = await pet.collection("users").findOne({email: email, pwd: pwd});
        console.log(pre)
        if (isEmpty(pre)) {
          res.json({result: "No credential matched"});
        } else {
          res.json(pre)
        }
      }
    })

    app.post('/register', async (req, res) => {
      const { email, pwd, firstName, lastName, license, pets } = req.body
      if (!(email && pwd && firstName && lastName && license && pets )) {
        res.send(400)
      } else {
        var pre = await pet.collection("users").findOne({email: email});
        if (pre) {
          res.send({result: "There is another account with same email"})
        } else {
          await pet.collection("users").insertOne({
            email: email,
            pwd: pwd,
            firstName: firstName,
            lastName: lastName,
            license: license,
            pets: pets
          }) 
          res.send(200);
        }
      }
    })

    app.get('/board', async (req, res) => {
      res.json(await board.collection('blog').find({}).toArray());
    })

    app.post('/breeds', async (req, res) => {
      const { name, size, loyality } = req.body;
      if (!(name && size && loyality)) {
        res.send(400)
      } else {
        pet.collection('breeds').insertOne({})
      }
    })

    var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Server is working : PORT - ',port);
})});