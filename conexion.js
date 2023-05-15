const Sequilize = require('sequelize');
/*Usuarios Login*/
const Usuario_Modelo = require('./modelo/usuarios');
const Administrador_Modelo = require('./modelo/administradores')
const ServicioSocial_Modelo = require('./modelo/servicioSocial');
const HoraServicio_Modelo = require('./modelo/horaServicio');
const Donaciones_Modelo = require('./modelo/donaciones');
const LibroConsulta =  require('./modelo/librosConsulta');
const LibrosGeneral = require('./modelo/librosGeneral');
const LibroInfaltil = require('./modelo/librosInfantil');
const PrestamoLibro = require('./modelo/prestamos');

const Conexion=new Sequilize('biblioteca','root','root',{
    host:'localhost', dialect: 'mysql'
});

const Usuario = Usuario_Modelo(Conexion);
const Administrador = Administrador_Modelo(Conexion);
const ServicioSocial = ServicioSocial_Modelo(Conexion);
const HoraServicio = HoraServicio_Modelo(Conexion);
const Donaciones = Donaciones_Modelo(Conexion);
const Consulta = LibroConsulta(Conexion);
const General = LibrosGeneral(Conexion); 
const Infantil = LibroInfaltil(Conexion);
const Prestamo = PrestamoLibro(Conexion);


Conexion.sync({force:false})
.then(()=>{
    console.log("Conectado a Mysql...")
})
.catch((err)=>{
    console.log("Error, revise conexion --> ( "+err+" )")
}); 


module.exports={
    Usuario,Administrador,ServicioSocial,HoraServicio,Donaciones,Consulta,General,Infantil,Conexion,Prestamo
}