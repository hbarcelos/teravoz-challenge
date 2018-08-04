import { Observable } from 'rxjs'
import cuid from 'cuid'
import faker from 'faker'
import availablePhoneNumbers from '../../fixtures/phone-numbers.json'
import { delay, randomTimeout } from '../timer'
// import CallEvent, { type as CallEvent } from '../events/call'
// import ActorEvent, { type as ActorEvent } from '../events/actor'
import { Call as CallEvent, Actor as ActorEvent } from '../events'

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

// createEventSequence :: Int -> Observable _ Object
export default function createEventSequence(delayFactor) {
  return new Observable(async observer => {
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
          type: CallEvent.NEW
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 500), () =>
        createCallEventFromSequence({
          type: CallEvent.STANDBY
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 1000), () =>
        createCallEventFromSequence({
          type: CallEvent.WAITING
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 100), () =>
        createActorEventFromSequence({
          type: ActorEvent.ENTERED
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 50), () =>
        createCallEventFromSequence({
          type: CallEvent.ONGOING
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 5000), () =>
        createActorEventFromSequence({
          type: ActorEvent.LEFT
        })
      )
    )
    observer.next(
      await delay(randomTimeout(delayFactor * 500), () =>
        createCallEventFromSequence({
          type: CallEvent.FINISHED
        })
      )
    )
    observer.complete()
  })
}
