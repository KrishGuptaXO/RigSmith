/**
 * Error hierarchy for the PCPartPicker text-list parser.
 *
 * Each error carries a `statusCode` so the route layer can translate a
 * failure into an appropriate HTTP response without needing to know the
 * internals of the parser.
 */

export class PcPartPickerError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

/** The pasted text is missing, empty, or contains no recognizable component lines. */
export class PcPartPickerInputError extends PcPartPickerError {
    constructor(message) {
        super(message, 400);
    }
}