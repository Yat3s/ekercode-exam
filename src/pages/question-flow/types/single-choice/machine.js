import { Machine, send, assign } from 'xstate';
import keyMirror from 'keymirror';

import * as answered from '../shared/machines/answered';

export const Event = keyMirror({
  CHOOSE: null,

  SHOWED_QUESTION: null,

  SHOW_OPTIONS: null,
  SHOWED_OPTIONS: null,

  ANSWER: null,

  RESET: null,

  ...answered.Event,
});

export const State = keyMirror({
  START: null,

  SHOW: null,

  SHOW__QUESTION: null,
  SHOW__QUESTION__START: null,
  SHOW__QUESTION__DONE: null,

  SHOW__OPTIONS: null,
  SHOW__OPTIONS__NONE: null,
  SHOW__OPTIONS__START: null,
  SHOW__OPTIONS__DONE: null,

  CHOSEN: null,

  ...answered.State,
});

export const Action = keyMirror({
  CHOOSE: null,
  RESET: null,
  ...answered.Action,
});

const Guard = keyMirror({
  isQuestionShowed: null,
  ...answered.Guard,
});

const showQuestionMachine = Machine({
  id: 'single-choice-show-question',
  initial: State.SHOW__QUESTION__START,
  states: {
    [State.SHOW__QUESTION__START]: {
      on: {
        [Event.SHOWED_QUESTION]: {
          target: State.SHOW__QUESTION__DONE,
        },
      },
    },
    [State.SHOW__QUESTION__DONE]: {},
  },
});

function getInitialContext() {
  return {
    chosen: null,
  };
}
export const machine = Machine(
  {
    id: 'single-choice',
    initial: State.START,
    context: getInitialContext(),
    states: {
      [State.START]: {
        on: {
          [Event.CHOOSE]: {
            target: State.CHOSEN,
            actions: [Action.CHOOSE],
          },
        },
      },
      // 暂时可能不需要将题目的不同部分的动画作为状态机的一部分
      //
      // [State.SHOW]: {
      //   type: 'parallel',
      //   states: {
      //     [State.SHOW__QUESTION]: {
      //       initial: State.SHOW__QUESTION__START,
      //       states: {
      //         [State.SHOW__QUESTION__START]: {
      //           on: {
      //             [Event.SHOWED_QUESTION]: {
      //               target: State.SHOW__QUESTION__DONE,
      //             },
      //           },
      //         },
      //         [State.SHOW__QUESTION__DONE]: {
      //           invoke: {
      //             id: 'auto-show-options-after-question-showed',
      //             src: (ctx, event) => (callback, onEvent) => {
      //               console.group('auto-show-options-after-question-showed');
      //               console.log({ event, ctx });
      //               console.groupEnd();

      //               callback(Event.SHOW_OPTIONS);
      //             },
      //           },
      //         },
      //       },
      //     },
      //     [State.SHOW__OPTIONS]: {
      //       initial: State.SHOW__OPTIONS__NONE,
      //       states: {
      //         [State.SHOW__OPTIONS__NONE]: {
      //           on: {
      //             [Event.SHOW_OPTIONS]: {
      //               target: State.SHOW__OPTIONS__START,
      //             },
      //           },
      //         },
      //         [State.SHOW__OPTIONS__START]: {
      //           on: {
      //             [Event.SHOWED_OPTIONS]: {
      //               target: State.SHOW__OPTIONS__DONE,
      //             },
      //           },
      //         },
      //         [State.SHOW__OPTIONS__DONE]: {},
      //       },
      //       // on: {
      //       //   '': [
      //       //     {
      //       //       target: State.SHOW__OPTIONS__START,
      //       //       cond: Guards.isQuestionShowed,
      //       //     },
      //       //   ],
      //       // },
      //     },
      //   },
      // },
      [State.CHOSEN]: {
        on: {
          [Event.CHOOSE]: {
            actions: [Action.CHOOSE],
          },
          [Event.ANSWER]: {
            target: answered.State.ANSWERED,
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
      [Action.CHOOSE]: assign({
        chosen: (ctx, event) => {
          return event.payload;
        },
      }),
      [Action.RESET]: assign(getInitialContext()),
    },
    guards: {
      [Guard.isQuestionShowed]: (ctx, event) => {},
      [Guard.isAnsweredRight]: (ctx, event) => {
        return ctx.chosen.data.right;
      },
      [Guard.isAnsweredWrong]: (ctx, event) => {
        return !ctx.chosen.data.right;
      },
    },
  },
);

export { answered };
