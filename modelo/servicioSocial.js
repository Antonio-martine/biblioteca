const Sequilize = require('sequelize');
const DataType = Sequilize.DataTypes;


module.exports=(conexion)=>{
    const sevicioSocial_Schema = conexion.define(
        'servicioSocial',{
            id:{
                type:Sequilize.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            nombre:{
                type:Sequilize.STRING
            },
            apellido:{
                type:Sequilize.STRING
            },
            escuela:{
                type:Sequilize.STRING
            },
            fechaInicio:{
                type:Sequilize.DATE
            },
            fechaTermino:{
                type:Sequilize.DATE
            },
            totalHoras:{
                type:Sequilize.INTEGER
            },
            correo:{
                type:Sequilize.STRING
            },
            password:{
                type:Sequilize.STRING
            },
            identificador:{
                type:Sequilize.STRING
            },
            tipo:{
                type:Sequilize.STRING,
            },
            estado:{
                type:Sequilize.BOOLEAN,
            }
        }
        
    );
    return sevicioSocial_Schema;
}