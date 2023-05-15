var CrytoJS = require("crypto-js");
var ciphertext = CrytoJS.AES.encrypt('Antonio','secret key 123').toString();

//Descrypt
var bytes = CrytoJS.AES.decrypt(ciphertext,'secret key 123');
var originText = bytes.toString(CrytoJS.enc.Utf8);

console.log("Texto encriptado: "+ciphertext);
console.log("Texto desencriptado: "+originText)