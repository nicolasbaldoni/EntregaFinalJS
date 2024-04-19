//Elementos del HTML
const tBody = document.getElementById("t-body")
const tFooter = document.getElementById("t-footer")
const carrito = document.getElementById("carrito")
const btnFinCompra = document.getElementById("btnFinalizarCompra")



const mostrarCarrito = () => {

    //Obtengo la lista de productos almacenada en el localStorage
    const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));

    if ((productosCarrito) && (productosCarrito.length > 0)) {

        tBody.innerHTML = ``
        tFooter.innerHTML = ``
        let precioTotal = 0;

        productosCarrito.forEach(prod => {
            let tr = document.createElement("tr")
            tr.id = "tr-" + prod.id
            let th = document.createElement("th")
            th.scope = "row"
            th.innerHTML = `
            <img src="${prod.urlImg}" alt="${prod.nombre_producto}">
            `
            let td1 = document.createElement("td")
            td1.innerHTML = prod.nombre_producto
            let td2 = document.createElement("td")
            td2.id = "cant-" + prod.id
            td2.innerHTML = prod.cantidad
            let td3 = document.createElement("td")
            let conteinerButton = document.createElement("div")
            conteinerButton.className = "d-grid gap-2 col-6 mx-auto"
            let btnSuma = document.createElement("button")
            btnSuma.id = "btnSuma-" + prod.id
            btnSuma.className = "btn btn-info btn-sm btn-suma"
            btnSuma.innerHTML = `+`
            let btnResta = document.createElement("button")
            btnResta.id = "btnResta-" + prod.id
            btnResta.className = "btn btn-danger btn-sm btn-resta"
            btnResta.innerHTML = `-`
            conteinerButton.append(btnSuma)
            conteinerButton.append(btnResta)
            td3.append(conteinerButton)
            let td4 = document.createElement("td")
            td4.id = "precio-" + prod.id
            td4.innerHTML = `$${prod.cantidad * prod.precio}`
            tr.append(th)
            tr.append(td1)
            tr.append(td2)
            tr.append(td3)
            tr.append(td4)
            tBody.append(tr)

            precioTotal = precioTotal + (prod.cantidad * prod.precio);

        });

        let trFooter = document.createElement("tr")
        let totalFooter = document.createElement("th")
        totalFooter.colSpan = "4"
        totalFooter.innerHTML = "Total"
        let precioTotalFooter = document.createElement("td")
        precioTotalFooter.id = "precioTotal"
        precioTotalFooter.innerHTML = "$" + precioTotal;
        trFooter.append(totalFooter)
        trFooter.append(precioTotalFooter)
        tFooter.append(trFooter)

            //Invoco el metodo para que agregue los eventos a los botones creados
            btnEventListener();

            btnFinCompra.style = "display: block"
    } else {
        btnFinCompra.style = "display: none"
        tBody.innerHTML = `<td colspan="5">No tiene ninguna compra.</td>`
    }

}

carrito.addEventListener("click", (e) => {
    mostrarCarrito()
})

btnFinCompra.addEventListener("click", (e) => {
    Swal.fire({
        title: "<strong>¡Compra realizada con Exito!</strong>",
        icon: "success",
        html: `
          Muchas gracias por su compra.
        `,
        focusConfirm: false
      });
})

const btnEventListener = () => {
    const btnSuma = document.querySelectorAll(".btn-suma")
    const btnResta = document.querySelectorAll(".btn-resta")
    const numeritoCarrito = document.getElementById("numeroCarrito")
    const precioTotal = document.getElementById("precioTotal")

    //Obtengo la lista de productos almacenada en el localStorage
    const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));



    btnSuma.forEach(btn => {

        let index;
        let newCantidad;

        btn.addEventListener("click", (e) => {

            let prodCarrito = productosCarrito.filter(prod => prod.id === btn.id.split("-")[1])
            index = productosCarrito.findIndex(prod => prod.id === prodCarrito[0].id);
            productosCarrito[index].cantidad++;

            newCantidad = productosCarrito[index].cantidad;

            localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));


            numeritoCarrito.innerHTML = parseInt(numeritoCarrito.innerHTML) + 1;

            let cantHTML = document.getElementById("cant-" + productosCarrito[index].id)
            cantHTML.innerHTML = newCantidad

            let precioHTML = document.getElementById("precio-" + productosCarrito[index].id)
            precioHTML.innerHTML = "$" + newCantidad * productosCarrito[index].precio

            precioTotal.innerHTML = "$" + (parseInt(precioTotal.innerHTML.replace("$","0")) + parseInt(productosCarrito[index].precio))
            console.log(productosCarrito[index].precio)
        })

    })

    btnResta.forEach(btn => {

        let index;
        let newCantidad;

        btn.addEventListener("click", (e) => {

            let prodCarrito = productosCarrito.filter(prod => prod.id === btn.id.split("-")[1])
            index = productosCarrito.findIndex(prod => prod.id === prodCarrito[0].id);
            productosCarrito[index].cantidad--;

            newCantidad = productosCarrito[index].cantidad;

            if (newCantidad === 0) {
                productosCarrito.splice(index, 1)
                localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));
                let trHTML = document.getElementById("tr-" + prodCarrito[0].id)
                trHTML.innerHTML = ``
                numeritoCarrito.innerHTML = parseInt(numeritoCarrito.innerHTML) - 1;
                precioTotal.innerHTML = "$" + (parseInt(precioTotal.innerHTML.replace("$","0")) - parseInt(prodCarrito[0].precio))
                if (productosCarrito.length === 0) {
                    trHTML.innerHTML = `<td colspan="4">No tiene ninguna compra.</td>`
                    tFooter.innerHTML = ``
                    btnFinCompra.style = "display: none"
                }
            } else {

                localStorage.setItem("productosCarrito", JSON.stringify(productosCarrito));

                numeritoCarrito.innerHTML = parseInt(numeritoCarrito.innerHTML) - 1;

                let cantHTML = document.getElementById("cant-" + productosCarrito[index].id)
                cantHTML.innerHTML = newCantidad

                let precioHTML = document.getElementById("precio-" + productosCarrito[index].id)
                precioHTML.innerHTML = "$" + newCantidad * productosCarrito[index].precio

                precioTotal.innerHTML = "$" + (parseInt(precioTotal.innerHTML.replace("$","0")) - parseInt(productosCarrito[index].precio))
            }
        })

    })
}

mostrarCarrito()


