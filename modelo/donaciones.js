const Sequilize = require('sequelize');
const DataType = Sequilize.DataTypes;


module.exports=(conexion)=>{
    const donacion_Shema = conexion.define(
        'donacion',{
            id:{
                type:Sequilize.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            categoria:{
                type:Sequilize.STRING
            },
            cantidad:{
                type:Sequilize.INTEGER
            },
            descripcion:{
                type:Sequilize.STRING,
            },
            correo:{
                type:Sequilize.STRING
            },
        }
        
    );
    return donacion_Shema;
}