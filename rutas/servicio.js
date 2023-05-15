const express = require('express');
const {ServicioSocial, Prestamo} = require('../conexion');
const {Consulta} = require('../conexion');
const {General} = require('../conexion');
const {Administrador} = require('../conexion');
const servicio = express.Router();
const CryptoJS = require("crypto-js");
const {Conexion} = require('../conexion');
const { QueryTypes } = require('sequelize');

/*CRYPTO*/
function Crypto(elemento){
    var encrypto = CryptoJS.AES.encrypt(elemento,'123456').toString();
    return encrypto;
}

/*DESCRYPTO*/
function NoCrypto(elemento){
    var bytes = CryptoJS.AES.decrypt(elemento,'123456');
    var originText = bytes.toString(CryptoJS.enc.Utf8);
    return originText;
}

/*LOGIN*/
servicio.get('/homeServicio/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    ServicioSocial.findAll({where:{identificador: req.params.id}})
    .then((servicio)=>{
        Prestamo.findAll({where:{correo: servicio[0].correo}})
        .then((prestamos)=>{
            res.render('userHome',{usuario:servicio,prestamos});
        })
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar... "+err);
    });    
});

/*SIN REGISTRO DE LIBROS*/
servicio.get('/noLibros/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    ServicioSocial.findAll({where:{identificador: req.params.id}
    })
    .then((serivicio)=>{
        res.render('sinRegistroLibro',{usuario:serivicio});
    })
    .catch((err)=>{
        res.status(400).send("Error al extraer la información: "+err);
    });
});

/*LIBROS DISPONIBLES*/
servicio.get('/libros/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    ServicioSocial.findAll({
        where:{identificador: req.params.id}})
    .then((servicio)=>{
        res.render('libros_disponibles',{usuario:servicio});
    })
    .catch((err)=>{
        res.status(400).send("Error al ingresar, verificar... "+err);
    });    
});

/*RECUPERAR LIBROS CONSULTA*/
servicio.get('/libro/:numero/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroConsulta WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/servicio/noLibros/'+req.params.id);
        }else{
            Conexion.query('SELECT * FROM libroConsulta WHERE estado = true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC, volumen ASC;',{ type:QueryTypes.SELECT})
            .then((consulta)=>{
                ServicioSocial.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((servicio)=>{
                    res.render('tablaLibrosConsultaUsuario',{consulta:consulta,usuario:servicio});
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
servicio.get('/libroGeneral/:numero/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroGenerals WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/servicio/noLibros/'+req.params.id);
        }
        else{
            Conexion.query('SELECT * FROM libroGenerals WHERE estado = true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC, volumen ASC;',{ type:QueryTypes.SELECT})
            .then((general)=>{
                ServicioSocial.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((servicio)=>{
                    res.render('tablaLibrosGeneralUsuario',{general:general,usuario:servicio});
                })
                .catch((err)=>{
                    res.status(400).send("Error al extraer la información con el usuario: "+err);    
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

/*RECUPERAR LIBROS INFANTIL*/
servicio.get('/libroInfantil/:numero/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    Conexion.query('SELECT count(*) as total FROM libroInfantils WHERE estado = true AND orden >= '+inicio+' AND orden < '+fin+';',{type:QueryTypes.SELECT})
    .then((resultado)=>{
        if(resultado[0].total== 0){
            res.redirect('/servicio/noLibros/'+req.params.id);
        }else {
            Conexion.query('SELECT * FROM libroInfantils WHERE estado = true AND orden >='+inicio+' AND orden <'+fin+' ORDER BY orden ASC, volumen ASC;',{ type:QueryTypes.SELECT})
            .then((infantil)=>{
                ServicioSocial.findAll({
                    where:{
                        identificador: req.params.id
                    }
                })
                .then((servicio)=>{
                    res.render('tablaLibrosInfantilUsuario',{infantil:infantil,usuario:servicio});
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

/*LIBROS NO DISPONIBLES*/
servicio.get('/librosPrestados/:id',(req,res)=>{
    if(!req.session.correo){
        res.redirect('/admin/404Error');
    }
    ServicioSocial.findAll({where:{identificador: req.params.id}})
    .then((servicio)=>{
        Prestamo.findAll(({where:{
            estado:true,
            categoria: 'consulta',
            correo: servicio[0].correo
        }}))
        .then((consulta)=>{
            Prestamo.findAll(({where:{
                estado: true,
                categoria: 'general',
                correo: servicio[0].correo
            }}))
            .then((general)=>{
                Prestamo.findAll(({where:{
                    estado: true,
                    categoria: 'infantil',
                    correo: servicio[0].correo
                }}))
                .then((infantil)=>{
                    res.render('libros_prestados',{consulta:consulta, general:general, infantil:infantil, usuario:servicio});
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




/*LOGIN*/
servicio.post('/LoginServicio',(req,res)=>{
    ServicioSocial.findAll({
        where:{
            correo: req.body.correo,
            estado:true
        }
    })
    .then((servicio)=>{
        if(servicio == ""){
            res.redirect('/Login');
        }
        else{
            const pwd = NoCrypto(servicio[0].password)
            if(pwd == req.body.password){
                const id = servicio[0].identificador;
                req.session.correo = servicio[0].correo;
                res.redirect('/servicio/homeServicio/'+id)
            }
            else{
                res.redirect('/Login');
            }
        }
    })
    .catch((err)=>{
        console.log('Error al extraer el dato: '+err);
    })
});

/*BUSQUEDA DE TITULO*/
servicio.post('/BuscarTitulo/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    ServicioSocial.findAll({
        where:{
            identificador: req.params.id
        }
    }).then((servicio)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado = true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:consulta, usuario:servicio});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado = true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:general,usuario:servicio})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado = true AND orden >= '+inicio+' and orden < '+fin+' and titulo = "'+req.body.titulo+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:infantil,usuario:servicio})
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
servicio.post('/BuscarAutor/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    ServicioSocial.findAll({
        where:{
            identificador: req.params.id
        }
    }).then((servicio)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado = true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:consulta, usuario:servicio});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado = true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroUsuario',{usuario:servicio,libro:general})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado = true AND orden >= '+inicio+' and orden < '+fin+' and autor = "'+req.body.autor+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroUsuario',{usuario:servicio,libro:infantil})
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
servicio.post('/BuscarEditorial/:categoria/:id/:numero',(req,res)=>{
    var inicio = parseFloat(req.params.numero);
    var fin = inicio + 100;
    ServicioSocial.findAll({
        where:{
            identificador: req.params.id 
        }
    }).then((servicio)=>{
        if(req.params.categoria == "consulta"){
            Conexion.query('Select * from libroConsulta where estado = true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((consulta)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:consulta, usuario:servicio});
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err)
            });
        }
        if(req.params.categoria == "general"){
            Conexion.query('Select * from libroGenerals where estado = true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((general)=>{
                res.render('tablaBusquedaLibroUsuario',{libro:general,usuario:servicio})
            })
            .catch((err)=>{
                res.status(400).send("Error al encontrar el libro: "+err);
            })
        }
        if(req.params.categoria == "infantil"){
            Conexion.query('Select * from libroInfantils where estado = true AND orden >= '+inicio+' and orden < '+fin+' and editorial = "'+req.body.editorial+'" ORDER BY orden ASC, volumen ASC;',{type:QueryTypes.SELECT})
            .then((infantil)=>{
                res.render('tablaBusquedaLibroUsuario',{usuario:servicio,libro:infantil})
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

module.exports = servicio;