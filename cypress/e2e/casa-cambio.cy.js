/// <reference types="cypress"/>

const URL_CASA_DE_CAMBIO = 'https://tomasmercuri.github.io/Casa-de-cambio/';
const FECHA = '2021-08-10';

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
            modificarFechaDeCambio(FECHA);
            cy.get('input#fecha-cambio').should('have.value', FECHA);
        });

    });

    describe('Funcionamiento cambios de moneda', () => {
        it('Se asegura de que la conversion sea correcta (ARS - USD)', () => {
            modificarFechaDeCambio(FECHA);
            asegurarOpcionSeleccionada('monedaParaConvertir', 'ARS');
            asegurarOpcionSeleccionada('monedaAConvertir', 'USD');
            cy.get('input#dinero-usuario').type('100000');
            cy.get('button#convertir').click();
            cy.get('input#dinero-convertido', { timeout: 10000 }).should('have.value', '1030.8');
        });

        it('Se asegura que se puedan invertir las monedas (USD - ARS)', () => {
            modificarFechaDeCambio(FECHA);
            asegurarOpcionSeleccionada('monedaParaConvertir', 'ARS');
            asegurarOpcionSeleccionada('monedaAConvertir', 'USD');
            cy.get('button#invertir-monedas').click();
            asegurarOpcionSeleccionada('monedaParaConvertir', 'USD');
            asegurarOpcionSeleccionada('monedaAConvertir', 'ARS');
        });

        it('Se asegura de que la conversion sea correcta (USD - ARS).', () => {
            modificarFechaDeCambio(FECHA);
            asegurarOpcionSeleccionada('monedaParaConvertir', 'ARS');
            asegurarOpcionSeleccionada('monedaAConvertir', 'USD');
            cy.get('button#invertir-monedas').click();
            cy.get('input#dinero-usuario').type('1');
            cy.get('button#convertir').click();
            cy.get('input#dinero-convertido', { timeout: 10000 }).should('have.value', '97.008282');
        });

        it('Se asegura que al invertir las monedas, no se invierta el texto.', () => {
            asegurarOpcionSeleccionada('monedaParaConvertir', 'ARS');
            asegurarOpcionSeleccionada('monedaAConvertir', 'USD');
            cy.get('input#dinero-usuario').type('100000');
            cy.get('button#invertir-monedas').click();
            asegurarOpcionSeleccionada('monedaParaConvertir', 'USD');
            asegurarOpcionSeleccionada('monedaAConvertir', 'ARS');
            cy.get('input#dinero-convertido', { timeout: 10000 }).should('not.have.value');
        });

        it('Se asegura que al ingresar un valor incorrecto, se muestre un "error".', () => {
            cy.get('input#dinero-usuario').type('-120');
            cy.get('button#convertir').click();
            cy.get('input#dinero-usuario').should('have.class', 'border-danger');
        });

        it('Se asegura que al ingresar un valor correcto, se oculte el "error".', () => {
            cy.get('input#dinero-usuario').type('1');
            cy.get('button#convertir').click();
            cy.get('input#dinero-usuario').should('not.have.class', 'border-danger');
        });

    });


    describe('Listado de monedas', () => {
        it('Se asegura que existan todas las monedas', () => {
            cy.get('ul#listado-monedas').find('li').should('have.length', 169);
        });

        it('Se asegura que la moneda seleccionada aparezca en el listado con el valor de "1".', () => {
            cy.get('ul#listado-monedas').find('li').each(elementoLi => {
                if(elementoLi.text() === 'EUR: 1'){
                    cy.get(elementoLi).should('contain.text', 'EUR: 1');
                }
            });
        });

        it('Se asegura que se pueda cambiar de moneda seleccionada.', () => {
            seleccionarMoneda('listaMonedas', 'ARS');
            cy.get('button#calcular').click();
            asegurarOpcionSeleccionada('listaMonedas', 'ARS');
        });

    });


});


function seleccionarMoneda(nombreSelector, moneda){
    cy.get(`select[name=${nombreSelector}]`, { timeout: 10000 }).select(moneda);
}

function asegurarCantidadOpciones(nombreSelector) {
    cy.get(`select[name="${nombreSelector}"]`, { timeout: 10000 }).find('option').should('have.length', 169);
}

function asegurarOpcionSeleccionada(nombreSelector, moneda) {
    cy.get(`select[name=${nombreSelector}] option[value="${moneda}"]`).should('be.selected');
}

function modificarFechaDeCambio(fecha){
    cy.get('input#fecha-cambio').type(fecha);
}