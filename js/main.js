alert('Esta es una simple calculadora de raices cuadraticas implementada con un ciclo do...while');

let i = 0;

do {
    // Mostrar cantidad de usos
    alert('Se han hecho ' + i + ' cálculos.');
    
    // Pedir los datos
    let a = prompt('Ingrese el valor de a');
    let b = prompt('Ingrese el valor de b');
    let c = prompt('Ingrese el valor de c');

    // Realizar la operacion
    let x1 = (-b + Math.sqrt(b*b - 4*a*c))/(2*a);
    let x2 = (-b - Math.sqrt(b*b - 4*a*c))/(2*a);
    
    // Mostrar los resultados considerando que los valores pueden ser NaN (Not a Number)
    if (isNaN(x1) || isNaN(x2)) {
        alert('No existe raiz real.');
    } else {
        alert('El valor de x1 es: ' + x1);
        alert('El valor de x2 es: ' + x2);
    }
    
    // Preguntar si se desea continuar
    continuar = confirm('Desea continuar?');

    // Contador de usos
    i++;
} while(continuar);