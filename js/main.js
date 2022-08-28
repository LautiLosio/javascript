class Producto {
    constructor(id, title, price, available, category, rating, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.available = available;
        this.category = category;
        this.rating = rating;
        this.image = image;
    }

    buy(amount) {
        this.available -= amount;
    }

    disponible(amount) {
        return this.available >= amount;
    }

    toString() {
        return ` ${this.id}   |   ${this.title}   |   $ ${this.price.toLocaleString()}   |   ${this.available}   |   ${this.category}   |   ${this.rating} \n`;
    }
}

const productos = [];

/**
 * Obtiene los productos desde la API y los agrega a la lista de productos
 * @fetch https://fakestoreapi.com/products
 */
async function fetchProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    const dolarHoy = await getDolarPrice();

    const data = await response.json();
    for (const product of data) {
        productos.push(new Producto(product.id, product.title, product.price * dolarHoy, Math.trunc(Math.random() * 20) + 1, product.category, product.rating.rate, product.image));
        // La cantidad de productos a cargar es aleatoria entre 1 y 20 ya que la API no tiene una cantidad de productos como parametro
        // El precio de los productos es el precio de la API multiplicado por el dolar de hoy (dolarHoy) porque la API maneja los precios en dolares, y ademas porque me parecio cool
    }
    loadProducts(productos);
}


/**
 * Consulta la API para obtener el precio del dolar de hoy
 * @api https://api.exchangeratesapi.io/latest?base=USD 
 * @returns {number} el precio del dolar de hoy
 */
async function getDolarPrice() {
    const response = await fetch('https://cors-solucion.herokuapp.com/https://api-dolar-argentina.herokuapp.com/api/dolarblue');
    const data = await response.json();

    let compra = parseFloat(data.compra);
    let venta = parseFloat(data.venta);

    dolarHoy = (compra + venta) / 2;

    return dolarHoy;
}

fetchProducts();

// Decaracion de variables globales
let carrito = [];
const imgGrid = document.querySelector("#img-grid");
let totalButton = document.querySelector("#total-button");
let carritoCloseButton = document.querySelector("#carrito-close-button");
let ratingSelector = document.querySelector("#rating-selector");
let categorySelector = document.querySelector("#category-selector");
let resetFilter = document.querySelector("#resetFilter");
let buyButton = document.querySelector("#buy-button");
let body = document.querySelector("body");
let saveCarritoButton = document.querySelector("#save-carrito-button");
let loadCarritoButton = document.querySelector("#load-carrito-button");
let clearCarritoButton = document.querySelector("#clear-carrito-button");
let showAmount = document.querySelector("#show-amount");
let amount = showAmount.value;
let subscribeEmail = document.querySelector("#subscribe-email");
let subscribeButton = document.querySelector("#subscribe-button");

// Asignacion de eventos
totalButton.addEventListener("click", () => { toggleCarrito() });
carritoCloseButton.addEventListener("click", () => { toggleCarrito() });
ratingSelector.addEventListener("change", () => { rating = ratingSelector.value; filterProducts(); });
categorySelector.addEventListener("change", () => { category = categorySelector.value; filterProducts(); });
resetFilter.addEventListener("click", () => { loadProducts(productos); });
buyButton.addEventListener("click", () => { comprar(); });
saveCarritoButton.addEventListener("click", () => { saveCarrito(); });
loadCarritoButton.addEventListener("click", () => { loadCarrito(); });
clearCarritoButton.addEventListener("click", () => { clearCarrito(); });
showAmount.addEventListener("change", () => { amount = showAmount.value; filterProducts(); });
subscribeButton.addEventListener("click", () => { saveEmail(); });

/**
 * Crea el html para mostrar los productos en la pagina
 * 
 * @param {*} array - lista de productos que se van a mostrar en la pagina
 */
function loadProducts (array) {
    // Limpia el contenido de la pagina
    imgGrid.textContent = "";

    if (array.length > 0) {
        for (let i = 0; i < amount && i < array.length; i++) {
            // Declaro todas las variables que necesito para crear el html
            let product = array[i];
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
            stock.innerHTML = `Stock: ${product.available}`;
            selector.className = "selector";
            selector.type = "number";
            selector.min = "0";
            selector.max = product.available;
            selector.readOnly = true;
            // Cargo el valor del selector con la cantidad de productos disponibles
            if (carrito.length > 0) {
                let found = carrito.find(item => item.producto.id === array[i].id);
                found ? selector.value = found.cantidad : selector.value = 0;
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
                selector.value = cargarCarrito(product.id,selector.valueAsNumber);
                selector.valueAsNumber > 0 && figure.classList.add("in-cart");
                updateTotalButton();
            });
            // Actualiza la class de la figura para que se no muestre el border de color verde
            selector.valueAsNumber > 0 && figure.classList.add("in-cart");
            
            // Creo el boton de quitar del carrito
            let minus = document.createElement("button");
            minus.className = "remove-button";
            minus.innerHTML = "-";
            // Quita el producto del carrito cuando se hace click en el boton de quitar y actualiza el contenido del selector
            minus.addEventListener("click", () => { 
                selector.stepDown(1);
                selector.value = cargarCarrito(product.id,selector.valueAsNumber);
                selector.valueAsNumber === 0 && figure.classList.remove("in-cart");
                updateTotalButton();
            });
            // Actualiza la class de la figura para que se no muestre el border de color verde
            selector.valueAsNumber === 0 && figure.classList.remove("in-cart");
        
            // Cargo la imagen del producto en el html
            img.src = product.image;
            product.available == 0 && figure.classList.add("out-of-stock");

            price.innerHTML = `${product.price.toLocaleString('es-AR',{style: "currency", currency: "ARS"})} - ${product.rating.toLocaleString('en-US', {minimumFractionDigits: 1})} &starf;`;
            name.innerHTML = product.title;

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

/**
 * Realiza la compra de todos los productos del carrito
 */
function comprar() {
    // Si el carrito esta vacio, muestro un mensaje al usuario
    if (carrito.length === 0) {
        Toastify({
            text: "No hay productos en el carrito",
            duration: 3000,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#f44336",
                fontSize: "1.2rem",
                fontWeight: "bold",
                textAlign: "center",
            }
        }).showToast();
        return;
    }
        

    for (const item of carrito) {
        if (item.producto.disponible(item.cantidad)) {
            item.producto.buy(item.cantidad);
        } else {
            Toastify({
                text: `El producto ${item.producto.nombre} no tiene suficientes unidades`,
                duration: 3000,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "#f44336",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textAlign: "center",
                }
            }).showToast();
            return;
        }
    }

    clearCarrito();
    filterProducts();
    updateTotalButton();
    let carritoContainer = document.querySelector("#carrito-container");
    !carritoContainer.classList.contains("hidden") && toggleCarrito();
    Toastify({
        text: "Compra realizada con exito!",
        duration: 3000,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: "#d7e56c",
            color: "black",
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "center",
        }
    }).showToast();
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
        producto: productos.find(producto => producto.id == id)
    };

    // Busco el producto en el carrito para ver si ya existe
    let found = carrito.find(item => item.producto.id === seleccion.producto.id);

    // Si la cantidad es 0, quiere decir que se quiere quitar el producto del carrito
    if (found && cantidad <= 0) {
        carrito.splice(carrito.indexOf(found), 1);
        updateTotalButton();
        return 0;
    }

    // Si la cantidad que se quiere comprar es mayor a la cantidad disponible, muestro un mensaje de error (esto tambien quedo deprecado)
    if (cantidad > seleccion.producto.available) {
        Toastify ({
            text: `El producto "${seleccion.producto.title}" ya no tiene suficientes unidades`,
            duration: 3000,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#f44336",
                fontSize: "1.2rem",
                fontWeight: "bold",
                textAlign: "center",
            }
        }).showToast()
        if (found) {
            return found.cantidad;
        } else {
            return 0;
        }
    }
    
    // Si el producto ya existe en el carrito, solo actualizo la cantidad
    if (found) {
        if (productos.find(item => item.id === id).available >= cantidad) {
            found.cantidad = cantidad;
        } else {
            Toastify ({
                text: `No puedes cargar más de ${seleccion.producto.available} unidades de ${seleccion.producto.title}.\nYa tienes ${found.cantidad}`,
                duration: 3000,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "#f44336",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textAlign: "center",
                }
            }).showToast()
            if (found) {
                return found.cantidad;
            } else {
                return 0;
            }
        }
    } else {
        // Si el producto no existe en el carrito, lo agrego
        cantidad > 0 && carrito.push(seleccion);
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
        total += item.producto.price * item.cantidad;
    }
    
    // Muestro el precio total en el boton de carrito si hay productos en el carrito
    if (total > 0) {
        carritoButtonText.innerHTML = `Total: ${total.toLocaleString('es-AR',{style: "currency", currency: "ARS"})}`;
        carritoButtonText.classList.remove("hidden-text");
    }
    
    // Si el carrito esta vacio, oculto el boton
    if (total === 0 || carrito.length === 0) {
        carritoButtonText.classList.add("hidden-text");
    }
    
}

/**
 * Agrega o quita la clase "hidden" del boton de total
 */
function toggleTotalButton() {
    totalButton.classList.toggle("hidden");
    updateTotalButton();
}

/**
 * Actualiza la lista de productos que se muestra en la pantalla del carrito
 */
function updateCarrito() {
    // Actualizo el contenido del carrito
    let carritoBody = document.querySelector("#carrito-body");
    carritoBody.innerHTML = "";
    for (const item of carrito) {
        let carritoItem = document.createElement("figure");
        carritoItem.className = "carrito-product";
        carritoItem.innerHTML = `
            <div class="carrito-product-image">
                <img class="carrito-product-image" src="${item.producto.image}" alt="${item.producto.title}">
                <h4>${item.producto.title}</h4>
            </div>
            <figcaption class="carrito-product-info">
                <p>Cantidad: ${item.cantidad}</p>
                <p>${(item.producto.price * item.cantidad).toLocaleString('es-AR',{style: "currency", currency: "ARS"})}</p>
            </figcaption>
        `;
        carritoBody.appendChild(carritoItem);
    }
    carrito.length === 0 && (carritoBody.innerHTML = `<p>No hay productos en el carrito</p>`);
}

/**
 * Agrega o quita la clase "hidden" del carrito y el boton de total
 */
function toggleCarrito() {
    updateCarrito();
    toggleTotalButton();
    let carritoContainer = document.querySelector("#carrito-container");
    carritoContainer.classList.toggle("hidden");
    !carritoContainer.classList.contains("hidden") ? body.style.overflow = "hidden" : body.style.overflow = "auto";
}

/**
 * Guarda el carrito en localStorage
 */
function saveCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

/**
 * Busca el carrito en el localStorage y lo carga en el carrito
 */
function loadCarrito() {
    let savedCarrito = localStorage.getItem("carrito") || "[]";
    if (savedCarrito !== "[]") {
        for (const item of JSON.parse(savedCarrito)) {
            cargarCarrito(item.id, item.cantidad);
        }
    }
    updateCarrito();
    filterProducts();
}

/**
 * Borra el carrito y actualiza todas las interfaces relacionadas
 */
function clearCarrito() {
    carrito = [];
    updateCarrito();
    updateTotalButton();
    filterProducts();
}

/**
 * Trae la lista de categorias de la API y las muestra en el menu de categorias
 */
async function getCategories() {
    let categories = await fetch("https://fakestoreapi.com/products/categories");
    categories = await categories.json();
    for (const category of categories) {
        let option = document.createElement("option");
        option.value = category;
        option.innerHTML = category;
        categorySelector.appendChild(option);
    }

}

getCategories();

/**
 * Toma los valores de los selectores de categoria y rating y filtra los productos disponibles, luego llama a la funcion 'loadProducts()' para actualizar el contenido de la pagina con los productos filtrados
 */
function filterProducts() {
    let filteredProducts = productos;
    let category = categorySelector.value;
    let rating = ratingSelector.value;

    category === "1" && (filteredProducts = productos);
    if (category !== "" && category !== "1") {
        filteredProducts = filteredProducts.filter(product => product.category == category);
    }
    if (rating !== "") {
        filteredProducts = filteredProducts.filter(product => product.rating >= rating);
    }

    loadProducts(filteredProducts);
}
 function saveEmail() {
    let email = subscribeEmail.value;
    email != '' && localStorage.setItem("user_email", email);
    console.log(email)
 }