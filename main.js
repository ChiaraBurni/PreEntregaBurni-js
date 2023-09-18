// función constructora Tarjeta
class Tarjeta {
    constructor(nombre, email, tel, tipo, cantidad, terminacion) {
        this.nombre = nombre;
        this.email = email;
        this.tel = tel;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.terminacion = terminacion;
        this.precioTotal = this.CalcularPrecioTotal();
    }

    //precio se basa en tipo de impresion y cantidad de tarjatas... offset valen el doble que laser/mas de 1000 tienen 20% descuento unitario
    CalcularPrecioUnitario() {
        const PRECIO_LASER = 20;
        const PRECIO_OFFSET = 40;
        let precioUnitario;

        if (this.cantidad) {
            precioUnitario = this.tipoImpresion === 'offset' ? PRECIO_OFFSET : PRECIO_LASER;
            if (this.cantidad >= 1000) {
                precioUnitario *= 0.80; //descuelto unitario por cantidad mayor a 1000 del 20%
            }
        }
        return precioUnitario;
    };

    CalcularPrecioTotal(precioLaser, precioOffset) {
        return this.cantidad * this.CalcularPrecioUnitario(precioLaser, precioOffset);
    }
}

// precios del archivo JSON
let PRECIO_LASER, PRECIO_OFFSET;

// almacenar tarjetas/pedidos
let tarjetas = [];

//contador de entregas/impresiones a realizar
let contadorImpresiones = 0;

//DOM
const form = document.getElementById("form");
const tipoImpresion = document.getElementById("tipoImpresion");
const divTerminacion = document.getElementById("divTerminacion");
const btnBorrar = document.getElementById("btnBorrar");
const precioTotalElement = document.getElementById('precioTotal');


//cargar los precios desde el archivo JSON
fetch('precios.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo de precios');
    }
    return response.json();
  })
  .then((data) => {
    //asignar los precios
    PRECIO_LASER = data.precioLaser;
    PRECIO_OFFSET = data.precioOffset;

//llenar formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = e.target.querySelector('#nombre').value;
    const email = e.target.querySelector('#email').value;
    const tel = e.target.querySelector('#tel').value;
    const cantidad = parseInt(e.target.querySelector('#cantidad').value);

    //valor seleccionado del tipo de impresion
    const tipoImpresionSelect = e.target.querySelector('#tipoImpresion');
    const tipoImpresion = tipoImpresionSelect.options[tipoImpresionSelect.selectedIndex].value;

    //valor de terminacion
    const terminacionRadios = document.getElementsByName('terminacion');
    let terminacion = "";
    terminacionRadios.forEach((radio) => {
        if (radio.checked) {
            terminacion = radio.value;
        }
    });

    //Evitar cantidades negativas o iguales a 0.
    //uso de librerias
    if (cantidad <= 0) {
        Swal.fire({
            title: 'Error!',
            text: 'Cantidad Invalida. Ingrese una cantidad mayor a 0',
            icon: 'error',
            confirmButtonText: 'OK'
        })
        return;
    }


    //objeto con datos ingresados en el formulario
    const nuevaTarjeta = new Tarjeta(nombre, email, tel, tipoImpresion, cantidad, terminacion);

    //se agregan al array
    tarjetas.push(nuevaTarjeta);


    //guarda la lista de tarjetas en el localstorage
    localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

    //contador de tarjetas
    contadorImpresiones = tarjetas.length;
    const contadorElement = document.getElementById('contadorImpresiones');
    contadorElement.textContent = `Pedidos a realizar: ${contadorImpresiones}`;


    document.getElementById('precioTotal').textContent = `Precio Total: $${nuevaTarjeta.precioTotal}`

});


//terminacion dependido tipo de impresion!!
tipoImpresion.addEventListener("change", () => {
    // Limpiar opciones existentes
    divTerminacion.innerHTML = "";

    if (tipoImpresion.value.toLowerCase() === "laser") {
        // Impresión láser: brillante y mate
        const opciones = ["Brillante", "Mate"];

        const fieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.textContent = "Terminación:";
        fieldset.appendChild(legend);

        opciones.forEach((opcionTexto) => {
            const divOption = document.createElement("div");

            const inputRadio = document.createElement("input");
            inputRadio.type = "radio";
            inputRadio.name = "terminacion";
            inputRadio.value = opcionTexto
            inputRadio.id = opcionTexto; // Establece un id único

            const label = document.createElement("label");
            label.textContent = opcionTexto;
            label.setAttribute("for", opcionTexto); // Asocia el label con el input

            divOption.appendChild(inputRadio);
            divOption.appendChild(label);
            fieldset.appendChild(divOption);
        });

        divTerminacion.appendChild(fieldset);
    } else if (tipoImpresion.value.toLowerCase() === "offset") {
        // Impresión offset: brillante, mate, uv brillante, opp mate y opp mate-uv sectprizado
        const opciones = ["Brillante", "Mate", "UV Brillante", "OPP Mate", "OPP Mate + UV Sectorizado"];

        const fieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.textContent = "Terminación:";
        fieldset.appendChild(legend);

        opciones.forEach((opcionTexto) => {
            const divOption = document.createElement("div");

            const inputRadio = document.createElement("input");
            inputRadio.type = "radio";
            inputRadio.name = "terminacion";
            inputRadio.value = opcionTexto;
            inputRadio.id = opcionTexto; // Establece un id único

            const label = document.createElement("label");
            label.textContent = opcionTexto;
            label.setAttribute("for", opcionTexto); // Asocia el label con el input

            divOption.appendChild(inputRadio);
            divOption.appendChild(label);
            fieldset.appendChild(divOption);
        });

        divTerminacion.appendChild(fieldset);
    }
});

// borrar formulario
btnBorrar.addEventListener('click', () => {
    form.reset();
    //borrar precio
    document.getElementById('precioTotal').textContent = `Precio Total: $0`;
    //borrar terminacion
    divTerminacion.innerHTML = "";

});

/// Cargar datos desde localStorage cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tarjetas')) {
        tarjetas = JSON.parse(localStorage.getItem('tarjetas'));
        // Actualiza el contador con la cantidad de tarjetas recuperadas
        contadorImpresiones = tarjetas.length;
        const contadorElement = document.getElementById('contadorImpresiones');
        contadorElement.textContent = `Pedidos a realizar: ${contadorImpresiones}`;
    }
});



});





