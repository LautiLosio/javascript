alert("Bienvenido a Universify Web");

class Producto {
    constructor(id, nombre, precio, cantidad, carrera, condicion, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.carrera = carrera;
        this.condicion = condicion;
        this.imagen = imagen;
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
/**
 * @type {Producto[]}
 */
const productos = [
    new Producto(1, "Tablero", 38150, 5, "Arquitectura", "Nuevo", "./media/tablero.jpg"),
    new Producto(2, "Craneo", 45134, 5, "Odontologia", "Nuevo", "./media/craneo.jpg"),
    new Producto(3, "Escuadras", 4280, 10, "Ingenieria", "Nuevo", "./media/escuadras.jpg"),
    new Producto(4, "Ambo", 3210, 20, "Medicina", "Nuevo", "./media/ambo.jpg"),
    new Producto(5, "Calculadora", 10700, 1, "Ingenieria", "Usado", "./media/calculadora.jpg"),
    new Producto(6, "Kit", 6420, 1, "Medicina", "Usado", "./media/kit.jpg"),
    new Producto(7, "Apuntes", 2200, 1, "Ingenieria", "Usado", "./media/apuntes.jpg"),
    new Producto(8, "Huesos", 9500, 1, "Medicina", "Usado", "./media/huesos.jpg"),
    new Producto(9, "Estetoscopios", 12500, 5, "Medicina", "Nuevo", "./media/estetoscopio.jpg"),
    new Producto(10, "Microeconomia", 5350, 1, "Economia", "Usado", "./media/microeconomia.png"),
    new Producto(11, "Libro", 5900, 1, "Economia", "Usado", "./media/libro_moneda.jpg"),
    new Producto(12, "Matematica", 14980, 1, "Economia", "Usado", "./media/matematica.jpg")
]


for (let i = 1; i <= 12; i++) {
    let item = document.querySelector(`.img${i}`);
    let imagen = item.querySelector("img");
    let nombre = item.querySelector("figcaption p");
    let precio = item.querySelector("figcaption h5");

    imagen.src = productos[i - 1].imagen;
    nombre.innerHTML = productos[i - 1].nombre;
    precio.innerHTML = `$${productos[i-1].precio.toLocaleString()}`;

}

/**
 * Realiza la compra para cada producto del carrito
 * @param {[{id:number,cantidad:number,producto:Producto}]} carrito - array de objetos que contienen el id, cantidad y producto que se quiere comprar
 * @returns {number} el total de la compra, -1 si no se pudo comprar algun producto
 */
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

/**
 * Recibe un array con el id y cantidad del producto que se quiere comprar y lo agrega al carrito dependiendo de varias condiciones
 * @param {number[]} idCantidad array con el id y cantidad del producto que se quiere comprar
 * @returns {boolean} true si fallo y no se agrego al carrito, false si se agrego al carrito
 */
function cargarCarrito(idCantidad) {

    let id = idCantidad[0];
    let cantidad = idCantidad[1];

    let seleccion = {
        id: id,
        cantidad: cantidad,
        producto: productos.find(producto => producto.id == idCantidad[0]),
    }

    if (cantidad > seleccion.producto.cantidad) {
        alert(`El producto ${seleccion.producto.nombre} no tiene suficientes unidades`);
        return true;
    }

    if (carrito.some(item => item.id === id)) {
        let newCant = carrito.find(item => item.id === id).cantidad + cantidad;
        if (productos.find(item => item.id === id).cantidad >= newCant) {
            carrito.find(item => item.id === id).cantidad = newCant;
        } else {
            alert(`No puedes cargar mas de ${seleccion.producto.cantidad} unidades de ${seleccion.producto.nombre}.\nYa tienes ${carrito.find(item => item.id === id).cantidad}`);
            return true;
        }
    } else {
        if (cantidad < 0) {
            alert(`No puedes cargar una cantidad negativa`);
            return true;
        } else {
            carrito.push(seleccion);
        }
    }

    return false;
}

/**
 * Solicita al usuario un id y cantidad de un producto
 * @returns {number[]} array con los id y cantidad de los productos que se quieren comprar 
 */
function promptIdCantidad() {
    let idCantidad = [];
    tryAgain = true;
    do {
        idCantidad = prompt('Ingrese el id del producto y la cantidad a comprar sin espacio.\nEjemplo: "1,2"\nRecuerda cargar solo un producto a la vez.\n\n' + mostrarListaProductos(productos) + 'Elija su producto:').split(',');

        if (idCantidad.length == 2) {
            if (parseInt(idCantidad[0]) > 1 || parseInt(idCantidad[0]) < productos.length || parseInt(idCantidad[1]) > 1) {
                tryAgain = false;
            }
        } else {
            alert("El id o la cantidad no es correcto");
        }

    } while (tryAgain);

    idCantidad = [parseInt(idCantidad[0]), parseInt(idCantidad[1])];

    return idCantidad;
}

/**
 * 
 * @param {[objects]} productArray 
 * @returns 
 */
function mostrarListaProductos(productArray) {
    let productosList = "Id |    Nombre    |  Precio  |  Cantidad  |   Carrera   | Condicion\n";
    productArray.forEach(producto => { productosList += producto.toString() });
    return productosList;
}

/**
 * 
 * @param {string} text - texto a mostrar
 * @returns {string} - texto con el formato de una tabla
 */
function mostrarCarrito(text) {
    // let carritoList = "Su carrito contiene:\n";
    carrito.forEach(item => { text += `${item.producto.nombre} ($ ${item.producto.precio.toLocaleString()}) --> ${item.cantidad} unidades = $ ${(item.producto.precio * item.cantidad).toLocaleString()}\n`; });

    return text;
}

/**
 * 
 * @param {[Producto]} array - array de productos a filtrar
 * @param {string} tipoFiltro - tipo de filtro a aplicar: "1" para filtrar por estado, "2" para filtrar por carrera
 * @param {string} filtro - estado o carrera a filtrar
 * @returns {[object]} array de productos filtrados
 */
function filtrarProductos(array, tipoFiltro, filtro) {
    switch (tipoFiltro) {
        case "1":
            switch (filtro) {
                case "Nuevo":
                    filteredProducts = array.filter(producto => producto.condicion == "Nuevo");
                    break;
                case "Usado":
                    filteredProducts = array.filter(producto => producto.condicion == "Usado");
                    break;
                default:
                    filteredProducts = array;
                    break;
            }
            break;
        case "2":
            switch (filtro) {
                case "Arquitectura":
                    filteredProducts = array.filter(producto => producto.carrera == "Arquitectura");
                    break;
                case "Economia":
                    filteredProducts = array.filter(producto => producto.carrera == "Economia");
                    break;
                case "Ingenieria":
                    filteredProducts = array.filter(producto => producto.carrera == "Ingenieria");
                    break;
                case "Medicina":
                    filteredProducts = array.filter(producto => producto.carrera == "Medicina");
                    break;
                case "Odontologia":
                    filteredProducts = array.filter(producto => producto.carrera == "Odontologia");
                    break;
            }
            break;
        default:
            filteredProducts = array;
            break;

    }
    return filteredProducts;
}

let precioTotal = 0;
/**
 * @type {[{id:number,cantidad:number,producto:Producto}]}
 */
let carrito = [];

do {
    opcion = parseInt(prompt(`Seleccione una opcion:
    1. Agregar producto al carrito
    2. Comprar productos
    3. Mostrar carrito
    4. Filtrar productos
    0. Salir`));
    switch (opcion) {
        case 0:
            alert("Para iniciar la compra, vuelva a cargar la pagina");
            break;

        case 1:
            let idCantidad = []
            do {
                idCantidad = promptIdCantidad();
            } while (cargarCarrito(idCantidad));

            break;

        case 2:
            if (carrito.length == 0) {
                alert("No hay productos en el carrito");
                break;
            } else {
                if (confirm("¿Desea comprar los productos en el carrito?\n" + mostrarCarrito(`Su carrito contiene:\n`))) {
                    precioTotal = comprar(carrito);
                    if (precioTotal != -1) {
                        alert("Gracias por su compra, a continuacion le dejamos su ticket");
                        alert(`Comprobante Nº${Math.trunc(Math.random() * 10000)}\n\n${mostrarCarrito(`Productos comprados:\n`)}\nSu total es: $ ${precioTotal.toLocaleString()}`);
                        carrito = [];
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
                break;
            }

        case 3:
            if (carrito.length == 0) {
                alert("No hay productos en el carrito");
                break;
            }
            else {
                alert(mostrarCarrito(`Su carrito contiene:\n`));
                break;
            }

        case 4:
            do {
                tipoFiltro = prompt(`Seleccione una opcion:\n1. Filtrar por condicion\n2. Filtrar por carrera\n0. Volver`);
                switch (tipoFiltro) {
                    case "0":
                        break;

                    case "1":
                        filtro = prompt(`Seleccione una opcion:\n1. Nuevo\n2. Usado\n`);
                        switch (filtro) {
                            case "1":
                                filtro = "Nuevo";
                                break;
                            case "2":
                                filtro = "Usado";
                                break;
                            default:
                                alert("Opcion no valida, se muestran todos los productos");
                                break;
                        }
                        if (filtro != "") {
                            alert(mostrarListaProductos(filtrarProductos(productos, tipoFiltro, filtro)));
                        }
                        break;

                    case "2":
                        filtro = prompt(`Seleccione una opcion:\n1. Arquitectura\n2. Economia\n3. Ingenieria\n4. Medicina\n5. Odontologia\n`);
                        switch (filtro) {
                            case "1":
                                filtro = "Arquitectura";
                                break;
                            case "2":
                                filtro = "Economia";
                                break;
                            case "3":
                                filtro = "Ingenieria";
                                break;
                            case "4":
                                filtro = "Medicina";
                                break;
                            case "5":
                                filtro = "Odontologia";
                                break;
                            default:
                                alert("Opcion no valida, se muestran todos los productos");
                                break;
                        }
                        if (filtro != "") {
                            alert(mostrarListaProductos(filtrarProductos(productos, tipoFiltro, filtro)));
                        }
                        break;

                    default:
                        alert("Opcion no valida");
                        break;
                }
            } while (tipoFiltro != "0");
            break;

        default:
            alert("Opcion no valida");
            break;
    }
} while (opcion != 0);