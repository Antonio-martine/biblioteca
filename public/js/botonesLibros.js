function btnConsulta(){
    document.getElementById('consulta').style.display = 'block';
    document.getElementById('general').style.display = 'none';
    document.getElementById('infantil').style.display = 'none';
  }

  function btnGeneral(){
    document.getElementById('consulta').style.display = 'none';
    document.getElementById('general').style.display = 'block';
    document.getElementById('infantil').style.display = 'none';
  }

  function btnInfantil(){
    document.getElementById('consulta').style.display = 'none';
    document.getElementById('general').style.display = 'none';
    document.getElementById('infantil').style.display = 'block';
  }