/*Mostrar Password --> Nuevo Usuario*/
const togglePassword3 = document.querySelector('#togglePassword3');
const password3 = document.querySelector('#id_password3');

togglePassword3.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password3.getAttribute('type') === 'password' ? 'text' : 'password';
    password3.setAttribute('type', type);
});
