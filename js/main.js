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

// Decaracion de variables globales
let carrito = [];
const imgGrid = document.querySelector("#img-grid");
let totalButton = document.querySelector("#total-button");
let carritoCloseButton = document.querySelector("#carrito-close-button");
let carrera = "";
let condicion = "";
let conditionFilter = document.querySelector("#condicion");
let carreraFilter = document.querySelector("#carrera");
let resetFilter = document.querySelector("#resetFilter");
let buyButton = document.querySelector("#buy-button");
let body = document.querySelector("body");

// Asignacion de eventos
totalButton.addEventListener("click", () => { toggleCarrito() });
carritoCloseButton.addEventListener("click", () => { toggleCarrito() });
conditionFilter.addEventListener("change", () => { condicion = conditionFilter.value; filtrarProductos(); });
carreraFilter.addEventListener("change", () => { carrera = carreraFilter.value; filtrarProductos(); });
resetFilter.addEventListener("click", () => { loadProducts(productos); condicion = ""; carrera = ""; });
buyButton.addEventListener("click", () => { comprar(); });



/**
 * Crea el html para mostrar los productos en la pagina
 * 
 * @param {*} array - lista de productos que se van a mostrar en la pagina
 */
function loadProducts (array) {
    // Limpia el contenido de la pagina
    imgGrid.textContent = "";

    if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            // Declaro todas las variables que necesito para crear el html
            let item = array[i];
            let figure = document.createElement("figure");
            let img = document.createElement("img");
            let name = document.createElement("h4");
            let figcaption = document.createElement("figcaption");
            let price = document.createElement("h5");
            let stock = document.createElement("p");
            let selector = document.createElement("input");
            let selectorContainer = document.createElement("div");
            selectorContainer.className = "selector-container";
            
            // Seteo los atributos de los elementos
            stock.innerHTML = `Stock: ${item.cantidad}`;
            selector.className = "selector";
            selector.type = "number";
            selector.min = "0";
            selector.max = item.cantidad;
            selector.readOnly = true;
            // Cargo el valor del selector con la cantidad de productos disponibles
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
            
            // Creo el boton de agregar al carrito (esto es para poder controlar los tipos de datos que el usuario puede ingresar)
            let plus = document.createElement("button");
            plus.className = "add-button";
            plus.innerHTML = "+";
            // Agrega el producto al carrito cuando se hace click en el boton de agregar y actualiza el contenido del selector
            plus.addEventListener("click", () => { 
                selector.stepUp(1);
                selector.value = cargarCarrito(item.id,selector.valueAsNumber);
                if (selector.valueAsNumber > 0) {
                    figure.classList.add("in-cart");
                }
                updateTotalButton();
            });
            // Actualiza la class de la figura para que se muestre el border de color verde
            if (selector.valueAsNumber > 0) {
                figure.classList.add("in-cart");
            }
            
            // Creo el boton de quitar del carrito
            let minus = document.createElement("button");
            minus.className = "remove-button";
            minus.innerHTML = "-";
            // Quita el producto del carrito cuando se hace click en el boton de quitar y actualiza el contenido del selector
            minus.addEventListener("click", () => { 
                selector.stepDown(1);
                selector.value = cargarCarrito(item.id,selector.valueAsNumber);
                if (selector.valueAsNumber === 0) {
                    figure.classList.remove("in-cart");
                }
                updateTotalButton();
            });
            // Actualiza la class de la figura para que se no muestre el border de color verde
            if (selector.valueAsNumber === 0) {
                figure.classList.remove("in-cart");
            }

            // Cargo la imagen del producto en el html
            img.src = item.imagen;
            // Agrega la clase "out-of-stock" a la figura si el stock es 0
            if (item.cantidad == 0) {
                figure.classList.add("out-of-stock");
            }
            price.innerHTML = `$${item.precio.toLocaleString()}`;
            name.innerHTML = item.nombre;

            // creo el html para el selector
            selectorContainer.appendChild(minus);
            selectorContainer.appendChild(selector);
            selectorContainer.appendChild(plus);
            
            // Creo el html para la figura
            figure.appendChild(img);
            figure.appendChild(name);
            figure.appendChild(figcaption);
            figcaption.appendChild(price);
            figcaption.appendChild(stock);
            figcaption.appendChild(selectorContainer);
            
            // Agrega el html de producto completo al contenedor de la pagina
            imgGrid.appendChild(figure);
        }
    } else {
        // Si no hay productos en el array, muestro un mensaje al usuario
        let p = document.createElement("p");
        p.className = "no-products";
        p.innerHTML = "No hay productos disponibles";
        imgGrid.appendChild(p);
    }
}

// Carga inicial de todos los productos
loadProducts(productos);

/**
 * Realiza la compra de todos los productos del carrito
 * 
 * @returns no devuelve nada
 */
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
    updateTotalButton();
    toggleCarrito();
    toggleTotalButton();
}

/**
 * Actualiza los productos del carrito.
 * 
 * Esta funcion quedo un poco desactualizada ya que ahora se previene la carga incorrecta desde el html, pero la dejo para prevenir un intento de compra por consola.
 * 
 * @param {number} id - id del producto que se quiere agregar al carrito
 * @param {number} cantidad - cantidad de productos que se quiere agregar al carrito 
 * 
 * @returns {number} devuelve un numero que corrige el valor del selector en caso de que la cantidad que se quiere agregar no sea valida (negativa o mayor a la cantidad disponible)
 */
function cargarCarrito(id, cantidad) {

    // creo un objeto con el id y cantidad del producto que se quiere comprar y le asocio el producto correspondiente
    let seleccion = {
        id: id,
        cantidad: cantidad,
        producto: productos.find(producto => producto.id == id),
    }

    // Busco el producto en el carrito para ver si ya existe
    let found = carrito.find(item => item.producto.id === seleccion.producto.id);

    // Si la cantidad es 0, quiere decir que se quiere quitar el producto del carrito
    if (seleccion.cantidad === 0) {
        // Si el producto existe, lo elimino del carrito
        if (found) {
            carrito.splice(carrito.indexOf(found), 1);
        }
    }

    // Si la cantidad es menor a 0, muestro un mensaje de error (esto quedo viejo ya que se previenen estos casos desde el html)
    if (cantidad < 0) {
        alert("La cantidad debe ser mayor a 0");
        if (found) {
            return found.cantidad;
        } else {
            return 0;
        }
    }

    // Si la cantidad que se quiere comprar es mayor a la cantidad disponible, muestro un mensaje de error (esto tambien quedo deprecado)
    if (cantidad > seleccion.producto.cantidad) {
        alert(`El producto ${seleccion.producto.nombre} no tiene suficientes unidades`);
        if (found) {
            return found.cantidad;
        } else {
            return 0;
        }
    }
    
    // Si el producto ya existe en el carrito, solo actualizo la cantidad
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
        // Si el producto no existe en el carrito, lo agrego
        carrito.push(seleccion);
    }

    return cantidad;
}

/**
 * Actualiza el contenido del boton de carrito para que se muestre el precio total del carrito
 */
function updateTotalButton() {
    let carritoButtonText = totalButton.querySelector("p");
    
    // Hago una suma de todos los precios del carrito
    let total = 0;
    for (const item of carrito) {
        total += item.producto.precio * item.cantidad;
    }
    
    // Muestro el precio total en el boton de carrito si hay productos en el carrito
    if (total > 0) {
        totalButton.classList.remove("hidden");
        carritoButtonText.innerHTML = `Total: $${total.toLocaleString()}`;
    }
    
    // Si el carrito esta vacio, oculto el boton
    if (total === 0 || carrito.length === 0) {
        totalButton.classList.add("hidden");
    }
    
}

function toggleTotalButton() {
    totalButton.classList.toggle("hidden");
}

function updateCarrito() {
    // Actualizo el contenido del carrito
    let carritoBody = document.querySelector("#carrito-body");
    carritoBody.innerHTML = "";
    for (const item of carrito) {
        let carritoItem = document.createElement("figure");
        carritoItem.className = "carrito-product";
        carritoItem.innerHTML = `
            <div class="carrito-product-image">
                <img class="carrito-product-image" src="${item.producto.imagen}" alt="${item.producto.nombre}">
                <h4>${item.producto.nombre}</h4>
            </div>
            <figcaption class="carrito-product-info">
                <p>Cantidad: ${item.cantidad}</p>
                <p>$${(item.producto.precio * item.cantidad).toLocaleString()}</p>
            </figcaption>
        `;
        carritoBody.appendChild(carritoItem);
    }
    if (carrito.length === 0) {
        carritoBody.innerHTML = `<p>No hay productos en el carrito</p>`;
    }
}

function toggleCarrito() {
    updateCarrito();
    toggleTotalButton();
    let carritoContainer = document.querySelector("#carrito-container");
    carritoContainer.classList.toggle("hidden");

    if (!carritoContainer.classList.contains("hidden")) {
        body.style.overflow = "hidden";
    } else {
        body.style.overflow = "auto";
    }
}

/**
 * Toma los valores de los selectores de carrera y condicion y filtra los productos disponibles, luego llama a la funcion 'loadProducts()' para actualizar el contenido de la pagina con los productos filtrados
 */
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