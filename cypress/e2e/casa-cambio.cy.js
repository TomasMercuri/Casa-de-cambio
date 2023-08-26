/// <reference types="cypress"/>

const URL_CASA_DE_CAMBIO = 'https://tomasmercuri.github.io/Casa-de-cambio/';

context('Casa de Cambio', () => {
    beforeEach(()=>{
        cy.visit(URL_CASA_DE_CAMBIO);
    });

    describe('Opciones', () => {

        it('Se asegura que esten las opciones en los elementos "select".', () => {
            asegurarCantidadOpciones('monedaParaConvertir');
            asegurarCantidadOpciones('monedaAConvertir');
            asegurarCantidadOpciones('listaMonedas');
        });

        it('Se asegura que el primer elemento select este seleccionado la opcion de "ARS".', () => {
            asegurarOpcionSeleccionada('monedaParaConvertir', 'ARS');
        });

        it('Se asegura que el segundo elemento select este seleccionado la opcion de "USD".', () => {
            asegurarOpcionSeleccionada('monedaAConvertir', 'USD');
        });

        it('Se asegura que el tercer elemento select este seleccionado la opcion de "EUR".', () => {
            asegurarOpcionSeleccionada('listaMonedas', 'EUR');
        });

        it('Se asegura que se pueda cambiar de opcion.', () => {
            seleccionarMoneda('monedaParaConvertir', 'BTC');
            asegurarOpcionSeleccionada('monedaParaConvertir', 'BTC');
        });

        it('Se asegura que se pueda cambiar de fecha.', () => { 
            modificarFechaDeCambio('2020-08-10');
        });

    });


});


function seleccionarMoneda(nombreSelector, moneda){
    cy.get(`select[name=${nombreSelector}]`, { timeout: 10000 }).select(moneda);
}

function asegurarCantidadOpciones(nombreSelector) {
    cy.get(`select[name="${nombreSelector}"]`, { timeout: 10000 }).find('option').should('have.length.greaterThan', 150);
}

function asegurarOpcionSeleccionada(nombreSelector, moneda) {
    cy.get(`select[name=${nombreSelector}] option[value="${moneda}"]`).should('be.selected');
}

function modificarFechaDeCambio(fecha){
    cy.get('input#fecha-cambio').type(fecha).should('have.value', fecha);
}