// function Auto(marca,modelo,anio,puertas){
//     this.marca = marca;
//     this.modelo = modelo;
//     this.anio = anio;
//     this.puertas = puertas;

//     this.hablar = function(){
//         console.log('Hola, soy ' + this.modelo);
//     }
// }


// const auto1 = new Auto('Ford','Mustang','2018','4');
// auto1.hablar();

// const auto2 = new Auto('Chevrolet','Camaro','2019','2');
// auto2.hablar();

// let marcaUser = prompt('Ingrese marca del auto:');
// let modeloUser = prompt('Ingrese modelo del auto:');
// let anioUser = parseInt(prompt('Ingrese año del auto:'));
// let puertasUser = parseInt(prompt('Ingrese cantidad de puertas del auto:'));

// const autoUser = new Auto(marcaUser.toUpperCase(),modeloUser,anioUser,puertasUser);


class Producto {
    constructor(nombre,precio,categoria){
        this.nombre = nombre.toUpperCase();
        this.precio = parseFloat(precio);
        this.categoria = categoria;
        this.vendido = false;
    }
    mostrar(){
        console.log(`Nombre: ${this.nombre}`);
        console.log(`Precio: ${this.precio}`);
        console.log(`Categoria: ${this.categoria}`);
        console.log(`Vendido: ${this.vendido}`);
        console.log('------------------');
    }
    sumarIVA(){
        this.precio = this.precio * 1.21;
    }
    vender(){
        this.vendido = true;
    }
}

const manzana = new Producto('Manzana',250,'Fruta');
manzana.mostrar();
manzana.sumarIVA();
manzana.mostrar();
manzana.vender();
manzana.mostrar();
