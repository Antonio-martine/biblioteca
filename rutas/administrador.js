const express = require('express');
const admin = express.Router();
const {Usuario,Administrador} = require('../conexion');
const {ServicioSocial,HoraServicio} = require('../conexion');
const {Donaciones} = require('../conexion');
const {Consulta,General,Infantil,Prestamo} = require('../conexion');
const CryptoJS = require("crypto-js");
const {Conexion} = require('../conexion');
const { QueryTypes, where } = require('sequelize');



/*Crypto*/
function Crypto(elemento){
    var encrypto = CryptoJS.AES.encrypt(elemento,'123456').toString();
    return encrypto;
}
/*NoCrypto*/
function NoCrypto(elemento){
    var bytes = CryptoJS.AES.decrypt(elemento,'123456');
    var originText = bytes.toString(CryptoJS.enc.Utf8);
    return originText;
}

/*Identificador*/
function genereatePWS(lenght) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var pwd = "";
    for (var i = 0; i < lenght; i++){
        var random = Math.floor(Math.random() * charset.length);
        pwd += charset.charAt(random);
    }
    return pwd;
}


admin.get('/registrar/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    })
    .then((administrador)=>{
        res.render('nuevo',{administrador:administrador});
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar ... "+err);
    });
});

admin.get('/registrarServicio/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    })
    
    .then((administrador)=>{
        res.render('servicioSocial',{administrador:administrador});
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar ... "+err);
    });
});

/*Página Principal*/
admin.get('/HomeAdmin/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({where:{identificador: req.params.id}})
    .then((administrador)=>{
        ServicioSocial.findAll({where:{estado:true}})
        .then((servicio)=>{
            Prestamo.findAll({where:{estado:true}})
            .then((prestamos)=>{
                res.render('adminHome',{administrador:administrador,servicio:servicio,prestamos:prestamos});
            })
            .catch((err)=>{
                res.status(400).send("Error al extraer datos de prestamos libros: "+err)
            })
        })
        .catch((err)=>{
            res.status(400).send("Error al extraer datos de los alumnos: "+err);
        });
    })
    .catch((err)=>{
        res.status(400).send("Error al extraer la información del administrador: "+err);
    });
});

admin.get('/tablaServicio/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{identificador: req.params.id}})
    .then((administrador)=>{
        ServicioSocial.findAll({
            where:{estado:true}})
        .then((servicio)=>{
            res.render('tablaServicioSocial',{administrador:administrador,servicio:servicio});
        })
        .catch((err)=>{
            res.status(400).send("No se encontro alumno: ... "+err);
        });
        
    })
    .catch((err)=>{
        res.status(400).send("No se encontro usuario:  ... "+err);
    });
});

/*SIN REGISTRO DE LIBROS*/
admin.get('/noLibros/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    })
    .then((administrador)=>{
        res.render('sinRegistroLibro',{usuario:administrador});
    })
    .catch((err)=>{
        res.status(400).send("Error al extraer la información: "+err);
    });
});

/* LIBROS DISPONIBLES ADMIN*/
admin.get('/LibrosAdmin/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    })
    .then((administrador)=>{
        res.render('libros_disponiblesAdmin',{administrador:administrador});
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar... "+err);
    });    
});

/*LIBROS NO DISPONIBLES ADMIN*/
admin.get('/LibrosPrestadosAdmin/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({where:{identificador: req.params.id}})
    .then((administrador)=>{
        Prestamo.findAll(({where:{
            estado:true,
            categoria: 'consulta'}}))
        .then((consulta)=>{
            Prestamo.findAll(({where:{
                estado: true,
                categoria: 'general'
            }}))
            .then((general)=>{
                Prestamo.findAll(({where:{
                    estado: true,
                    categoria: 'infantil'
                }}))
                .then((infantil)=>{
                    res.render('libros_prestadosAdmin',{consulta:consulta, general:general, infantil:infantil, administrador:administrador});
                })
                .catch((err)=>{
                    res.status(400).send("Error al extraer los datos prestamos infantil: "+err);
                });
            })
            .catch((err)=>{
                res.status(400).send("Error al extraer los datos prestamos general: "+err);
            });
        })
        .catch((err)=>{
            res.status(400).send("Error al extraer los datos prestamos consulta: "+err);
        })
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar... "+err);
    });    
});

admin.get('/alumno/:idAdmin/:correoAlumno',(req,res)=>{
    var idAdmin = req.params.idAdmin;
    var correoAlumno  = req.params.correoAlumno;
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    /*Busqueda Admin*/
    Administrador.findAll({
        where:{identificador: idAdmin}})
    .then((administrador)=>{
        /*Busqueda Alumno Servicio*/
        ServicioSocial.findAll({where:{correo: correoAlumno}})
        .then((servicio)=>{
            /*Busqueda Hora serivicio*/
            HoraServicio.findAll({where:{correo: correoAlumno}})
            .then((horaServicio)=>{
                res.render('informacion_Estudiante',{administrador:administrador,servicio:servicio,horaServicio:horaServicio});
            })
            .catch((err)=>{
                res.status(400).send("No se encontro horas en alumno: ... "+err);
            });
            
        })
        .catch((err)=>{
            res.status(400).send("No se encontro alumno: ... "+err);
        });
    })
    .catch((err)=>{
        res.status(400).send("No se encontro usuario: ... "+err);
    });
});

admin.get('/404Error',(req,res)=>{
    res.render('404Error')
});


//RUTA BORRAR HORAS 
admin.get('/borrar/:id/:correo',(req,res)=>{
    idAdmin = req.params.id;
    correoAlumno = req.params.correo;
    HoraServicio.destroy({where:{correo:correoAlumno}})
    .then(()=>{
        res.redirect('/admin/alumno/'+idAdmin+'/'+correoAlumno);
    })
    .catch((err)=>{
        res.status(400).send("Error al borrar el registro de horas "+err);
    });
});

//MODIFICAR ALUMNO
admin.get('/modificarAlumno/:id/:correo',(req,res)=>{
    idAdmin =  req.params.id;
    correoAlumno = req.params.correo;

    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({where:{identificador: idAdmin}})
    .then((administrador)=>{
        ServicioSocial.findAll({where:{correo: correoAlumno}})
        .then((servicio)=>{
            res.render('actualizarAlumno',{administrador:administrador,servicio:servicio});
        })
        .catch((err)=>{
            res.status(400).send("No se encontro alumno: ... "+err);
        });
        
    })
    .catch((err)=>{
        res.status(400).send("No se encontro usuario:  ... "+err);
    });
});

//RUTA BORRAR ALUMNOS
admin.get('/borrarAlumno/:id/:correo',(req,res)=>{
    idAdmin = req.params.id;
    correoAlumno = req.params.correo;
    ServicioSocial.destroy({where:{correo:correoAlumno}})
    .then(()=>{
        res.redirect('/admin/HomeAdmin/'+idAdmin);
    })
    .catch((err)=>{
        res.status(400).send("Error al borrar el registro de usuario: "+err);
    });
});

/*TABLA DE SERVICIO SOCIAL CONCLUIDO*/
admin.get('/tablaServicioConcluido/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    })
    .then((administrador)=>{
        ServicioSocial.findAll({
            where:{
                estado:false
            }
        })
        .then((servicio)=>{
            res.render('tablaServicioSocialConcluido',{administrador:administrador,servicio:servicio});
        })
        .catch((err)=>{
            res.status(400).send("No se encontro alumno: ... "+err);
        });
        
    })
    .catch((err)=>{
        res.status(400).send("No se encontro usuario:  ... "+err);
    });
});

/*CAMBIO DE VALOR ESTUDIANTE A FALSE*/
admin.get('/servicioConcluido/:id/:idAlumno',(req,res)=>{
    var idAdmin = req.params.id;
    var idAlumno = req.params.idAlumno;
    const Datos = {
        estado:false
    }
    ServicioSocial.update(Datos,{where:{id:idAlumno}})
    .then(()=>{
        res.redirect('/admin/tablaServicioConcluido/'+idAdmin)
    })
    .catch((err)=>{
        console.error('Error modificar a información:(' + err+' )');
    });
});

/*INFORMACION DE ALUMNO CONCLUIDO*/
admin.get('/alumnoConcluido/:idAdmin/:correoAlumno',(req,res)=>{
    var idAdmin = req.params.idAdmin;
    var correoAlumno  = req.params.correoAlumno;
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    /*Busqueda Admin*/
    Administrador.findAll({
        where:{
            identificador: idAdmin
        }
    })
    .then((administrador)=>{
        /*Busqueda Alumno Servicio*/
        ServicioSocial.findAll({
            where:{
                correo: correoAlumno
            }
        })
        .then((servicio)=>{
            /*Busqueda Hora serivicio*/
            HoraServicio.findAll({
                where:{
                    correo: correoAlumno
                }
            })
            .then((horaServicio)=>{
                res.render('informacion_EstudianteConcluido',{administrador:administrador,servicio:servicio,horaServicio:horaServicio});
            })
            .catch((err)=>{
                res.status(400).send("No se encontro horas en alumno: ... "+err);
            });
            
        })
        .catch((err)=>{
            res.status(400).send("No se encontro alumno: ... "+err);
        });
    })
    .catch((err)=>{
        res.status(400).send("No se encontro usuario: ... "+err);
    });
});

admin.get('/404Error',(req,res)=>{
    res.render('404Error')
});

/*COMUNIDAD*/
admin.get('/comunidad/:id/',(req,res)=>{
    idAdmin = req.params.id;
        if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    })
    .then((administrador)=>{
        Usuario.findAll({
            where:{
                estado:true
            }
        })
        .then((usuario)=>{
            res.render('comunidad',{administrador:administrador, usuario:usuario});
        })
        .catch((err)=>{
            res.status(400).send("Datos no encontados: "+err);
        });
    })
    .catch((err)=>{
        res.status(400).send("Datos de administradores no econtrados "+err)
    });
    
});

//BORRAR USUARIOS DESDE COMUNIDAD
admin.get('/borrarUser/:id/:correo',(req,res)=>{
    idAdmin = req.params.id;
    correoUsuario = req.params.correo;
    Usuario.destroy({where:{correo:correoUsuario}})
    .then(()=>{
        res.redirect('/admin/comunidad/'+idAdmin);
    })
    .catch((err)=>{
        res.status(400).send("Error al borrar el registro de usuario: "+err);
    });
});

//MODIFICAR USUARIO
admin.get('/modificarUsuario/:id/:correo',(req,res)=>{
    idAdmin =  req.params.id;
    correoUsuario = req.params.correo;

    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({where:{identificador: idAdmin}})
    .then((administrador)=>{
        Usuario.findAll({where:{correo: correoUsuario}})
        .then((usuario)=>{
            res.render('actualizarUsuario',{administrador:administrador,usuario:usuario});
        })
        .catch((err)=>{
            res.status(400).send("No se encontro Usuario: ... "+err);
        });
        
    })
    .catch((err)=>{
        res.status(400).send("No se encontro usuario:  ... "+err);
    });
});

//INFORMACION DE USUARIO
admin.get('/informacionUsuario/:id/:correo',(req,res)=>{
    idAdmin =  req.params.id;
    correoUsuario = req.params.correo;

    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({where:{identificador: idAdmin}})
    .then((administrador)=>{
        Usuario.findAll({where:{correo: correoUsuario}})
        .then((usuario)=>{
            Donaciones.findAll({where:{correo:correoUsuario}})
            .then((donacion)=>{
                res.render('informacion_Usuario',{administrador:administrador,usuario:usuario,donacion:donacion})
            })
            .catch((err)=>{
                console.log('No se encontro donación')
            })
        })
        .catch((err)=>{
            console.log('No se encontro usuario: '+err);
        });
        
    })
    .catch((err)=>{
        res.status(400).send("No se encontro usuario:  ... "+err);
    });
});

/*AGREGAR LIBRO*/
/* LIBROS DISPONIBLES ADMIN*/
admin.get('/agregarLibro/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    })
    .then((administrador)=>{
        res.render('agregarLibroAdmin',{administrador:administrador});
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar... "+err);
    });    
});

/*RECUPERAR LIBROS CONSULTA*/
admin.get('/libro/:numero/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroConsulta WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/admin/noLibros/'+req.params.id);
        }
        else{
            Conexion.query('SELECT * FROM libroConsulta WHERE estado=true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC, volumen ASC;',{ type:QueryTypes.SELECT})
            .then((consulta)=>{
                Administrador.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((administrador)=>{
                    res.render('tablaLibrosConsulta',{consulta:consulta,administrador:administrador});
                })
                .catch((err)=>{
                    res.status(400).send("Error al extraer la información con administrador: "+err);    
                });
    
            })
            .catch((err)=>{
                res.status(400).send("Error al extraer la información principal: "+err);
            });
        }
    })
    .catch((err)=>{
        res.status(400).send("Error al encontar un dato: "+err)
    });
    
});

/*RECUPERAR LIBROS GENERAL*/
admin.get('/libroGeneral/:numero/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroGenerals WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/admin/noLibros/'+req.params.id);
        }
        else{
            Conexion.query('SELECT * FROM libroGenerals WHERE estado=true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC, volumen ASC;',{ type:QueryTypes.SELECT})
            .then((general)=>{
                Administrador.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((administrador)=>{
                    res.render('tablaLibrosGeneral',{general:general,administrador:administrador});
                })
                .catch((err)=>{
                    res.status(400).send("Error al extraer la información con administrador: "+err);    
                });

            })
            .catch((err)=>{
                res.status(400).send("Error al extraer la información principal: "+err);
            });
        } 
    })
    .catch((err)=>{
        res.status(400).send("Error al encontar un dato: "+err);
    })
});

/*RECUPERAR LIBROS INFANTIL*/
admin.get('/libroInfantil/:numero/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroInfantils WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/admin/noLibros/'+req.params.id);
        }
        else{
            Conexion.query('SELECT * FROM libroInfantils WHERE estado=true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC, volumen ASC;',{ type:QueryTypes.SELECT})
            .then((infantil)=>{
                Administrador.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((administrador)=>{
                    res.render('tablaLibrosInfantil',{infantil:infantil,administrador:administrador});
                })
                .catch((err)=>{
                    res.status(400).send("Error al extraer la información con administrador: "+err);    
                });

            })
            .catch((err)=>{
                res.status(400).send("Error al extraer la información principal: "+err);
            });
        }
    })
    .catch((err)=>{
        res.status(400).send("Error al encontar un dato: "+err);
    })
});

/*VER MÁS INFORMACIÓN LIBRO*/
admin.get('/informacionLibro/:idLibro/:categoria/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({where:{identificador: req.params.id}})
    .then((administrador)=>{
        if(req.params.categoria == 'consulta'){
            Consulta.findAll({
                where:{
                    id: req.params.idLibro,
                    estado: true
                }
            })
            .then((consulta)=>{
                res.render('informacionLibro',{libro:consulta,administrador:administrador});
            })
            .catch((err)=>{
                res.status(400).send("Error al extraer los datos, verificar... "+err);
            });
        }
        if(req.params.categoria == 'general'){
            General.findAll({
                where:{
                    id: req.params.idLibro,
                    estado: true
                }
            })
            .then((general)=>{
                res.render('informacionLibro',{libro:general,administrador:administrador});
            })
            .catch((err)=>{
                res.status(400).send("Error al extraer los datos, verificar... "+err);
            });
        }
        if(req.params.categoria == 'infantil'){
            Infantil.findAll({
                where:{
                    id: req.params.idLibro,
                    estado: true
                }
            })
            .then((infantil)=>{
                res.render('informacionLibro',{libro:infantil,administrador:administrador});
            })
            .catch((err)=>{
                res.status(400).send("Error al extraer los datos, verificar... "+err);
            });
        }

    })
    .catch((err)=>{
        res.status(400).send("Error al encontrar el usario... "+err);
    });
});

/*PRESTAR LIBRO*/
admin.get('/prestamo/:idLibro/:categoria/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({where:{identificador:req.params.id}})
    .then((administrador)=>{
        Conexion.query('SELECT * FROM usuarios WHERE estado=true ORDER BY nombre ASC, apellido ASC;',{ type:QueryTypes.SELECT})
        .then((usuario)=>{
            Conexion.query('SELECT * FROM servicioSocials WHERE estado=true ORDER BY nombre ASC, apellido ASC;',{ type:QueryTypes.SELECT})
            .then((servicio)=>{
                switch (req.params.categoria) {
                    case 'consulta':
                        Consulta.findAll({where:{id:req.params.idLibro}})
                        .then((consulta)=>{
                            res.render('prestamoLibro',{administrador:administrador, usuario:usuario, servicio:servicio, libro:consulta});
                        })
                        break;
                    case 'general':
                        General.findAll({where:{id:req.params.idLibro}})
                        .then((general)=>{
                            res.render('prestamoLibro',{administrador:administrador, usuario:usuario, servicio:servicio, libro:general});
                        })
                        break;
                    case 'infantil':
                        Infantil.findAll({where:{id:req.params.idLibro}})
                        .then((infantil)=>{
                            res.render('prestamoLibro',{administrador:administrador, usuario:usuario, servicio:servicio, libro:infantil});
                        })
                    default:
                        console.log("Categoria no encontrada!");
                        break;
                }
            })
            .catch((err)=>{
                res.status(400).send("Error al extraer la información: "+err);
            });
        })
        .catch((err)=>{
            res.status(400).send("Error al extraer la información: "+err);
        });
    })
    .catch((err)=>{
        res.status(400).send("Error al extraer la información: "+err);
    });
});

/*ELIMINAR TODOS LOS VOLUMENES*/
admin.get('/eliminarVolumenes/:titulo/:categoria/:autor/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    switch(req.params.categoria){
        case 'consulta':
            Conexion.query('DELETE FROM libroConsulta where titulo = "'+req.params.titulo+'" and autor = "'+req.params.autor+'" and categoria = "'+req.params.categoria+'";',{type:QueryTypes.DELETE})
            .then(()=>{
                console.log("Registros eliminados");
                res.redirect('/admin/LibrosAdmin/'+req.params.id);
            })
            .catch((err)=>{
                res.status(400).send("Error al elminar los registros: "+err);
            });
            break;
        case 'general':
            Conexion.query('DELETE FROM libroGenerals where titulo = "'+req.params.titulo+'" and autor = "'+req.params.autor+'" and categoria = "'+req.params.categoria+'";',{type:QueryTypes.DELETE})
            .then(()=>{
                console.log("Registros eliminados");
                res.redirect('/admin/LibrosAdmin/'+req.params.id);
            })
            .catch((err)=>{
                res.status(400).send("Error al elminar los registros: "+err);
            });
            break;
        case 'infantil':
            Conexion.query('DELETE FROM libroInfantils where titulo = "'+req.params.titulo+'" and autor = "'+req.params.autor+'" and categoria = "'+req.params.categoria+'";',{type:QueryTypes.DELETE})
            .then(()=>{
                console.log("Registros eliminados");
                res.redirect('/admin/LibrosAdmin/'+req.params.id);
            })
            .catch((err)=>{
                res.status(400).send("Error al elminar los registros: "+err);
            });
            break;
        default: 
            res.status(400).send("Error al encontrar la categoria ");
            break;
    }
});

/*ELIMINAR SOLO UN VOLUMEN*/
admin.get('/eliminarVolumen/:idLibro/:categoria/:id',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    switch(req.params.categoria){
        case 'consulta':
            Conexion.query('DELETE FROM libroConsulta where id = '+req.params.idLibro+';',{type:QueryTypes.DELETE})
            .then(()=>{
                console.log("Registro eliminado");
                res.redirect('/admin/LibrosAdmin/'+req.params.id);
            })
            .catch((err)=>{
                res.status(400).send("Error al elminar el registro: "+err);
            });  
            break;
        case 'general':
            Conexion.query('DELETE FROM libroGenerals where id = '+req.params.idLibro+';',{type:QueryTypes.DELETE})
            .then(()=>{
                console.log("Registro eliminado");
                res.redirect('/admin/LibrosAdmin/'+req.params.id);
            })
            .catch((err)=>{
                res.status(400).send("Error al elminar el registro: "+err);
            });  
            break;
        case 'infantil':
            Conexion.query('DELETE FROM libroInfantils where id = '+req.params.idLibro+';',{type:QueryTypes.DELETE})
            .then(()=>{
                console.log("Registro eliminado");
                res.redirect('/admin/LibrosAdmin/'+req.params.id);
            })
            .catch((err)=>{
                res.status(400).send("Error al elminar el registro: "+err);
            });  
            break;
        default:
            res.render("Error al encontrar la categoria ")
    }
});

/*MODIFICAR INFORMACIÓN LIBRO*/
admin.get('/modificarLibro/:idLibro/:id/:categoria',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    })
        .then((administrador)=>{
            switch(req.params.categoria){
                case 'consulta':
                    Consulta.findAll({
                        where:{
                            id: req.params.idLibro
                        }
                    })
                    .then((consulta)=>{
                        res.render('modificarLibro',{libro:consulta,administrador:administrador});
                    })
                    .catch((err)=>{
                        res.status(400).send('Error al extrer la información libro: '+err);
                    });
                    break;
                case 'general':
                    General.findAll({
                        where:{
                            id: req.params.idLibro
                        }
                    })
                    .then((general)=>{
                        res.render('modificarLibro',{libro:general,administrador:administrador});
                    })
                    .catch((err)=>{
                        res.status(400).send('Error al extrer la información libro: '+err);
                    });
                    break;
                case 'infantil':
                    Infantil.findAll({
                        where:{
                            id: req.params.idLibro
                        }
                    })
                    .then((infantil)=>{
                        res.render('modificarLibro',{libro:infantil,administrador:administrador});
                    })
                    .catch((err)=>{
                        res.status(400).send('Error al extrer la información libro: '+err);
                    });
                    break;
                default :
                    res.status(400).send("Error al encontrar la categoria: ");
                    break;
    }
        })
        .catch((err)=>{
            res.status(400).send("Error al encontrar el administrador: "+err)
        });
});

/*FECHAS DE PRESTAMOS DE LIBROS*/
admin.get('/fechas/:idUsario/:tipo/:id/:idLibro/:categoria',(req,res)=>{
    if(!req.session.correoAdmin){
        res.redirect('/admin/404Error');
    }
    Administrador.findAll({where:{identificador: req.params.id}})
    .then((administrador)=>{
        switch (req.params.tipo){
            case 'usuario':
                Usuario.findAll({where:{id:req.params.idUsario}})
                .then((usuario)=>{
                    if(req.params.categoria == 'consulta'){
                        Consulta.findAll({where:{id:req.params.idLibro}})
                        .then((consulta)=>{
                            res.render('fechaPrestamo',{administrador:administrador, usuario:usuario, libro:consulta});
                        })
                    }
                    else if(req.params.categoria == 'general'){
                        General.findAll({where:{id:req.params.idLibro}})
                        .then((general)=>{
                            res.render('fechaPrestamo',{administrador:administrador, usuario:usuario, libro:general});
                        })
                    }
                    else if(req.params.categoria == 'infantil'){
                        Infantil.findAll({where:{id:req.params.idLibro}})
                        .then((infantil)=>{
                            res.render('fechaPrestamo',{administrador:administrador, usuario:usuario, libro:infantil});
                        })
                    }
                    else{
                        res.status(400).send('Error al encontrar una categoria');
                    }
                });
                break;
            case 'servicioSocial':
                ServicioSocial.findAll({where:{id:req.params.idUsario}})
                .then((servicio)=>{
                    if(req.params.categoria == 'consulta'){
                        Consulta.findAll({where:{id:req.params.idLibro}})
                        .then((consulta)=>{
                            res.render('fechaPrestamo',{administrador:administrador, usuario:servicio, libro:consulta});
                        })
                    }
                    else if(req.params.categoria == 'general'){
                        General.findAll({where:{id:req.params.idLibro}})
                        .then((general)=>{
                            res.render('fechaPrestamo',{administrador:administrador, usuario:servicio, libro:general});
                        })
                    }
                    else if(req.params.categoria == 'infantil'){
                        Infantil.findAll({where:{id:req.params.idLibro}})
                        .then((infantil)=>{
                            res.render('fechaPrestamo',{administrador:administrador, usuario:servicio, libro:infantil});
                        })
                    }
                    else{
                        res.status(400).send('Error al encontrar una categoria');
                    }
                });
                break;
            default:
                console.log("Error al encontrar la categoria ");
                break;
        }   
    })
    .catch((err)=>{
        res.status(400).send("Error al ejecutar la información: "+err)
    });
});

/*POST*/

admin.post('/registrar',(req,res)=>{
    id = req.body.idAdmin;
    tipo = req.body.tipo;
    identificadorpwd = genereatePWS(16);
    const Datos = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        tipo: req.body.tipo,
        correo: req.body.correo,
        password: Crypto(req.body.password),
        identificador: identificadorpwd,
        estado: req.body.estado,
        perfil: req.body.perfil
    }
    if(tipo == 'admin'){
        Administrador.create(Datos)
        .then(()=>{
            res.redirect('/admin/HomeAdmin/'+id)
        })
        .catch((err)=>{
            console.error('Error al enviar la información:(' + err+' )')
        })
    }
    if (tipo=='usuario'){
        Usuario.create(Datos)
        .then(()=>{
            res.redirect('/admin/HomeAdmin/'+id)
        })
        .catch((err)=>{
            console.error('Error al enviar la información:(' + err+' )')
        })  
    }

});

admin.post('/registrarServicio',(req,res)=>{

    id = req.body.idAdmin;
    identificadorPwd = genereatePWS(16);
    const Datos = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        escuela: req.body.escuela,
        fechaInicio: req.body.fechaInicio,
        fechaTermino: req.body.fechaTermino,
        totalHoras: req.body.totalHoras,
        tipo: req.body.tipo,
        correo: req.body.correo,
        password: Crypto(req.body.password),
        identificador: identificadorPwd,
        estado: req.body.estado,
        perfil: req.body.perfil
    }
        ServicioSocial.create(Datos)
        .then(()=>{
            res.redirect('/admin/HomeAdmin/'+id)
        })
        .catch((err)=>{
            console.error('Error al enviar la información:(' + err+' )')
        });
});




admin.post('/login',(req,res)=>{
    Administrador.findAll({
        where:{
            correo: req.body.correo,
            estado:true                                                                                                                                                                                                                       
        }
    })
    .then((administrador)=>{
        if(administrador==""){
            res.redirect("/Login")
        }
        else{
            const pwd = NoCrypto(administrador[0].password) //Cambiar
            if(pwd == req.body.password){
                const id = administrador[0].identificador;
                req.session.correoAdmin = administrador[0].correo
                res.redirect('/admin/HomeAdmin/'+id);
            }
            else{
                res.redirect('/Login');
            }
        }
    })
    .catch((err)=>{
        console.log('Error: '+err);
    });
});

admin.post('/RegistrarHora/:id/:correo',(req,res)=>{
    id = req.params.id;
    correoAlumno = req.params.correo;
    const Datos = {
        fecha1: req.body.fecha1,
        fecha2: req.body.fecha2,
        hora: req.body.hora,
        correo: req.params.correo
    }
    HoraServicio.create(Datos)
    .then(()=>{
        res.redirect('/admin/alumno/'+id+'/'+correoAlumno);
    })
    .catch((err)=>{
        console.error('Error al enviar la información:(' + err+' )');
    });
});

//MODIFICAR ALUMNO
admin.post('/ModificarAlumno/:id/:idAlumno',(req,res)=>{
    var idAdmin = req.params.id;
    var idAlumno = req.params.idAlumno;
    const Datos = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        escuela: req.body.escuela,
        fechaInicio: req.body.fechaInicio,
        fechaTermino: req.body.fechaTermino,
        totalHoras: req.body.totalHoras,
        correo: req.body.correo,
    }
    ServicioSocial.update(Datos,{where:{id:idAlumno}})
    .then(()=>{
        res.redirect('/admin/tablaServicio/'+idAdmin)
    })
    .catch((err)=>{
        console.error('Error modificar a información:(' + err+' )');
    });
});

/*BUSCAR*/
admin.post('/BuscarUser/:id',(req,res)=>{
    idAdmin = req.params.id;
    Usuario.findAll({where:{correo:req.body.buscar}})
    .then((usuario)=>{
        Administrador.findAll({where:{identificador:idAdmin}})
        .then((administrador)=>{
            res.render('comunidadResultado',{administrador:administrador,usuario:usuario});
        })
        .catch((err)=>{
            res.status(400).send("Error al mandar información: "+err);
        });
    })
    .catch((err)=>{
        res.status(400).send("Error al recuperar al usuario: "+err)
    })
});

//MODIFICAR USUARIO
admin.post('/ModificarUsuario/:id/:idUsuario',(req,res)=>{
    var idAdmin = req.params.id;
    var idUsuario = req.params.idUsuario;
    const Datos = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
    }
    Usuario.update(Datos,{where:{identificador:idUsuario}})
    .then(()=>{
        res.redirect('/admin/comunidad/'+idAdmin)
    })
    .catch((err)=>{
        console.error('Error modificar a información:(' + err+' )');
    });
});

admin.post('/Donacion/:id/:correo',(req,res)=>{
    var idAdmin = req.params.id;
    var correoUsuario = req.params.correo;
    if(req.body.categoria == 'Seleccione una categoría'){
        var categoriaUsuario = "otros"
    }
    else{
        var categoriaUsuario = req.body.categoria;
    }
    const Datos = {
        categoria: categoriaUsuario,
        cantidad: req.body.cantidad,
        descripcion: req.body.descripcion,
        correo: correoUsuario
    }
    Donaciones.create(Datos)
    .then(()=>{
        res.redirect('/admin/informacionUsuario/'+idAdmin+'/'+correoUsuario);
    })
    .catch((err)=>{
        console.log('Error al registrar el la donación'+err)
    })
})

//REGISTRAR LIBRO
admin.post('/RegistrarLibro/:id',(req,res)=>{
    if(req.body.categoria == ''){
        res.send("Dato incorrecto");
    }
    /*Categoria Consulta*/
    if(req.body.categoria == 'consulta'){
        for (let i = 0; i < req.body.volumen; i++) {
            Consulta.create({
                orden: req.body.orden,
                titulo: req.body.titulo,
                volumen: i+1,
                categoria: req.body.categoria,
                autor: req.body.autor,
                editorial: req.body.editorial,
                descripcion: req.body.descripcion,
                estado: true
            })
            .then(()=>{
                console.log("¡Elemento agregado...!");
            })
            .catch((err)=>{
                console.log("Error al enviar el elemento: "+err);
            });
        }
        res.redirect('/admin/agregarLibro/'+req.params.id);
    }
    /*Categorial General*/
    if(req.body.categoria == 'general'){
        for (let i = 0; i < req.body.volumen; i++) {
            General.create({
                orden: req.body.orden,
                titulo: req.body.titulo,
                volumen: i+1,
                categoria: req.body.categoria,
                autor: req.body.autor,
                editorial: req.body.editorial,
                descripcion: req.body.descripcion,
                estado: true
            })
            .then(()=>{
                console.log("¡Elemento agregado...!");
            })
            .catch((err)=>{
                console.log("Error al enviar el elemento: "+err);
            });
        }
        res.redirect('/admin/agregarLibro/'+req.params.id);
    }
    /*Categorial Infantil*/
    if(req.body.categoria == 'infantil'){
        for (let i = 0; i < req.body.volumen; i++) {
            Infantil.create({
                orden: req.body.orden,
                titulo: req.body.titulo,
                volumen: i+1,
                categoria: req.body.categoria,
                autor: req.body.autor,
                editorial: req.body.editorial,
                descripcion: req.body.descripcion,
                estado: true
            })
            .then(()=>{
                console.log("¡Elemento agregado...!");
            })
            .catch((err)=>{
                console.log("Error al enviar el elemento: "+err);
            });
        }
        res.redirect('/admin/agregarLibro/'+req.params.id);
    }

});

/*BUSQUEDA DE AUTOR*/
admin.post('/BuscarAutor/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    }).then((administrador)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado=true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroAdmin',{libro:consulta, administrador:administrador});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado=true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroAdmin',{administrador:administrador,libro:general})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado=true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroAdmin',{administrador:administrador,libro:infantil})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
    })
    .catch((err)=>{
        res.status(400).send("Error al encontrar el administrador: "+err);
    });
});

/*BUSQUEDA DE TITULO*/
admin.post('/BuscarTitulo/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Administrador.findAll({
        where:{
            identificador: req.params.id
        }
    }).then((administrador)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado=true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroAdmin',{libro:consulta, administrador:administrador});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado=true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroAdmin',{libro:general,administrador:administrador})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado=true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroAdmin',{libro:infantil,administrador:administrador})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
    })
    .catch((err)=>{
        res.status(400).send("Error al encontrar el administrador: "+err);
    });
});

/*BUSQUEDA DE EDITORIAL*/
admin.post('/BuscarEditorial/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Administrador.findAll({
        where:{
            identificador: req.params.id 
        }
    }).then((administrador)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado=true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroAdmin',{libro:consulta, administrador:administrador});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado=true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroAdmin',{administrador:administrador,libro:general})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado=true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroAdmin',{administrador:administrador,libro:infantil})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
    })
    .catch((err)=>{
        res.status(400).send("Error al encontrar el administrador: "+err);
    });
});

/*MODIFICAR LIBRO*/
admin.post('/ModificarLibro/:idLibro/:categoria/:id',(req,res)=>{
    const Datos = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        orden: req.body.orden,
        editorial: req.body.editorial,
        descripcion: req.body.descripcion
    }
        switch(req.params.categoria){
            case 'consulta':
                Conexion.query('Select * from libroConsulta where id = '+req.params.idLibro+';',{type:QueryTypes.SELECT})
                .then((libro)=>{
                    console.log("Dato localizado: "+libro[0].titulo);
                    Consulta.update(Datos,{where:{
                        titulo: libro[0].titulo,
                        autor: libro[0].autor,
                        editorial: libro[0].editorial
                    }})
                    .then(()=>{
                        res.redirect('/admin/informacionLibro/'+req.params.idLibro+'/'+req.params.categoria+'/'+req.params.id);
                    })
                    .catch((err)=>{
                        res.status(400).send("Error al modificar la información: "+err);
                    });
                })
                .catch((err)=>{
                    res.status(400).send("Error al encontrar el dato de la categoria Consulta: "+err);
                });
                break;
            case 'general':
                Conexion.query('Select * from libroGenerals where id = '+req.params.idLibro+';',{type:QueryTypes.SELECT})
                .then((libro)=>{
                    console.log("Dato localizado: "+libro[0].titulo);
                    General.update(Datos,{where:{
                        titulo: libro[0].titulo,
                        autor: libro[0].autor,
                        editorial: libro[0].editorial
                    }})
                    .then(()=>{
                        res.redirect('/admin/informacionLibro/'+req.params.idLibro+'/'+req.params.categoria+'/'+req.params.id);
                    })
                    .catch((err)=>{
                        res.status(400).send("Error al modificar la información: "+err);
                    });
                })
                .catch((err)=>{
                    res.status(400).send("Error al encontrar el dato de la categoria General: "+err);
                });
                break;
            case 'infantil':
                Conexion.query('Select * from libroInfantils where id = '+req.params.idLibro+';',{type:QueryTypes.SELECT})
                .then((libro)=>{
                    console.log("Dato localizado: "+libro[0].titulo);
                    Infantil.update(Datos,{where:{
                        titulo: libro[0].titulo,
                        autor: libro[0].autor,
                        editorial: libro[0].editorial
                    }})
                    .then(()=>{
                        res.redirect('/admin/informacionLibro/'+req.params.idLibro+'/'+req.params.categoria+'/'+req.params.id);
                    })
                    .catch((err)=>{
                        res.status(400).send("Error al modificar la información: "+err);
                    });
                })
                .catch((err)=>{
                    res.status(400).send("Error al encontrar el dato de la categoria Infantil: "+err);
                });
                break;
            default: 
                res.status(400).send("Error al encontrar la categoria: ");
                break;
                

        }
});

/*PEDIR LIBRO*/
admin.post('/prestamoLibro/:idLibro/:categoria/:correo/:id',(req,res)=>{
    Administrador.findAll({where:{identificador:req.params.id}})
    .then((administrador)=>{
        let categoria;
        switch (req.params.categoria){
            case 'consulta':
                categoria = 'libroConsulta';
                break;
            case 'general':
                categoria = 'libroGenerals';
                break;
            case 'infantil':
                categoria = 'libroInfantils';
                break;
            default:
                console.log("Categoria no encontrada");
        }
        Conexion.query('Select * from '+ categoria+' where id = '+req.params.idLibro+';',{type:QueryTypes.SELECT})
        .then((libro)=>{
            const Datos ={
                orden: libro[0].orden,
                titulo: libro[0].titulo,
                volumen: libro[0].volumen,
                categoria: libro[0].categoria,
                autor: libro[0].autor,
                editorial: libro[0].editorial,
                descripcion: libro[0].descripcion,
                estado: true,
                correo: req.params.correo,
                fechaInicio: req.body.fechaInicio,
                fechaLimite: req.body.fechaLimite
            }
            Prestamo.create(Datos)
            .then(()=>{
                console.log("Registro de libro exitoso!");
                Conexion.query('Update '+ categoria+' set estado = '+false+' where id = '+req.params.idLibro+';',{type:QueryTypes.UPDATE})
                .then(()=>{
                    console.log("El libro con id= "+req.params.idLibro+" ha sido dado de baja");
                    res.render('libroPrestadoOK',{administrador:administrador});
                })
                .catch((err)=>{
                    res.status(400).send("Error al cambiar el estado del libro: "+err);
                });
            })
            .catch((err)=>{
                res.status(400).send("Registro del libro no exitoso: "+err);
            })
            
        })
        .catch((err)=>{
            res.status(400).send("Extradicción de datos no completa: "+err);
        });
    })
});





module.exports = admin;
