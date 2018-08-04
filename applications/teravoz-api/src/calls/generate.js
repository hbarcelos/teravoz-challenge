import { of, timer } from 'rxjs'
import { switchMap, repeat, map, mergeAll } from 'rxjs/operators'
import createEventSequence from './event-sequence'

export default function generateCalls({ interval, durationFactor }) {
  return of('').pipe(
    switchMap(() => timer(0, interval())),
    repeat(),
    map(() => createEventSequence(durationFactor())),
    mergeAll()
  )
}
