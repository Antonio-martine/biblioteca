function btnTitulo(){
    document.getElementById('titulo').style.display = 'block';
    document.getElementById('autor').style.display = 'none';
    document.getElementById('editorial').style.display = 'none';
  }

  function btnAutor(){
    document.getElementById('titulo').style.display = 'none';
    document.getElementById('autor').style.display = 'block';
    document.getElementById('editorial').style.display = 'none';
  }

  function btnEditorial(){
    document.getElementById('titulo').style.display = 'none';
    document.getElementById('autor').style.display = 'none';
    document.getElementById('editorial').style.display = 'block';
  }