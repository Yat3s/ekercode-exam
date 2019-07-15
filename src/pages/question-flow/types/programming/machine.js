import { Machine, assign } from 'xstate';
import keyMirror from 'keymirror';

import * as answered from '../shared/machines/answered';

export const Event = keyMirror({
  INPUT: null,
  SUBMIT_ANSWER: null,
  RESET: null,

  ...answered.Event,
});

export const State = keyMirror({
  START: null,
  INPUTTING: null,

  ...answered.State,
});

export const Action = keyMirror({
  UPDATE_ANSWER_FROM_INPUT: null,
  RESET: null,
  SUBMIT_ANSWER: null,
  ...answered.Action,
});

const Guard = keyMirror({
  ...answered.Guard,
});

function getInitialContext() {
  return {
    answer: '',
    referenceAnswer: '',
    answeredStatus: null,
  };
}
export const machine = Machine(
  {
    id: 'essay',
    initial: State.START,
    context: getInitialContext(),
    states: {
      [State.START]: {
        on: {
          [Event.INPUT]: {
            target: State.INPUTTING,
            actions: [Action.UPDATE_ANSWER_FROM_INPUT],
          },
        },
      },
      [State.INPUTTING]: {
        on: {
          [Event.INPUT]: {
            target: State.INPUTTING,
            internal: true,
            actions: [Action.UPDATE_ANSWER_FROM_INPUT],
          },
          [Event.SUBMIT_ANSWER]: {
            target: State.ANSWERED,
          },
        },
      },
      [answered.State.ANSWERED]: answered.createMachineStates(),
    },
    on: {
      [Event.RESET]: {
        target: State.START,
        actions: [Action.RESET],
      },
    },
  },
  {
    actions: {
      [Action.UPDATE_ANSWER_FROM_INPUT]: assign({
        answer: (ctx, event) => {
          return event.payload;
        },
      }),
      [Action.RESET]: assign({ answer: '', answeredStatus: null }),
      [Action.CHECK_ANSWER]: assign((ctx, event) => {
        const correct = isEqualAfterTrimmed(ctx.answer, ctx.referenceAnswer);
        return {
          answeredStatus: correct ? 'right' : 'wrong',
        };
      }),
    },
    guards: {
      [Guard.isAnsweredRight]: (ctx, event) => {
        return ctx.answeredStatus === 'right';
      },
      [Guard.isAnsweredWrong]: (ctx, event) => {
        return ctx.answeredStatus === 'wrong';
      },
    },
  },
);

function isEqualAfterTrimmed(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  if (a.length !== b.length) return false;

  return a.trim() === b.trim();
}
