// Esto es un comentairo de una linea

/* 

Este es un comentario de varias lineas
sirve para explicar funcionalidades
y tambien para comentar bloques de codigo
mientras esta en desarrolo
Atajo Ctrl+Shift+A

*/

/* 

Palabras reservadas. Solo deben usarse para el fin para el que fueron creadas. No nombrar variables, funciones, etc, con palabras reservadas.
Ejemplos: break, case, catch, continue, default, let, delete, do, else, finally, for, function, if, in, instanceof, new, return, switch, this, throw, try, typeof, var, void, while, with, y varias mas...

*/

/* usar la palabra clave "var" para declarar variables no es una buena practica */

let nombre = 'Lautaro';
let otroNombre = 'Rodrigo';
// let edad = 21;
let altura = 1.61;
let letra = 'A';
let cadena = '12';

const TATUAJE = 'Mamá me tatué';

// Declaracion
let ciudad;
let pais;
let edad

// Inicializacion o asignacion
ciudad = 'Cordoba';
pais = 'Argentina';
edad = '21';

nombre = 'Francisco';

const IVA = 0.21;

// Operaciones con variables numericas
let numeroA = 4;
let numeroB = 9;
const PI = 3.14;

let suma = numeroA + numeroB;
let resta = numeroA - numeroB;
let producto = numeroA * numeroB;
let division = numeroA / numeroB;
let modulo = numeroA % numeroB;
let exponente = numeroA ** numeroB;
let raiz = numeroA ** (1 / numeroB);

// Operaciones con variables string
let palabra1 = 'Hola';
let palabra2 = 'Mundo';
let remate = 'A la grande le puse Cuca';
let numero = 27;
let numeroString = '27';

let concatenar1y2 = palabra1 + ' ' + palabra2;
let remateNumero = remate + ' ' + numero;
let numeroStringNumero = numeroString + numero;

// Promts y alerts
let nombreUsuario = prompt('Cual es tu nombre?');
console.log(nombreUsuario);
alert('Bienvenido ' + nombreUsuario);

let edadUsuario = parseInt(prompt('Cual es tu edad?'));
console.log(edadUsuario);
let alturaUsuario = parseFloat(prompt('Cual es tu altura?'));
console.log(alturaUsuario);

let edadCincos = edadUsuario + 5;
console.log(edadCincos);

let alturaDeseada = alturaUsuario + 0.1;

alert ('Tu nombre es ' + nombreUsuario + ', tu edad es ' + edadUsuario + ' y tu altura es ' + alturaUsuario + '.\n' + 'Tu edad dentro de cinco años va a ser ' + edadCincos + '.\n' + 'Tu altura deseada es ' + alturaDeseada);