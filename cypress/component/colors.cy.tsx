/* eslint-disable promise/prefer-await-to-then, promise/catch-or-return, max-lines-per-function */
import {
    darken,
    lighten,
    translucify
} from '../../src/colorManip';

describe('Test color functions', () => {
    context('Test darken function', () => {
        it('Is a funtion', () => {
            expect(darken, 'darken').to.be.a('function');
        });

        it('Returns a css color-mix function ', () => {
            expect(darken('#0000ff', 50)).to.eq('color-mix(in srgb, #0000ff, black 50%)');
        });

        it('Throws if color is not a string', () => {
            expect(() => darken(0, 50)).to.throw('Color must be of type string');
        });
    });

    context('Test lighten function', () => {
        it('Is a funtion', () => {
            expect(lighten, 'lighten').to.be.a('function');
        });

        it('Returns a css color-mix function ', () => {
            expect(lighten('#0000ff', 50)).to.eq('color-mix(in srgb, #0000ff, white 50%)');
        });

        it('Throws if color is not a string', () => {
            expect(() => lighten(0, 50)).to.throw('Color must be of type string');
        });
    });

    context('Test translucify function', () => {
        it('Is a funtion', () => {
            expect(translucify, 'translucify').to.be.a('function');
        });

        it('Returns a css color-mix function ', () => {
            expect(translucify('#0000ff', 50)).to.eq('color-mix(in srgb, #0000ff 50%, transparent)');
        });

        it('Throws if color is not a string', () => {
            expect(() => translucify(0, 50)).to.throw('Color must be of type string');
        });
    });
});