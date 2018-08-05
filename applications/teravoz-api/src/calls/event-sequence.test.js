import test from 'ava'
import subject from './event-sequence'

test(`
  It should generate the events in the defined sequence:

    call.new -> call.standby -> call.waiting -> actor.entered -> call.ongoing
      -> actor.left -> call.finished
`, async t => {
  const delayFactor = 0
  const events$ = subject(delayFactor)

  const sequence = []
  await events$.forEach(data => {
    sequence.push(data.type)
  })

  const expected = [
    'call.new',
    'call.standby',
    'call.waiting',
    'actor.entered',
    'call.ongoing',
    'actor.left',
    'call.finished'
  ]

  t.deepEqual(sequence, expected)
})
