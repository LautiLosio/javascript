//CONDICIONALES

// let edad = 37;

// if (edad >= 18) {
//     console.log('Podés comprar una cerveza');
// } else {
//     console.log('Andá a tu casa pibe');
// }


let edadObligada = 18;
let edadOptativa = 16;
let edadUsuario = parseInt(prompt('Cual es tu edad?'));

if (edadUsuario >= edadObligada) {
    console.log('Podés manejar solo/a');
} else if (edadUsuario >= edadOptativa) {
    console.log('Podés manejar con acompañamiento');
} else {
    console.log('No podés manejar');
}


