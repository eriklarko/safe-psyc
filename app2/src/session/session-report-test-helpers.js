// @flow

import moment from 'moment';

// To be used as
//   const timer = new MockedTimeGiver();
//   const report = new SessionReport(timer.getNextTime);
//   ...
//   timer.setNextTime(moment('2000-01-01 00:00:00'));
//   report.startLookingAtQuestion(question);
export class MockedTimeGiver {
    _nextTime: moment$Moment;
    _autoAdv: moment$MomentDuration;

    getNextTime = () => {
        if (this._autoAdv) {
            this.advanceByDuration(this._autoAdv);
        }

        const copy = moment(this._nextTime);
        return copy;
    };

    setNextTime(t: moment$Moment) {
        this._nextTime = t;
    }

    // Moves the next time returned by this object forward by some amount of
    // some unit. Wow, abstract much? If you want to move the next time forward
    // by 5 minutes you call
    //   const timeGiver = new MockedTimeGiver()
    //   timeGiver.setNextTime(moment('2000-01-01 00:00:00'))'
    //   timeGiver.advanceBy(5, 'minutes');
    //   // timeGiver.getNextTime() now returns 2000-01-01 00:05:00
    //
    // If setNextTime hasn't been called before the first call to advanceBy
    // 2000-01-01 00:00:00 is used as the starting point and the time you
    // specify as parameters to advanceBy is added to that.
    advanceBy(amount: number, unit: string) {
        this.advanceByDuration(moment.duration(amount, unit));
    }

    // Same as advanceBy but uses a moment duration as the parameter instead.
    // e.g. timeGiver.advanceByDuration(moment.duration(5, 'minutes'));
    advanceByDuration(d: moment$MomentDuration) {
        if (!this._nextTime) {
            this.setNextTime(moment('2000-01-01 00:00:00'));
        }

        this._nextTime.add(d);
    }

    // Sets a duration to move the current time forward by each time
    // `getNextTime` is called.
    //
    // e.g.
    //   const timeGiver = new MockedTimeGiver()
    //   timeGiver.autoAdvanceBy(5, 'minutes');
    //   const t1 = timeGiver.getNextTime(); // 2000-01-01 00:05:00
    //   const t2 = timeGiver.getNextTime(); // 2000-01-01 00:10:00
    //   const t3 = timeGiver.getNextTime(); // 2000-01-01 00:15:00
    autoAdvanceBy(amount: number, unit: string) {
        this._autoAdv = moment.duration(amount, unit);
    }
}
