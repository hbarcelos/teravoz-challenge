import test from 'ava'
import td from 'testdouble'
import setup, { extensions } from './delegate'

test.beforeEach(t => {
  const repository = td.object(['insert', 'find'])
  const service = td.object(['delegate'])
  const subject = setup({ repository, service })
  const incommingCall = {
    type: 'call.standby',
    their_number: '12345689'
  }

  Object.assign(t.context, { repository, service, subject, incommingCall })
})

test.afterEach.always(() => td.reset())

test(`Should redirct new customer to destinations.NEW`, async t => {
  const { repository, service, subject, incommingCall } = t.context

  td.when(repository.find(incommingCall.their_number)).thenResolve(undefined)

  await subject(incommingCall)

  td.verify(repository.insert({ phoneNumber: incommingCall.their_number }))
  td.verify(service.delegate(incommingCall, extensions.NEW))
  t.pass()
})

test(`Should redirct returning customer to destinations.RETURNING`, async t => {
  const { repository, service, subject, incommingCall } = t.context

  td.when(repository.find(incommingCall.their_number)).thenResolve({
    [incommingCall.their_number]: {}
  })

  await subject(incommingCall)

  td.verify(repository.insert(), { times: 0, ignoreExtraArgs: true })
  td.verify(service.delegate(incommingCall, extensions.RETURNING))
  t.pass()
})
