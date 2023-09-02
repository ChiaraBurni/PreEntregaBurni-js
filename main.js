// función constructora Tarjeta
class Tarjeta {
    constructor(nombre, email, tel, tipo, cantidad, terminacion) {
        this.nombre = nombre;
        this.email = email;
        this.tel = tel;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.terminacion = terminacion;
    }
}

// almacenar tarjetas/pedidos
let tarjetas = [];

//DOM
const form = document.getElementById("form");
const tipoImpresion = document.getElementById("tipoImpresion");
const divTerminacion = document.getElementById("divTerminacion");


form.addEventListener('submit', (e) => {
    e.preventDefault();// 

    //guardar valores ingresados para calcular el precio
    const nombre = e.target.querySelector('#nombre').value;
    const email = e.target.querySelector('#email').value;
    const tel = e.target.querySelector('#tel').value;
    const cantidad = parseInt(e.target.querySelector('#cantidad').value);
    const tipoImpresion = e.target.querySelector('#tipoImpresion').value;
    const terminacion = e.target.querySelector('#terminacion').value;

    // precio se basa en tipo de impresion y cantidad de tarjatas... offset valen el doble que laser/mas de 1000 tienen 20% descuento unitario
    const PRECIO_LASER = 20;
    const PRECIO_OFFSET = 40; 
    
    let precioUnitario = tipoImpresion === 'offset' ? PRECIO_OFFSET: PRECIO_LASER;
    if (cantidad > 1000) {
        precioUnitario *= 0.80; //descuelto unitario por caantidad mayor a 1000
    }
    const precioTotal = cantidad * precioUnitario;

    //objeto con datos ingresados en el formulario
    const nuevaTarjeta = new Tarjeta(nombre, email, tel, tipoImpresion, cantidad, terminacion);

    //se agregan al array
    tarjetas.push(nuevaTarjeta);

    //guarda la lista de tarjetas en el localstorage
    localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

    //mostrar precio total!!
    document.getElementById('precioTotal').textContent = `Precio Total: $${precioTotal.toFixed(2)}`;
});

// dependiendo tipo de impresion seleccionada, se crean elementos html para seleccionar el tipo de impresion
tipoImpresion.addEventListener("input", () => {

    if (tipoImpresion.value === "laser") {
        // crear elementos para impresión láser
        const divFormGroup = document.createElement("div");
        divFormGroup.classList.add("form-group");

        //label
        const label = document.createElement("label");
        label.setAttribute("for", "terminacion");
        label.textContent = "Terminación:";

        //select
        const select = document.createElement("select");
        select.setAttribute("name", "terminacion");
        select.setAttribute("id", "terminacion");

        // opciones de terminacion
        const opcion1 = document.createElement("option");
        opcion1.setAttribute("value", "br");
        opcion1.textContent = "Brillante";

        const opcion2 = document.createElement("option");
        opcion2.setAttribute("value", "mate");
        opcion2.textContent = "Mate";

        // append al select
        select.appendChild(opcion1);
        select.appendChild(opcion2);

        //se agregan a un div vacio en el html
        divFormGroup.appendChild(label);
        divFormGroup.appendChild(select);

        divTerminacion.appendChild(divFormGroup);

    } else if (tipoImpresion.value === "offset") {
        //terminación para impresión offset
        const divFormGroup = document.createElement("div");
        divFormGroup.classList.add("form-group");

        //label
        const label = document.createElement("label");
        label.setAttribute("for", "terminacion");
        label.textContent = "Terminación:";

        //select
        const select = document.createElement("select");
        select.setAttribute("name", "terminacion");
        select.setAttribute("id", "terminacion");

        //opciones
        const opciones = ["Brillante", "Mate", "UV Brillante", "OPP Mate", "OPP Mate + UV Sectorizado"];

        opciones.forEach((opcionTexto) => {
            const opcion = document.createElement("option");
            opcion.setAttribute("value", opcionTexto.toLowerCase().replace(/\s+/g, '-'));
            opcion.textContent = opcionTexto;
            select.appendChild(opcion);
        });

        // append elementos al div
        divFormGroup.appendChild(label);
        divFormGroup.appendChild(select);
        divTerminacion.appendChild(divFormGroup);
    }

});

// cargar datos desde localStorage cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    
    if (localStorage.getItem('tarjetas')) {
        tarjetas = JSON.parse(localStorage.getItem('tarjetas'));
    }
});
