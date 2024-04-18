// Url al archivo .json donde se tienen los articulos/productos de la web
let url = "./articulos.json";
let productos; //Para utilizar la lista de productos desde otras funciones sin necesidad de asincronismo.

/* Elementos del html */

const gridContent = document.getElementById("list-productos")
const filtrosMenu = document.querySelectorAll(".dropdown-item")
const allFiltroMenu = document.querySelectorAll(".productos_all")
let allBtnComprar = document.querySelectorAll(".btnCompra")
const numeroCarrito = document.getElementById("numeroCarrito")


/**
 * Funcion que carga los datos del .json y los convierte en datos que pueden ser trabajados desde JS
 * Lanza una excepción si hubo un error en el camino.
 */
const obtenerProductos = async () => {
    try {
        //Realizamos la petición de los datos y esperamos a que se resuelva la promesa con un await
        const respuesta = await fetch(url);

        //Verificamos que la petición sea correcta
        if (!respuesta.ok) {
            //Mensaje de error en caso de no obtener los datos.
            throw new Error('Hubo un problema al obtener los datos: ' + respuesta.status);
        }


        //Siendo la respuesta exitosa, se convierte a json
        const datos = await respuesta.json();

        //Guardo los productos para poder invocarlo desde otras funciones.
        productos = datos;
        //Llamo a cargar productos para mostrarlos en la pagina.
        cargarProductos(datos)
        return datos;
    } catch (error) {
        console.error('Se produjo un error: ', error);
    }
}

function cargarProductos(listaProductos) {

    gridContent.innerHTML = "";

    let gridBoostrap = document.createElement("div")
    gridBoostrap.className = "row row-cols-1 row-cols-md-4 g-4"

    listaProductos.forEach(producto => {
        let col = document.createElement("div")
        col.className = "col"
        let card = document.createElement("div")
        card.className = "card bg-transparent h-100"
        col.setAttribute("data-aos","zoom-in-up")
        card.innerHTML = `
        <img src="${producto.urlImg}" class="card-img-top" alt="${producto.nombre_producto}">
        <div class="card-body text-white">
            <h5 class="card-title">${producto.nombre_producto}</h5>
            <h6 class "card-body">$${producto.precio}</h6>
            <div class="d-grid">
                <button id="${producto.id}" class="btn btnCompra" type="button">Comprar</button>
            </div>
        </div>
        `;
        col.append(card);
        gridBoostrap.append(col);
        gridContent.append(gridBoostrap);
    });

    actualizarBotones();
}

const actualizarNumeroComprasCarrito = () => {
    let cantProductos = 0;
    const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));

    if(productosCarrito){
        productosCarrito.forEach((prod) => {
           cantProductos = cantProductos + prod.cantidad;
        })
    }else{
        cantProductos = 0;
    }

    console.log(cantProductos)
    numeroCarrito.innerHTML = cantProductos;
}

// Inicia y obtiene los productos al iniciar la pagina
obtenerProductos();
actualizarNumeroComprasCarrito();

function actualizarBotones(){
    allBtnComprar = document.querySelectorAll(".btnCompra");
    
    allBtnComprar.forEach(event => {
        event.addEventListener("click", (e) => {
        
            agregarProdCarrito(e);

            //Muestra un Toast para confirmar que el producto se agrego al carrito
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado al carrito.',
                position: 'top-end',
                width: 300,
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: '#27AE60',
                color: 'whitesmoke'
            })
        })
    
    })

}


filtrosMenu.forEach(filtro => {

    filtro.addEventListener("click", (e) => {
        const filtroProductos = productos.filter(producto => producto.etiqueta === e.currentTarget.id)

        cargarProductos(filtroProductos);
    })
})

allFiltroMenu.forEach(filtro => {
    filtro.addEventListener("click", (e) => {
        cargarProductos(productos)
    })
})


const agregarProdCarrito = (e) => {

    let index;
    let cantProductosTotal = 0;
    const prodAgregarCarrito = productos.filter(prod => prod.id === e.currentTarget.id);

    const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));

    if (productosCarrito){
        if(productosCarrito.some(producto => producto.id === prodAgregarCarrito[0].id)) {
          index = productosCarrito.findIndex(prod => prod.id === prodAgregarCarrito[0].id);
          productosCarrito[index].cantidad++;
          localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
        }else{
            prodAgregarCarrito[0].cantidad = 1;
            productosCarrito.push(prodAgregarCarrito[0])
            localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
        }
    }else{
        prodAgregarCarrito[0].cantidad = 1;
        localStorage.setItem("productosCarrito", JSON.stringify(prodAgregarCarrito));
    }

    actualizarNumeroComprasCarrito();
    
}

