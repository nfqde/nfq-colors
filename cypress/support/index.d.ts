/* eslint-disable no-undef */
/// <reference types="cypress" />

import './commands';

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to select DOM element by data-cy attribute.
             *
             * @example cy.getCy('greeting')
             */
            getCy(value: string): Chainable<JQuery>;

            /**
             * Custom command to mount hooks for testing.
             *
             * @example cy.mountHook(useHook);
             */
            mountHook<T extends (...args: any) => any>(hook: T): {component: React.FC; values: ReturnType<T>};
        }

        interface Chainer<Subject> {
            /**
             * Custom Chai assertion that checks if given subject is an specific HTML element.
             *
             * @example
             * ```
             * expect('foo').to.be.an.htmlElement('button)
             * cy.wrap('foo').should('be.an.htmlElement', 'button')
             * ```
             */
            (chainer: 'be.an.htmlElement', value: string): Chainable<Subject>;
            /**
             * Custom Chai assertion that checks if given subject is an specific HTML element.
             *
             * @example
             * ```
             * expect('foo').to.not.be.an.htmlElement('button)
             * cy.wrap('foo').should('not.be.an.htmlElement', 'button')
             * ```
             */
            // eslint-disable-next-line @typescript-eslint/unified-signatures
            (chainer: 'not.be.an.htmlElement', value: string): Chainable<Subject>;
        }
    }
}