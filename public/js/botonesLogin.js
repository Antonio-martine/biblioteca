function btnAdmin(){
    document.getElementById('administrador').style.display = 'block';
    document.getElementById('usuario').style.display = 'none';
    document.getElementById('servicio').style.display = 'none';
  }

  function btnUser(){
    document.getElementById('administrador').style.display = 'none';
    document.getElementById('usuario').style.display = 'block';
    document.getElementById('servicio').style.display = 'none';
  }

  
function btnServicio(){
  document.getElementById('administrador').style.display = 'none';
  document.getElementById('usuario').style.display = 'none';
  document.getElementById('servicio').style.display = 'block';
}