/* eslint-disable no-underscore-dangle, no-undef, security/detect-object-injection */
import color from 'onecolor';
import gradient, {type GradientObject} from 'webskit-gradient-parser';

/**
 * Tests if an element is of an specific type.
 *
 * @param chai The chai object.
 */
const hasDarkColor = (chai: Chai.ChaiStatic) => {
    /**
     * Asserts for an specific html tagName.
     */
    function assertRbaColor(this: Chai.AssertionStatic) {
        // eslint-disable-next-line no-underscore-dangle
        const [r, g, b] = (this._obj as string).replace('rgb(', '').replace(')', '').split(',');

        // eslint-disable-next-line @nfq/no-magic-numbers
        const luma = 0.2126 * parseInt(r, 10) + 0.7152 * parseInt(g, 10) + 0.0722 * parseInt(b, 10);

        this.assert(
            // eslint-disable-next-line @nfq/no-magic-numbers
            (luma < 131),
            'expected #{this} to be an dark color',
            'expected #{this} not to be an dark color',
            // eslint-disable-next-line no-invalid-this, no-underscore-dangle
            this._obj
        );
    }

    chai.Assertion.addMethod('dark', assertRbaColor);
};

/**
 * Tests if an element is of an specific type.
 *
 * @param chai The chai object.
 */
const hasDarkerColor = (chai: Chai.ChaiStatic) => {
    /**
     * Asserts for an specific html tagName.
     *
     * @param otherColor Options given to the command.
     */
    function assertRbaColor(this: Chai.AssertionStatic, otherColor: string) {
        // eslint-disable-next-line no-underscore-dangle
        const [r, g, b] = (this._obj as string).replace('rgb(', '').replace(')', '').split(',');
        const [or, og, ob] = otherColor.replace('rgb(', '').replace(')', '').split(',');
        // eslint-disable-next-line @nfq/no-magic-numbers
        const luma = 0.2126 * parseInt(r, 10) + 0.7152 * parseInt(g, 10) + 0.0722 * parseInt(b, 10);
        // eslint-disable-next-line @nfq/no-magic-numbers
        const otherLuma = 0.2126 * parseInt(or, 10) + 0.7152 * parseInt(og, 10) + 0.0722 * parseInt(ob, 10);

        this.assert(
            // eslint-disable-next-line @nfq/no-magic-numbers
            (luma < otherLuma),
            `expected #{this} to be an darker color as ${otherColor}`,
            `expected #{this} not to be an darker color as ${otherColor}`,
            // eslint-disable-next-line no-invalid-this, no-underscore-dangle
            this._obj
        );
    }

    chai.Assertion.addMethod('darker', assertRbaColor);
};

/**
 * A Chai assertion utility for checking if two colors are equal.
 * This function adds a custom assertion method `colored` to Chai, allowing tests to verify
 * if a given color matches an expected color, including CSS variables.
 *
 * @param chai The Chai assertion library instance.
 *
 * @example
 * ```tsx
 * chai.use(ColorsEqual);
 * expect('rgb(255, 0, 0)').to.be.colored('rgb(255, 0, 0)'); // Direct color comparison
 * expect('rgb(255, 0, 0)').to.be.colored('var(--primary-color)'); // CSS variable comparison
 * ```
 */
const ColorsEqual = (chai: Chai.ChaiStatic) => {
    /**
     * Asserts that the given color matches an expected color.
     * The comparison supports both direct color values (e.g., `rgb(255, 0, 0)`, `#ff0000`)
     * and CSS variables (`var(--primary-color)`), resolving the actual color from the document.
     *
     * @param this        The Chai assertion context.
     * @param colorString The expected color string, which can be a direct color or a CSS variable.
     *
     * @example
     * ```tsx
     * expect('rgb(0, 128, 0)').to.be.colored('green'); // Direct match
     * expect('rgb(0, 128, 0)').to.be.colored('var(--success-color)'); // Resolving a CSS variable
     * ```
     */
    function assertColors(this: Chai.AssertionStatic, colorString: string) {
        const actual = color(this._obj as string);

        if (colorString.includes('var(')) {
            const colorVar = colorString.replace('var(', '').replace(')', '');

            cy.document().then(doc => {
                // eslint-disable-next-line react-hooks-ssr/react-hooks-global-ssr
                const trueColor = window.getComputedStyle(doc.body).getPropertyValue(colorVar).trim();
                const expected = color(trueColor);

                this.assert(
                    actual ? actual.equals(expected) : false,
                    'expected #{act} to be the same color as #{exp}',
                    'expected #{act} to be a different color than #{exp}',
                    expected ? expected.hex() : undefined,
                    // eslint-disable-next-line promise/always-return
                    actual ? actual.hex() : undefined
                );
            });
        } else {
            const expected = color(colorString);

            this.assert(
                actual ? actual.equals(expected) : false,
                'expected #{act} to be the same color as #{exp}',
                'expected #{act} to be a different color than #{exp}',
                expected ? expected.hex() : undefined,
                actual ? actual.hex() : undefined
            );
        }
    }

    chai.Assertion.addMethod('colored', assertColors);
};

/**
 * A Chai assertion utility for comparing gradients.
 * This function adds a custom assertion method `gradient` to Chai, allowing tests to verify
 * whether the colors in a gradient match the expected colors, including CSS variables.
 *
 * @param chai The Chai assertion library instance.
 *
 * @example
 * ```tsx
 * chai.use(GradientsEqual);
 * expect('linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))').to.be.gradient(['rgb(255, 0, 0)', 'rgb(0, 0, 255)']);
 * expect('linear-gradient(var(--primary-color), var(--secondary-color))').to.be.gradient(['var(--primary-color)', 'var(--secondary-color)']);
 * ```
 */
const GradientsEqual = (chai: Chai.ChaiStatic) => {
    /**
     * Asserts that a given gradient matches an expected set of colors.
     * This assertion supports both direct color values (e.g., `rgb(255, 0, 0)`, `#ff0000`)
     * and CSS variables (`var(--primary-color)`), resolving the actual colors from the document.
     *
     * @param this           The Chai assertion context.
     * @param expectedColors An array of expected color strings, which can be direct colors or CSS variables.
     *
     * @example
     * ```tsx
     * expect('linear-gradient(rgb(0, 255, 0), rgb(0, 0, 255))')
     *     .to.be.gradient(['rgb(0, 255, 0)', 'rgb(0, 0, 255)']);
     *
     * expect('linear-gradient(var(--start-color), var(--end-color))')
     *     .to.be.gradient(['var(--start-color)', 'var(--end-color)']);
     * ```
     */
    function assertGradient(this: Chai.AssertionStatic, expectedColors: string[]) {
        const gradientStops = (JSON.parse(gradient.parse(this._obj as string)) as GradientObject).stops;

        // eslint-disable-next-line react-hooks-ssr/react-hooks-global-ssr
        cy.document().then(doc => {
            const compareArray = [];

            // eslint-disable-next-line promise/always-return
            for (let i = 0; i < gradientStops.length; i++) {
                const actual = color(gradientStops[i][0]);

                if (expectedColors[i].includes('var(')) {
                    const colorVar = expectedColors[i].replace('var(', '').replace(')', '');
                    const trueColor = window.getComputedStyle(doc.body).getPropertyValue(colorVar).trim();
                    const expected = color(trueColor);

                    compareArray.push({
                        actual: (actual) ? actual.hex() : undefined,
                        cond: (actual) ? actual.equals(expected) : false,
                        expected: (expected) ? expected.hex() : undefined
                    });
                } else {
                    const expected = color(expectedColors[i]);

                    compareArray.push({
                        actual: (actual) ? actual.hex() : undefined,
                        cond: (actual) ? actual.equals(expected) : false,
                        expected: (expected) ? expected.hex() : undefined
                    });
                }
            }

            this.assert(
                compareArray.every(({cond}) => cond),
                'expected #{act} to be the same color as #{exp}',
                'expected #{act} to be a different color than #{exp}',
                compareArray.map(({expected}) => expected).join(', '),
                compareArray.map(({actual}) => actual).join(', ')
            );
        });
    }

    chai.Assertion.addMethod('gradient', assertGradient);
};

chai.use(hasDarkColor);
chai.use(hasDarkerColor);
chai.use(ColorsEqual);
chai.use(GradientsEqual);