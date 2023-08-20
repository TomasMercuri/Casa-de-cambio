const SELECTOR_BASE = document.querySelector('select[name="monedaParaConvertir"]');
const SELECTOR_CAMBIO = document.querySelector('select[name="monedaAConvertir"]');
const SELECTOR_LISTADO_MONEDAS = document.querySelector('select[name="listaMonedas"]');
const listadoMonedas = document.querySelector('ul');


function eliminarListadoMonedas(){
    listadoMonedas.innerHTML = '';
}

function mostrarListadoMonedas(datos){
    Object.keys(datos.rates).forEach(moneda => {
        const li = document.createElement('li');
        li.textContent = `${moneda}: ${datos.rates[moneda]}`;
        listadoMonedas.appendChild(li);
    });
}

fetch("https://api.exchangerate.host/latest")
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        function crearOpciones(selector, monedaSeleccionada){
            Object.keys(respuesta.rates).forEach(moneda => {
                const option = document.createElement('option');
                option.value = moneda;
                option.textContent = moneda;
                if(moneda === monedaSeleccionada) option.setAttribute('selected', "");
                selector.appendChild(option);
            })
        }
        crearOpciones(SELECTOR_BASE, "ARS");
        crearOpciones(SELECTOR_CAMBIO, "USD");
        crearOpciones(SELECTOR_LISTADO_MONEDAS, "EUR");
        mostrarListadoMonedas(respuesta);
    })


document.querySelector('button#convertir').addEventListener('click', () => {
    let fechaDeCambio = document.querySelector('input#fecha-cambio').value || 'latest';
    const monedaBase = SELECTOR_BASE.value;
    const monedaCambio = SELECTOR_CAMBIO.value;
    const dineroUsuario = document.querySelector('input#dinero-usuario').value;
    
    fetch(`https://api.exchangerate.host/${fechaDeCambio}?base=${monedaBase}`)
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            const dineroConvertido = dineroUsuario * respuesta.rates[monedaCambio]; 
            document.querySelector('input#dinero-convertido').value = dineroConvertido;
        })
});


document.querySelector('button#calcular').addEventListener('click', () => {
    const monedaListadoBase = SELECTOR_LISTADO_MONEDAS.value;
    fetch(`https://api.exchangerate.host/latest?base=${monedaListadoBase}`)
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            eliminarListadoMonedas();
            mostrarListadoMonedas(respuesta);
        })
});
