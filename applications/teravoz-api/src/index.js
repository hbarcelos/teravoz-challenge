import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/repeat'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeAll'
import cuid from 'cuid'
import faker from 'faker'
import availablePhoneNumbers from '../fixtures/phone-numbers.json'
import { delay, randomTimeout } from './synthetic-delay'
import CallEvent, { type as callEventType } from './events/call'
import ActorEvent, { type as actorEventType } from './events/actor'

const callEventPartial = ({ call_id, their_number }) => ({ type, ...rest }) =>
  CallEvent({
    type,
    call_id,
    their_number,
    ...rest
  })

const actorEventPartial = ({ actor, call_id }) => ({ type, ...rest }) =>
  ActorEvent({
    type,
    call_id,
    actor,
    ...rest
  })

const createEventSequence = delayFactor =>
  Observable.create(async observer => {
    const callId = cuid()
    const theirNumber = faker.random.arrayElement(availablePhoneNumbers)
    const actor = faker.internet.email()

    const createCallEventFromSequence = callEventPartial({
      call_id: callId,
      their_number: theirNumber
    })

    const createActorEventFromSequence = actorEventPartial({
      call_id: callId,
      actor: actor
    })

    observer.next(
      await delay(randomTimeout(delayFactor * 100), () =>
        createCallEventFromSequence({
          type: callEventType.NEW
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 500), () =>
        createCallEventFromSequence({
          type: callEventType.STANDBY
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 1000), () =>
        createCallEventFromSequence({
          type: callEventType.WAITING
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 100), () =>
        createCallEventFromSequence({
          type: actorEventType.ENTERED
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 50), () =>
        createActorEventFromSequence({
          type: callEventType.ONGOING
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 5000), () =>
        createActorEventFromSequence({
          type: actorEventType.LEFT
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 500), () =>
        createCallEventFromSequence({
          type: callEventType.FINISHED
        })
      )
    )
    observer.complete()
  })

const interval$ = Observable.of('')
  .switchMap(() => Observable.timer(randomTimeout(5000)))
  .repeat()

const getDelayFactor = () => randomTimeout(10)

interval$
  // .map(x => {
  //   console.log(x);
  //   return Observable.of(x);
  // })
  .map(() => createEventSequence(getDelayFactor()))
  .mergeAll()
  .subscribe(x => console.log(x))
