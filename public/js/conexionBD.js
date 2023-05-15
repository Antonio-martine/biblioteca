import {conexion} from './conexionServicios'
function pedirDatos() {
    conexion.query('SELECT * FROM libroConsulta', function (error, results, fields) {
      if (error) throw error;
  
      let tabla = '<table>';
      tabla += '<tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th></tr>';
      results.forEach(function (usuario) {
        tabla += '<tr>';
        tabla += '<td>' + usuario.orden + '</td>';
        tabla += '<td>' + usuario.autor + '</td>';
        tabla += '<td>' + usuario.titulo + '</td>';
        tabla += '<td>' + usuario.volumen + '</td>';
        tabla += '</tr>';
      });
      tabla += '</table>';
  
      document.getElementById('datos').innerHTML = tabla;
    });
  }

