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
const btnBorrar = document.getElementById("btnBorrar");


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
    
    let precioUnitario;
    
    if (cantidad > 0) {
        precioUnitario = tipoImpresion === 'offset' ? PRECIO_OFFSET: PRECIO_LASER;
    if (cantidad >= 1000) {
        precioUnitario *= 0.80; //descuelto unitario por caantidad mayor a 1000
    }
    } else { //evitar cantidades negativas!!
        precioUnitario = null;
    }
    //calcular precio total
    const precioTotal = cantidad * precioUnitario;

    //objeto con datos ingresados en el formulario
    const nuevaTarjeta = new Tarjeta(nombre, email, tel, tipoImpresion, cantidad, terminacion);

    //se agregan al array
    tarjetas.push(nuevaTarjeta);

    //guarda la lista de tarjetas en el localstorage
    localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

    //mostrar precio total!! quite el .00 del precio
    document.getElementById('precioTotal').textContent = `Precio Total: $${precioTotal}`;
});


//terminacion
const terminacionSelect = document.createElement("select");
terminacionSelect.setAttribute("name", "terminacion");
terminacionSelect.setAttribute("id", "terminacion");
//teminacion label
const labelTerminacion = document.createElement("label");
labelTerminacion.setAttribute("for", "terminacion");
labelTerminacion.textContent = "Terminación:";

tipoImpresion.addEventListener("input", () => {
    //limpiar opciones
    terminacionSelect.innerHTML = "";

    if (tipoImpresion.value === "laser") {
        //impresión láser: brillante y mate
        const opciones = ["Brillante", "Mate"];
        opciones.forEach((opcionTexto) => {
            const opcion = document.createElement("option");
            opcion.textContent = opcionTexto;
            terminacionSelect.appendChild(opcion);
        });

    } else if (tipoImpresion.value === "offset") {
        //impresión offset: brillante, mate, uv brillante, opp mate y opp mate-uv sectprizado
        const opciones = ["Brillante", "Mate", "UV Brillante", "OPP Mate", "OPP Mate + UV Sectorizado"];
        opciones.forEach((opcionTexto) => {
            const opcion = document.createElement("option");
            opcion.textContent = opcionTexto;
            terminacionSelect.appendChild(opcion);
        });
    }
});

divTerminacion.appendChild(labelTerminacion);
divTerminacion.appendChild(terminacionSelect);

// borrar formulario
btnBorrar.addEventListener('click', () => {
    form.reset(); 
    //borrar precio!!
    document.getElementById('precioTotal').textContent = `Precio Total: $0`;
});

// cargar datos desde localStorage cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    
    if (localStorage.getItem('tarjetas')) {
        tarjetas = JSON.parse(localStorage.getItem('tarjetas'));
    }
    console.log(tarjetas)
});
