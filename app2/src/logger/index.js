// @flow

type Stringable = interface {
    toString(): string
}
class StdoutLogger {

    log(...keyvals: Array<Stringable>) {
        console.log(...keyvals)
    }
}

export const logger = new StdoutLogger();