const SELECTOR_BASE = document.querySelector('select[name="monedaParaConvertir"]');
const SELECTOR_CAMBIO = document.querySelector('select[name="monedaAConvertir"]');
const SELECTOR_LISTADO_MONEDAS = document.querySelector('select[name="listaMonedas"]');
const listadoMonedas = document.querySelector('ul#listado-monedas');


function eliminarListadoMonedas(){
    listadoMonedas.innerHTML = '';
}

function mostrarListadoMonedas(datos){
    Object.keys(datos.rates).forEach(moneda => {
        const $li = document.createElement('li');
        $li.textContent = `${moneda}: ${datos.rates[moneda]}`;
        listadoMonedas.appendChild($li);
    });
}

function seleccionarOpcion(nombreSelector, moneda){
    document.querySelector(`select[name="${nombreSelector}"] option[value="${moneda}"]`).setAttribute('selected', "");
}

function deseleccionarOpcion(nombreSelector, moneda){
    document.querySelector(`select[name="${nombreSelector}"] option[value="${moneda}"]`).removeAttribute('selected', "");
}

function invertirTextoDinero(dineroUsuario, dineroConvertido){
    document.querySelector('input#dinero-usuario').value = dineroConvertido;
    document.querySelector('input#dinero-convertido').value = dineroUsuario;
}

fetch("https://api.exchangerate.host/latest")
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        function crearOpciones(selector, monedaSeleccionada){
            Object.keys(respuesta.rates).forEach(moneda => {
                const $opcion = document.createElement('option');
                $opcion.value = moneda;
                $opcion.textContent = moneda;
                if(moneda === monedaSeleccionada) $opcion.setAttribute('selected', "");
                selector.appendChild($opcion);
            })
        }
        crearOpciones(SELECTOR_BASE, "ARS");
        crearOpciones(SELECTOR_CAMBIO, "USD");
        crearOpciones(SELECTOR_LISTADO_MONEDAS, "EUR");
        mostrarListadoMonedas(respuesta);
    })


document.querySelector('button#convertir').addEventListener('click', () => {
    const fechaDeCambio = document.querySelector('input#fecha-cambio').value || 'latest';
    const monedaBase = SELECTOR_BASE.value;
    const monedaCambio = SELECTOR_CAMBIO.value;
    const dineroUsuario = document.querySelector('input#dinero-usuario').value;
    
    if(dineroUsuario !== ""){
        fetch(`https://api.exchangerate.host/${fechaDeCambio}?base=${monedaBase}`)
            .then(respuesta => respuesta.json())
            .then(respuesta => {
                const dineroConvertido = dineroUsuario * respuesta.rates[monedaCambio]; 
                document.querySelector('input#dinero-convertido').value = dineroConvertido;
            })
    }
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


document.querySelector('button#invertir-monedas').addEventListener('click', () => {
    const monedaBase = SELECTOR_BASE.value;
    const monedaCambio = SELECTOR_CAMBIO.value;
    const dineroUsuario = document.querySelector('input#dinero-usuario').value;
    const dineroConvertido = document.querySelector('input#dinero-convertido').value;

    seleccionarOpcion(SELECTOR_BASE.name, monedaCambio);
    deseleccionarOpcion(SELECTOR_BASE.name, monedaBase);
    seleccionarOpcion(SELECTOR_CAMBIO.name, monedaBase);
    deseleccionarOpcion(SELECTOR_CAMBIO.name, monedaCambio);
    if(dineroConvertido)invertirTextoDinero(dineroUsuario, dineroConvertido);
});