/*Mostrar Password --> Nuevo Usuario*/
const togglePassword2 = document.querySelector('#togglePassword2');
const password2 = document.querySelector('#id_password2');

togglePassword2.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password2.getAttribute('type') === 'password' ? 'text' : 'password';
    password2.setAttribute('type', type);
});
