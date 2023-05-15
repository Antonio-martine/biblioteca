const Sequilize = require('sequelize');
const DataType = Sequilize.DataTypes;


module.exports=(conexion)=>{
    const usuario_Schema = conexion.define(
        'usuario',{
            id:{
                type:Sequilize.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            perfil:{
                type:Sequilize.BLOB
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
    return usuario_Schema;
}