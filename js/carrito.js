//Elementos del HTML
const tBody = document.getElementById("t-body")
const carrito = document.getElementById("carrito")




const mostrarCarrito = () => {

    //Obtengo la lista de productos almacenada en el localStorage
    const productosCarrito = JSON.parse(localStorage.getItem("productosCarrito"));

    if (productosCarrito) {

        tBody.innerHTML = ``
        console.log("entrooo")

        productosCarrito.forEach(prod => {
            let tr = document.createElement("tr")
            let th = document.createElement("th")
            th.scope = "row"
            th.innerHTML = `
            <img src="${prod.urlImg}" alt="${prod.nombre_producto}">
            `
            let td1 = document.createElement("td")
            td1.innerHTML = prod.nombre_producto
            let td2 = document.createElement("td")
            td2.innerHTML = prod.cantidad
            let td3 = document.createElement("td")
            let btnSuma = document.createElement("button")
            btnSuma.id = prod.id
            btnSuma.className = "btn btn-info btn-sm"
            btnSuma.innerHTML = `+`
            let btnResta = document.createElement("button")
            btnResta.id = prod.id
            btnResta.className = "btn btn-danger btn-sm"
            btnResta.innerHTML = `-`
            td3.append(btnSuma)
            td3.append(btnResta)
            let td4 = document.createElement("td")
            td4.innerHTML = `$${prod.cantidad * prod.precio}`
            tr.append(th)
            tr.append(td1)
            tr.append(td2)
            tr.append(td3)
            tr.append(td4)
            tBody.append(tr)

        });


    }else{
        tBody.innerHTML = `<td colspan="4">No tiene ninguna compra.</td>`
    }

}

carrito.addEventListener("click", (e) => {
    mostrarCarrito()
})

mostrarCarrito()