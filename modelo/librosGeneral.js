const Sequilize = require('sequelize');
const DataType = Sequilize.DataTypes;


module.exports=(conexion)=>{
    const general_Shema = conexion.define(
        'libroGeneral',{
            id:{
                type:Sequilize.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            orden:{
                type:Sequilize.FLOAT
            },
            titulo:{
                type:Sequilize.STRING
            },
            volumen:{
                type:Sequilize.INTEGER
            },
            categoria:{
                type:Sequilize.STRING
            },
            autor:{
                type:Sequilize.STRING
            },
            editorial:{
                type:Sequilize.STRING
            },
            descripcion:{
                type:Sequilize.STRING
            },
            estado:{
                type:Sequilize.BOOLEAN
            }
        }
        
    );
    return general_Shema;
}