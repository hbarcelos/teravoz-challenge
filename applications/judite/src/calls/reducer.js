import events from './events.enum';
import redirect from './actions/redirect';

const actionMap = {
  [events.STANDBY]: redirect
}

export default async function callEventReducer(callEvent) {
  if (actionMap[callEvent.type]) {
    return actionMap[callEvent.type](callEvent)
  }
}
