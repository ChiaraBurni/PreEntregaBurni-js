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


//precios del JSON 
let PRECIO_LASER, PRECIO_OFFSET;

//Almacenar tarjetas/pedidos
let tarjetas = [];

//contador de entregas/impresiones a realizar
let contadorImpresiones = 0;

//DOM
const form = document.getElementById("form");
const tipoImpresion = document.getElementById("tipoImpresion");
const divTerminacion = document.getElementById("divTerminacion");
const precioTotalElement = document.getElementById('precioTotal');


//formulario en dos pasos
document.addEventListener('DOMContentLoaded', () => {
    const cotizacionSection = document.getElementById('cotizacion');
    const encargoSection = document.getElementById('encargo');

    cotizacionSection.style.display = 'block';
    encargoSection.style.display = 'none';
});

//DOM
const btnSiguiente = document.getElementById('btnSiguiente');
const btnAtras = document.getElementById('btnAtras');
const cotizacionSection = document.getElementById('cotizacion');
const encargoSection = document.getElementById('encargo');

//reset formulario!
function resetForm() {
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('tel').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('tipoImpresion').selectedIndex = 0;
    document.querySelectorAll('input[name="terminacion"]').forEach((radio) => {
        radio.checked = false;
    });
    cotizacionSection.style.display = 'block';
    encargoSection.style.display = 'none';
}

//cargar los precios desde el archivo JSON
fetch('precios.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de precios');
        }
        return response.json();
    })
    .then((data) => {

        PRECIO_LASER = data.precioLaser;
        PRECIO_OFFSET = data.precioOffset;


        // calcular el precio unitario... depende del tipo de impresión y cantidad
        function CalcularPrecioUnitario(tipo, cantidad, precioLaser, precioOffset) {
            let precioUnitario = tipo === 'laser' ? precioLaser : precioOffset;
            if (cantidad >= 1000) {
                precioUnitario *= 0.8; // 20% de descuento para más de 1000 tarjetas
            }
            return precioUnitario;
        }

        //calcular el precio total - calcularpreciototal debe estar definida antes de la clase contructora...
        function CalcularPrecioTotal(tipo, cantidad, precioLaser, precioOffset) {
            return cantidad * CalcularPrecioUnitario(tipo, cantidad, precioLaser, precioOffset);
        }


        //generar numero de pedido, que no se repita
        function generarNumeroPedidoUnico() {
            const pedidosExistentes = tarjetas.map((tarjeta) => tarjeta.numeroPedido);
            let numeroPedido;

            //seguir generando hasta encontrar uno que no se repita
            do {
                numeroPedido = Math.floor(Math.random() * 90000) + 10000;
            } while (pedidosExistentes.includes(numeroPedido));

            return numeroPedido;
        }

        document.getElementById('btnCalcular').addEventListener('click', () => {
            const cantidad = parseInt(document.getElementById('cantidad').value);
            //Evitar cantidades negativas o iguales a 0.
            //uso de libreria sweetalert
            if (isNaN(cantidad) || cantidad <= 0) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Cantidad Inválida. Ingresa una cantidad mayor a 0',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else {
                const tipo = tipoImpresion.value;
                const precioTotal = CalcularPrecioTotal(tipo, cantidad, PRECIO_LASER, PRECIO_OFFSET);

                Swal.fire({
                    title: 'El precio total es:',
                    text: `$${precioTotal}`,
                    confirmButtonText: 'OK'
                });

                // Habilita el botón "Siguiente" y actualiza el precio en el elemento HTML
                document.getElementById('btnSiguiente').disabled = false;
                document.getElementById('precioTotal').innerHTML = `<strong>Precio Total: $${precioTotal}</strong>`;
            }
        });


        btnSiguiente.addEventListener('click', () => {
            //Evitar cantidades negativas o iguales a 0.
            //uso de libreria sweetalert

            const cantidad = parseInt(document.getElementById('cantidad').value);
            if (cantidad <= 0) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Cantidad Invalida. Ingrese una cantidad mayor a 0',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            } else {

                cotizacionSection.style.display = 'none';
                encargoSection.style.display = 'block';
            }

        });

        btnAtras.addEventListener('click', () => {
            cotizacionSection.style.display = 'block';
            encargoSection.style.display = 'none';
        });

        // Llenar formulario y gestionar eventos
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = e.target.querySelector('#nombre').value;
            const email = e.target.querySelector('#email').value;
            const tel = e.target.querySelector('#tel').value;
            const cantidad = parseInt(e.target.querySelector('#cantidad').value);

            //tipo de impresión
            const tipoImpresionSelect = e.target.querySelector('#tipoImpresion');
            const tipoImpresion = tipoImpresionSelect.options[tipoImpresionSelect.selectedIndex].value;

            //terminacion
            const terminacionRadios = document.getElementsByName('terminacion');
            let terminacion = "";
            terminacionRadios.forEach((radio) => {
                if (radio.checked) {
                    terminacion = radio.value;
                }
            });

            //crea nueva tarjeta
            const nuevaTarjeta = new Tarjeta(nombre, email, tel, tipoImpresion, cantidad, terminacion);

            //numero de pedido
            const numeroPedido = generarNumeroPedidoUnico();

            //asigna el numero de pedido
            nuevaTarjeta.numeroPedido = numeroPedido;

            //se agregan al array
            tarjetas.push(nuevaTarjeta);

            // Guardar la lista de tarjetas en el localStorage
            localStorage.setItem('tarjetas', JSON.stringify(tarjetas));

            // Contador de tarjetas
            contadorImpresiones = tarjetas.length;
            const contadorElement = document.getElementById('contadorImpresiones');
            contadorElement.textContent = `Pedidos a realizar: ${contadorImpresiones}`;

            // Muestra numero de pedido

            Swal.fire({
                title: `Tu número de pedido es: ${numeroPedido}`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        {
                            title: 'Pedido exitoso',
                            text: `En breve, nos pondremos en contacto contigo para finalizar el proceso de pago.
                        Ten en cuenta que tu pedido no será procesado hasta que hayamos recibido el importe correspondiente en nuestra cuenta`
                        })
                }
            })


            resetForm();

        });



        // Terminación dependiendo del tipo de impresión
        tipoImpresion.addEventListener("change", () => {
            // Limpiar opciones existentes
            divTerminacion.innerHTML = "";

            if (tipoImpresion.value === "laser") {
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
                    inputRadio.value = opcionTexto;
                    inputRadio.id = opcionTexto;

                    const label = document.createElement("label");
                    label.textContent = opcionTexto;
                    label.setAttribute("for", opcionTexto);

                    divOption.appendChild(inputRadio);
                    divOption.appendChild(label);
                    fieldset.appendChild(divOption);
                });

                divTerminacion.appendChild(fieldset);
            } else if (tipoImpresion.value === "offset") {
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
                    inputRadio.id = opcionTexto;

                    const label = document.createElement("label");
                    label.textContent = opcionTexto;
                    label.setAttribute("for", opcionTexto);

                    divOption.appendChild(inputRadio);
                    divOption.appendChild(label);
                    fieldset.appendChild(divOption);
                });

                divTerminacion.appendChild(fieldset);
            }
        });


        //Buscador de pedidos
        const formSeguimiento = document.getElementById("formSeguimiento");
        const resultadoSeguimiento = document.getElementById("resultadoSeguimiento");

        formSeguimiento.addEventListener('submit', (e) => {
            e.preventDefault();

            const numeroPedidoInput = e.target.querySelector('#numeroPedido');
            const numeroPedidoBuscado = parseInt(numeroPedidoInput.value);

            const tarjetaEncontrada = tarjetas.find(tarjeta => tarjeta.numeroPedido === numeroPedidoBuscado);

            if (tarjetaEncontrada) {
                resultadoSeguimiento.textContent = `Estado del pedido (${numeroPedidoBuscado}): En proceso de impresión`;
            } else {
                resultadoSeguimiento.textContent = `Pedido (${numeroPedidoBuscado}) no encontrado`;
            }

            numeroPedidoInput.value = '';
        });


        // Cargar datos desde localStorage
        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('tarjetas')) {
                tarjetas = JSON.parse(localStorage.getItem('tarjetas'));

                contadorImpresiones = tarjetas.length;
                const contadorElement = document.getElementById('contadorImpresiones');
                contadorElement.textContent = `Pedidos a realizar: ${contadorImpresiones}`;
            }
        });

    })

    //manejo de errores
    .catch(() => {
        Swal.fire({
            text: 'Error al cargar el formulario',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });


