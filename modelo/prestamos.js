const Sequilize = require('sequelize');
const DataType = Sequilize.DataTypes;


module.exports=(conexion)=>{
    const prestamo_Shema = conexion.define(
        'prestamoLibro',{
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
            },
            correo:{
                type:Sequilize.STRING
            },
            fechaInicio:{
                type:Sequilize.DATE
            },
            fechaLimite:{
              type:Sequilize.DATE
            },
            FechaEntrega: {
                type:Sequilize.DATE
            },
        }
        
    );
    return prestamo_Shema;
}