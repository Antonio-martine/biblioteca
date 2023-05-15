const Sequilize = require('sequelize');
const DataType = Sequilize.DataTypes;


module.exports=(conexion)=>{
    const horaServicio_Shema = conexion.define(
        'horaServicio',{
            id:{
                type:Sequilize.INTEGER,
                primaryKey:true,
                autoIncrement:true
            },
            fecha1:{
                type:Sequilize.DATE
            },
            fecha2:{
                type:Sequilize.DATE
            },
            hora:{
                type:Sequilize.INTEGER,
            },
            correo:{
                type:Sequilize.STRING
            },
        }
        
    );
    return horaServicio_Shema;
}