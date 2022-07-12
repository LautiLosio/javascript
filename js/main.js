alert("Bienvenido a Universify Web");

function comprar() {
    let producto = seleccionProductos();
    let precio = calcularPrecios(producto[0], producto[1]);
    return precio;
}

function seleccionProductos() {
    // seleccion de productos
    let producto = parseInt(prompt("Seleccione un producto: \n1. Smartphone \n2. Tablet \n3. Laptop"));
    let cantidad = parseInt(prompt("Ingrese la cantidad de productos que desea comprar:"));

    return [producto, cantidad];
}

function calcularPrecios(producto, cantidad) {
    // calculo de precios
    let precio = 0;
    switch (producto) {
        case 1:
            precio = cantidad * 1000;
            break;
        case 2:
            precio = cantidad * 2000;
            break;
        case 3:
            precio = cantidad * 3000;
            break;
        default:
            precio = 0;
            break;
    }
    return precio;
}

function mostrarPrecio(precio, intento) {
    // mostrar precios
    alert("El precio para la compra " + intento +" es: $" + precio);
}

function imprimirTicket(precioTotal, intento) {
    // mostrar precios
    alert("El precio total para las " + intento + " compras realizadas es: $" + precioTotal);
}

let intento = 0;
let precio = 0;
let precioTotal = 0;
do {
    opcion = parseInt(prompt("Seleccione una opcion: \n1. Comprar \n2. Salir"));
    switch (opcion) {
        case 1:
            precio = comprar();
            mostrarPrecio(precio, intento);
            precioTotal = precioTotal + precio;
            break;
        case 2:
            if(intento == 0){
                alert("Para iniciar la compra, vuelva a cargar la pagina");
            }else{
                alert("Gracias por su compra, a continuacion le dejamos su ticket");
                imprimirTicket(precioTotal, intento);
            }
            break;
        default:
            alert("Opcion no valida");
            break;
    }
    intento++;
} while (opcion != 2);