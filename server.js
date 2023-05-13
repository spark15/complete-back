// Import Express
import express from 'express';
import connect from './modules/db.js'
import cors from 'cors'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  
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

    // API call to login and leave a session information but it has not been implemented because of priority
    app.post('/login', async (req, res) => {
      const { email, pwd } = req.body;
      if (!(email && pwd)) {
        res.send(400)
      } else {
        var pre = await pet.collection("users").findOne({email: email, pwd: pwd});
        console.log(pre)
        if (isEmpty(pre)) {
          res.send(400);
        } else {
          res.json(pre)
        }
      }
    })

    // API call to make an account
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

    // API call to get the articles from the board.
    app.get('/board', async (req, res) => {
      res.json(await board.collection('blog').find({}).toArray());
    })

    // API call to get all the breeds
    app.post('/breeds', async (req, res) => {
      const { name, size, loyality } = req.body;
      if (!(name && size && loyality)) {
        res.send(400)
      } else {
        pet.collection('breeds').insertOne({})
      }
    })

    // API call to edit the profile. Only firstname and lastName and pwd are allowed to be changed at this point.
    app.put('/EditProfile', async (req, res) => {
      const { firstName, lastName, email, pwd } = req.body;
      console.log(req.body)
      var err = await pet.collection('users').updateOne(
        {email: email},
        {$set: {firstName: firstName, lastName: lastName, pwd: pwd}});
      if (err.status == 400) {
        res.send(400)
      } else {
        res.send(200)
      }
    })

    var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Server is working : PORT - ', 80);
})});