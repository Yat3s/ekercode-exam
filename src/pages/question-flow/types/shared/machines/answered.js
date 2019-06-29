import { actions } from 'xstate';
import keyMirror from 'keymirror';

export const Event = keyMirror({});

export const State = keyMirror({
  ANSWERED: null,
  ANSWERED__PENDING: null,
  ANSWERED__RIGHT: null,
  ANSWERED__WRONG: null,
  ANSWERED__FINISH: null,
});

export const Action = keyMirror({
  ANSWER_FINISH: null,
  CHECK_ANSWER: null,
});

export const Guard = keyMirror({
  isAnsweredRight: null,
  isAnsweredWrong: null,
});

/**
 * 创建状态机状态，使用的 Machine 需要包含所需要的 context
 */
export function createMachineStates() {
  return {
    initial: State.ANSWERED__PENDING,
    states: {
      [State.ANSWERED__PENDING]: {
        entry: [Action.CHECK_ANSWER],
        on: {
          '': [
            { target: State.ANSWERED__RIGHT, cond: Guard.isAnsweredRight },
            { target: State.ANSWERED__WRONG, cond: Guard.isAnsweredWrong },
          ],
        },
      },
      [State.ANSWERED__RIGHT]: {
        entry: [actions.log((...a) => a, `Entered ${State.ANSWERED__RIGHT}`)],
        after: {
          3000: State.ANSWERED__FINISH,
        },
      },
      [State.ANSWERED__WRONG]: {
        entry: [actions.log((...a) => a, `Entered ${State.ANSWERED__WRONG}`)],
        after: {
          3000: State.ANSWERED__FINISH,
        },
      },
      [State.ANSWERED__FINISH]: {
        entry: [
          actions.log((...a) => a, `Entered ${State.ANSWERED__FINISH}`),
          Action.ANSWER_FINISH,
        ],
        type: 'final',
      },
    },
  };
}
