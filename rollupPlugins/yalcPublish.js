// eslint-disable-next-line security/detect-child-process
import {exec} from 'child_process';

/**
 * Runs yalc publish after rollup build in watch mode.
 *
 * @returns {object} The plugin config.
 */
export default function yalcPublish() {
    let doTheAction = false;

    return {
        /**
         * Start publish.
         */
        async buildEnd() {
            if (doTheAction) {
                // eslint-disable-next-line promise/prefer-await-to-callbacks, node/handle-callback-err, no-console
                exec('yalc push', (err, stdout) => console.log(stdout));
            }
        },

        /**
         * Watches file changes in rolup watch mode.
         */
        watchChange() {
            doTheAction = true;
        }
    };
}