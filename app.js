const express = require('express');
const path = require('path');
const session = require('express-session');
const Usuario = require('./rutas/usuario');
const Admin = require('./rutas/administrador');
const Servicio = require('./rutas/servicio');


const app = express();

app.use('/static',express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:'qwerty123',
    resave:true,
    saveUninitialized: true
}));

app.use('/',Usuario);
app.use('/admin',Admin);
app.use('/servicio',Servicio);

app.listen(8080,()=>{
    try{
        console.log("Status activate...");
    }catch{
        console.log("Status error...");
    }
});
