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
    new Producto(10, "Microeconomia", 5350, 1, "Economia", "Usado", "./media/microeconomia.jpg"),
    new Producto(11, "Libro", 5900, 1, "Economia", "Usado", "./media/libro_moneda.jpg"),
    new Producto(12, "Matematica", 14980, 1, "Economia", "Usado", "./media/matematica.jpg")
]

let carrito = [];


const imgGrid = document.querySelector("#img-grid");

/**
 * Crea el html para mostrar los productos en la pagina
 * 
 * @param {*} array - lista de productos que se van a mostrar en la pagina
 */
function loadProducts (array) {
    imgGrid.textContent = "";
    if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            let figure = document.createElement("figure");
            let img = document.createElement("img");
            let name = document.createElement("h4");
            let figcaption = document.createElement("figcaption");
            let price = document.createElement("h5");
            
            let stock = document.createElement("p");
            stock.innerHTML = `Stock: ${item.cantidad}`;
            
            let selectorContainer = document.createElement("div");
            selectorContainer.className = "selector-container";
            


            let selector = document.createElement("input");
            
            selector.className = "selector";
            selector.type = "number";
            selector.min = "0";
            selector.max = item.cantidad;
            selector.readOnly = true;
            if (carrito.length > 0) {
                let found = carrito.find(item => item.producto.id === array[i].id);
                if (found) {
                    selector.value = found.cantidad;
                } else {
                    selector.value = 0;
                }
            } else {
                selector.value = 0;
            }
            
            let plus = document.createElement("button");
            plus.className = "add-button";
            plus.innerHTML = "+";
            plus.addEventListener("click", () => { 
                selector.stepUp(1);
                selector.value = cargarCarrito(item.id,selector.valueAsNumber);
                if (selector.valueAsNumber > 0) {
                    figure.classList.add("in-cart");
                }
                updateCarritoButton();
            });
            if (selector.valueAsNumber > 0) {
                figure.classList.add("in-cart");
            }
            
            let minus = document.createElement("button");
            minus.className = "remove-button";
            minus.innerHTML = "-";
            minus.addEventListener("click", () => { 
                selector.stepDown(1);
                selector.value = cargarCarrito(item.id,selector.valueAsNumber);
                if (selector.valueAsNumber === 0) {
                    figure.classList.remove("in-cart");
                }
                updateCarritoButton();
            });
            if (selector.valueAsNumber === 0) {
                figure.classList.remove("in-cart");
            }

            // selector.addEventListener("change", () => {selector.value = cargarCarrito(item.id,selector.valueAsNumber); updateCarritoButton();});


            img.src = item.imagen;
            if (item.cantidad == 0) {
                figure.classList.add("out-of-stock");
            }
            price.innerHTML = `$${item.precio.toLocaleString()}`;
            name.innerHTML = item.nombre;

            selectorContainer.appendChild(minus);
            selectorContainer.appendChild(selector);
            selectorContainer.appendChild(plus);
            
            figure.appendChild(img);
            figure.appendChild(name);
            figure.appendChild(figcaption);
            figcaption.appendChild(price);
            figcaption.appendChild(stock);
            figcaption.appendChild(selectorContainer);
            
            imgGrid.appendChild(figure);
        }
    } else {
        let p = document.createElement("p");
        p.className = "no-products";
        p.innerHTML = "No hay productos disponibles";
        imgGrid.appendChild(p);
    }
}

loadProducts(productos);

function comprar() {
    for (const item of carrito) {
        if (item.producto.disponible(item.cantidad)) {
            item.producto.buy(item.cantidad);
        } else {
            alert(`El producto ${item.producto.nombre} no tiene suficientes unidades`);
            return;
        }
    }
    
    alert(`Compra realizada con exito`);
    carrito = [];
    filtrarProductos();
    updateCarritoButton();
    return;
}

/**
 * Recibe un array con el id y cantidad del producto que se quiere comprar y lo agrega al carrito dependiendo de varias condiciones
 * @param {number[]} idCantidad array con el id y cantidad del producto que se quiere comprar
 * @returns {boolean} true si fallo y no se agrego al carrito, false si se agrego al carrito
 */
function cargarCarrito(id, cantidad) {

    let seleccion = {
        id: id,
        cantidad: cantidad,
        producto: productos.find(producto => producto.id == id),
    }

    let found = carrito.find(item => item.producto.id === seleccion.producto.id);

    if (cantidad < 0) {
        alert("La cantidad debe ser mayor a 0");
        if (found) {
            return found.cantidad;
        } else {
            return 0;
        }
    }

    if (cantidad > seleccion.producto.cantidad) {
        alert(`El producto ${seleccion.producto.nombre} no tiene suficientes unidades`);
        if (found) {
            return found.cantidad;
        } else {
            return 0;
        }
    }
    
    if (found) {
        if (productos.find(item => item.id === id).cantidad >= cantidad) {
            found.cantidad = cantidad;
        } else {
            alert(`No puedes cargar mas de ${seleccion.producto.cantidad} unidades de ${seleccion.producto.nombre}.\nYa tienes ${found.cantidad}`);
            if (found) {
                return found.cantidad;
            } else {
                return 0;
            }
        }
    } else {
            carrito.push(seleccion);
    }

    
    return cantidad;
}

let carritoButton = document.querySelector("#carrito-button");
carritoButton.addEventListener("click", () => { comprar() });

function updateCarritoButton() {
    let carritoButtonText = document.querySelector("#carrito-button p");
    
    let total = 0;
    for (const item of carrito) {
        total += item.producto.precio * item.cantidad;
    }
    
    if (total > 0) {
        carritoButton.classList.remove("hidden");
        carritoButtonText.innerHTML = `Total: $${total.toLocaleString()}`;
    }
    
    if (total === 0) {
        carritoButton.classList.add("hidden");
    }
    
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

function filtrarProductos () {
    let filteredProducts = productos;

    if (carrera != "") {
        filteredProducts = filteredProducts.filter(producto => producto.carrera == carrera);
        if (condicion != "") {
            filteredProducts = filteredProducts.filter(producto => producto.condicion == condicion);
        }
    } else {
        if (condicion != "") {
            filteredProducts = filteredProducts.filter(producto => producto.condicion == condicion);
            if (carrera != "") {
                filteredProducts = filteredProducts.filter(producto => producto.carrera == carrera);
            }
        }
    }
        
    loadProducts(filteredProducts);
}

let carrera = "";
let condicion = "";

let conditionFilter = document.querySelector("#condicion");
let carreraFilter = document.querySelector("#carrera");
let resetFilter = document.querySelector("#resetFilter");
conditionFilter.addEventListener("change", () => { condicion = conditionFilter.value; filtrarProductos(); });
carreraFilter.addEventListener("change", () => { carrera = carreraFilter.value; filtrarProductos(); });
resetFilter.addEventListener("click", () => { loadProducts(productos); condicion = ""; carrera = ""; });

// ######################################################################################################################

let precioTotal = 0;
/**
 * @type {[{id:number,cantidad:number,producto:Producto}]}
 */
function main() {
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
}