// @flow

type Stringable = interface {
    toString(): string
}
type Loggable = Stringable | {[Stringable]: Stringable};

class StdoutLogger {

    log(first: Loggable, ...keyvals: Array<Stringable>) {
        keyvals.unshift(first);
        console.log(...keyvals)
    }
}

export const logger = new StdoutLogger();