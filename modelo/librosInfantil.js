const Sequilize = require('sequelize');
const DataType = Sequilize.DataTypes;


module.exports=(conexion)=>{
    const infantil_Shema = conexion.define(
        'libroInfantil',{
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
    return infantil_Shema;
}