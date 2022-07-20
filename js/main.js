alert("Bienvenido a Universify Web");
class Producto {
    constructor(id, nombre, precio, cantidad, carrera, condicion) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.carrera = carrera;
        this.condicion = condicion;
    }

    buy(amount) {
        this.cantidad -= amount;
    }

    disponible(amount) {
        return this.cantidad >= amount;
    }

    toString() {
        return ` ${this.id}   |   ${this.nombre}   |   $ ${this.precio.toLocaleString()}   |   ${this.cantidad}   |   ${this.carrera}   |   ${this.condicion} \n`;
    }
}

// Productos
const productos = [
    new Producto(1, "Tablero", 38150, 5, "Arquitectura", "Nuevo"),
    new Producto(2, "Craneo", 45134, 5, "Odontologia", "Nuevo"),
    new Producto(3, "Escuadras", 4280, 10, "Ingenieria", "Nuevo"),
    new Producto(4, "Ambo", 3210, 20, "Medicina", "Nuevo"),
    new Producto(5, "Calculadora", 10700, 1, "Ingenieria", "Usado"),
    new Producto(6, "Kit", 6420, 1, "Medicina", "Usado"),
    new Producto(7, "Apuntes", 2200, 1, "Ingenieria", "Usado"),
    new Producto(8, "Huesos", 9500, 1, "Medicina", "Usado"),
    new Producto(9, "Estetoscopios", 12500, 5, "Medicina", "Nuevo"),
    new Producto(10, "Microeconomia", 5350, 1, "Economia", "Usado"),
    new Producto(11, "Libro", 5900, 1, "Economia", "Usado"),
    new Producto(12, "Matematica", 14980, 1, "Economia", "Usado")
]

function comprar(carrito) {
    let total = 0;
    for (const item of carrito) {
        if (item.producto.disponible(item.cantidad)) {
            item.producto.buy(item.cantidad);
            total += item.producto.precio * item.cantidad;
        } else {
            alert(`El producto ${item.producto.nombre} no tiene suficientes unidades`);
            return -1;
        }
    }

    return total;
}

function cargarCarrito(idCantidad) {

    let id = idCantidad[0];
    let cantidad = idCantidad[1];

    let seleccion = {
        id: id,
        cantidad: cantidad,
        producto: productos.find(producto => producto.id == idCantidad[0]),
    }

    if (carrito.some(item => item.id === seleccion.id)) {
        carrito.find(item => item.id === seleccion.id).cantidad += seleccion.cantidad;
    } else {
        carrito.push(seleccion);
    }

    return seleccion;

}

// function calcularPrecios(producto, cantidad) {
//     // calculo de precios
//     let precio = 0;
//     switch (producto) {
//         case 1:
//             precio = cantidad * 1000;
//             break;
//         case 2:
//             precio = cantidad * 2000;
//             break;
//         case 3:
//             precio = cantidad * 3000;
//             break;
//         default:
//             precio = 0;
//             break;
//     }
//     return precio;
// }

function promptIdCantidad() {
    let idCantidad = [];
    tryAgain = true;
    do {
        idCantidad = prompt("Ingrese el id del producto y la cantidad a comprar sin espacio\nEjemplo: 1,2\nRecuerda cargar solo un producto a la vez\n\n" + mostrarListaProductos(productos) + "Elija su producto:").split(",");

        if (idCantidad.length == 2) {
            if (parseInt(idCantidad[0]) > 1 || parseInt(idCantidad[0]) < productos.length || parseInt(idCantidad[1]) > 1) {
                tryAgain= false;
            } 
        } else {
            alert("El id o la cantidad no es correcto");
        }

    } while (tryAgain);

    idCantidad = [parseInt(idCantidad[0]), parseInt(idCantidad[1])];

    return idCantidad;
}


function mostrarListaProductos(productArray) {
    // mostrar lista de productos
    let productosList = "Id |    Nombre    |  Precio  |  Cantidad  |   Carrera   | Condicion\n";
    productArray.forEach(producto => { productosList += producto.toString() });
    return productosList;
}
// log the price of the first product in local currency

function mostrarCarrito(carrito) {
    // mostrar carrito
    let carritoList = "Su carrito contiene:\n";
    carrito.forEach(item => { carritoList += `${item.producto.nombre} ($ ${item.producto.precio.toLocaleString()}) --> ${item.cantidad} unidades = $ ${(item.producto.precio * item.cantidad).toLocaleString()}\n`; });

    return carritoList;

    // alert(carritoList);
}

// function imprimirTicket(precioTotal, intento) {
//     // mostrar precios
//     alert("El precio total para las " + intento + " compras realizadas es: $" + precioTotal);
// }

// let bought = false;
let precioTotal = 0;
let carrito = [];


do {
    opcion = parseInt(prompt(`Seleccione una opcion:
    1. Agregar producto al carrito
    2. Comprar productos
    3. Mostrar carrito
    0. Salir`));
    switch (opcion) {
        case 0:
            alert("Para iniciar la compra, vuelva a cargar la pagina");
            break;

        case 1:
            // bought = true;
            
            let idCantidad = promptIdCantidad();

            cargarCarrito(idCantidad);

            // precioTotal = comprar(carrito);
            // mostrarCarrito(carrito);

            break;

        case 2:
            if (carrito.length == 0) {
                alert("No hay productos en el carrito");
                break;
            }
            else {
                if (confirm("¿Desea comprar los productos en el carrito?\n" + mostrarCarrito(carrito))) {
                    precioTotal = comprar(carrito);
                    if (precioTotal != -1) {
                        carrito = [];
                        alert("Gracias por su compra, a continuacion le dejamos su ticket");
                    }
                    else {
                        alert("No se pudo realizar la compra");
                        if (confirm("Desea vaciar su carrito?")) {
                            carrito = [];
                        }
                    }
                }
                else {
                    if (confirm("Desea vaciar su carrito?")) {
                        carrito = [];
                    }
                }
                
                // imprimirTicket(precioTotal, intento);
                break;
            }

        case 3:
            if (carrito.length == 0) {
                alert("No hay productos en el carrito");
                break;
            }
            else {
                alert(mostrarCarrito(carrito));
                break;
            }

        default:
            alert("Opcion no valida");
            break;
    }
} while (opcion != 0);