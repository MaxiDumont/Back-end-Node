const express = require('express')
const app = express()
const PORT = process.env.PORT || 3999;
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});

app.use((req, res, next) => {
    // res.status(404).send("Sorry cant find that!");
    res.status(404).sendFile(__dirname + "/public/404.html");
  });

//ruta de pruba 
app.get('/prueba',(req,res)=>{
    res.status(200).send({message:'Hola mundo desde mi API REST con NodeJS'})
});


// //cors Configurar cabeceras y cors
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, application/json, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });