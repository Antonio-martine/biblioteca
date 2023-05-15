const express = require('express');
const user = express.Router();
const {Usuario, Prestamo} = require('../conexion');
const CryptoJS = require("crypto-js");
const {Conexion} = require('../conexion');
const { QueryTypes } = require('sequelize');
const {Consulta, General, Infantil} = require('../conexion');

//CRYPTO
function Crypto(elemento){
    var encrypto = CryptoJS.AES.encrypt(elemento,'123456').toString();
    return encrypto;
}

/*DESCRIPTO*/
function NoCrypto(elemento){
    var bytes = CryptoJS.AES.decrypt(elemento,'123456');
    var originText = bytes.toString(CryptoJS.enc.Utf8);
    return originText;
}

/*IDENTIFICADOR*/
function genereatePWS(lenght) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var pwd = "";
    for (var i = 0; i < lenght; i++){
        var random = Math.floor(Math.random() * charset.length);
        pwd += charset.charAt(random);
    }
    return pwd;
}



/*USUARIO GET*/
/*INICIO*/
user.get('/',(req,res)=>{
    res.render('inicio');
});

/*SIN REGISTRO DE LIBROS*/
user.get('/noLibros/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    Usuario.findAll({where:{identificador: req.params.id}})
    .then((usuario)=>{
        res.render('sinRegistroLibro',{usuario:usuario});
    })
    .catch((err)=>{
        res.status(400).send("Error al extraer la información: "+err);
    });
});

/*LiBROS DISPONIBLES*/
user.get('/libros/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    Usuario.findAll({where:{identificador: req.params.id}})
    .then((usuario)=>{
        res.render('libros_disponibles',{usuario:usuario});
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar... "+err);
    });    
});

/*RECUPERAR LIBROS CONSULTA*/
user.get('/libro/:numero/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroConsulta WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/noLibros/'+req.params.id);
        }else{
            Conexion.query('SELECT * FROM libroConsulta WHERE estado = true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC , volumen ASC;',{ type:QueryTypes.SELECT})
            .then((consulta)=>{
                Usuario.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((usuario)=>{
                    res.render('tablaLibrosConsultaUsuario',{consulta:consulta,usuario:usuario});
                })
                .catch((err)=>{
                    res.status(400).send("Error al extraer la información con usuario: "+err);    
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
user.get('/libroGeneral/:numero/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroGenerals WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/noLibros/'+req.params.id);
        }
        else{
            Conexion.query('SELECT * FROM libroGenerals WHERE estado = true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC, volumen ASC;',{ type:QueryTypes.SELECT})
            .then((general)=>{
                Usuario.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((usuario)=>{
                    res.render('tablaLibrosGeneralUsuario',{general:general,usuario:usuario});
                })
                .catch((err)=>{
                    res.status(400).send("Error al extraer la información con usuario: "+err);    
                });

            })
            .catch((err)=>{
                res.status(400).send("Error al extraer la información principal: "+err);
            });
        }
    })
    .catch((err)=>{
        res.status(400).send("Error al encontar un dato: "+err);
    });
});

/*RECUPERAR LIBROS INFANTIL*/
user.get('/libroInfantil/:numero/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroInfantils WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/noLibros/'+req.params.id);
        }
        else{
            Conexion.query('SELECT * FROM libroInfantils WHERE estado = true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC, volumen ASC;',{ type:QueryTypes.SELECT})
            .then((infantil)=>{
                Usuario.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((usuario)=>{
                    res.render('tablaLibrosInfantilUsuario',{infantil:infantil,usuario:usuario});
                })
                .catch((err)=>{
                    res.status(400).send("Error al extraer la información con usuario: "+err);    
                });

            })
            .catch((err)=>{
                res.status(400).send("Error al extraer la información principal: "+err);
            });
        }
    })
    .catch((err)=>{
        res.status(400).send("Error al encontar un dato: "+err);
    });

});

/*LIBROS NO DISPONIBLES*/
user.get('/librosPrestados/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    Usuario.findAll({where:{identificador: req.params.id}})
    .then((usuario)=>{
        Prestamo.findAll(({where:{
            estado:true,
            categoria: 'consulta',
            correo: usuario[0].correo
        }}))
        .then((consulta)=>{
            Prestamo.findAll(({where:{
                estado: true,
                categoria: 'general',
                correo: usuario[0].correo
            }}))
            .then((general)=>{
                Prestamo.findAll(({where:{
                    estado: true,
                    categoria: 'infantil',
                    correo: usuario[0].correo
                }}))
                .then((infantil)=>{
                    res.render('libros_prestados',{consulta:consulta, general:general, infantil:infantil, usuario:usuario});
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
        });
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar... "+err);
    });    
});


//EVENTOS
user.get('/Eventos',(req,res)=>{
    res.send("Bienvenido a eventos")
});

//ACERCA DE
user.get('/Acerca-de',(req,res)=>{
    res.send("Historia")
});

/*LOGIN -> PARA TODOS LO USUARIOS*/
user.get('/Login',(req,res)=>{
    res.render('login')
})

//NUEVO USUARIO
user.get('/NuevoUsuario',(req,res)=>{
    res.render('nuevoUsuario')
});

//DESLOGUEARSE
user.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/')
});

/*PÁGINA PRINCIPAL*/
user.get('/HomeUsuario/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    Usuario.findAll({
        where:{identificador: req.params.id}})
    .then((usuario)=>{
        Prestamo.findAll({where:{correo:usuario[0].correo}})
        .then((prestamos)=>{
            res.render('userHome',{usuario:usuario,prestamos:prestamos});
        })
        .catch((err)=>{
            res.status(400).send("Error al extraer la información de prestamos: "+err)
        })
    })
    .catch((err)=>{
        res.status(400).send("Error al extraer la información del usuario, verificar: "+err);
    });    
});

/*VER MÁS INFORMACIÓN LIBRO*/
user.get('/informacionLibro/:idLibro/:categoria/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    Usuario.findAll({where:{identificador: req.params.id}})
    .then((usuario)=>{
        if(req.params.categoria == 'consulta'){
            Consulta.findAll({
                where:{
                    id: req.params.idLibro,
                    estado: true
                }
            })
            .then((consulta)=>{
                res.render('informacionLibroUsuario',{libro:consulta,usuario:usuario});
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
                res.render('informacionLibroUsuario',{libro:general,usuario:usuario});
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
                res.render('informacionLibroUsuario',{libro:infantil,usuario:usuario});
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





/*USUARIO POST*/
user.post('/NuevoUsuario',(req,res)=>{
    const Datos = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        tipo: 'usuario',
        correo: req.body.correo,
        password: Crypto(req.body.password),
        identificador: genereatePWS(16),
        estado: true,
        perfil: req.body.perfil
    }
    Usuario.create(Datos)
    .then(()=>{
        res.redirect('/Login')
    })
    .catch((err)=>{
        console.error('Error al enviar la información:(' + err+' )')
    })  
})

//LOGIN
user.post('/login',(req,res)=>{
    Usuario.findAll({
        where:{
            correo: req.body.correo,
            estado:true                                                                                                                                                                                                                       
        }
    })
    .then((usuario)=>{
        if(usuario==""){
            res.redirect('/Login');
        }
        else{
            const pwd = NoCrypto(usuario[0].password)
            if(pwd == req.body.password){   
                const id = usuario[0].identificador;
                req.session.correo = usuario[0].correo;
                res.redirect('/HomeUsuario/'+id);
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

/*BUSQUEDA DE TITULO*/
user.post('/BuscarTitulo/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Usuario.findAll({
        where:{
            identificador: req.params.id
        }
    }).then((usuario)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado = true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:consulta, usuario:usuario});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado = true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:general,usuario:usuario})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado = true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:infantil,usuario:usuario})
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

/*BUSQUEDA DE AUTOR*/
user.post('/BuscarAutor/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Usuario.findAll({
        where:{
            identificador: req.params.id
        }
    }).then((usuario)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado = true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:consulta, usuario:usuario});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado = true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroUsuario',{usuario:usuario,libro:general})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado = true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroUsuario',{usuario:usuario,libro:infantil})
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
user.post('/BuscarEditorial/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Usuario.findAll({
        where:{
            identificador: req.params.id 
        }
    }).then((usuario)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado = true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:consulta, usuario:usuario});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado = true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:general,usuario:usuario})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado = true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroUsuario',{usuario:usuario,libro:infantil})
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



 
module.exports = user;

