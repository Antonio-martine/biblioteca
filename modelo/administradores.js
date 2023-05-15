const Sequilize = require('sequelize');
const DataType = Sequilize.DataTypes;


module.exports=(conexion)=>{
    const administrador_Schema = conexion.define(
        'administrador',{
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
    return administrador_Schema;
}