import React from 'react';
import posed from 'react-pose';
import styled from 'styled-components';
import { useMachine } from '@xstate/react';

import Text from '@/components/text';
import { fadeIn, springEnter } from '@/style/popmotion-animations';
import { SlotContent } from '@/components/slot';

import CardChoice from '../../components/card-choice';
import Chooser from '../../components/chooser';
import { SubmitAnswerButton, RestButton } from '../../components/flow';
import * as m from './machine';

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const QuestionTitle = styled(Text)`
  margin-bottom: 1em;
`;

const PosedQuestionImg = posed.img({
  visible: springEnter(true),
  hidden: springEnter(false),
  // visible: fadeIn(true),
  // hidden: fadeIn(false),
});
const QuestionImage = styled(PosedQuestionImg).attrs({
  initialPose: 'hidden',
  pose: 'visible',
})`
  flex: 0 1 auto;
  height: 100%;
`;

const ChoicesContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
`;

const CardChoiceWrapper = styled.div`
  width: 50%;
  padding: 12px;
  display: inline-flex;
  justify-content: center;
`;

export default function QuestionSingleChoice({
  question,
  choices,
  onAnswered,
  onAnsweredFinish,
  onNext,
}) {
  const machine = React.useMemo(() => {
    return m.machine.withConfig({
      actions: {
        [m.Action.ANSWER_FINISH]: onAnsweredFinish || (() => {}),
      },
    });
    // machine 只能创建一次，所以不能因为依赖了 onComplete 就重新创建一次
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [currentState, send] = useMachine(machine, {});
  const answeredStatus = React.useMemo(() => {
    if (currentState.matches(m.State.ANSWERED)) {
      return currentState.context.chosen.data.right ? 'right' : 'wrong';
    }

    return null;
  }, [currentState]);
  const handleChoose = React.useCallback(
    choice => {
      send(m.Event.CHOOSE, { payload: choice });
    },
    [send],
  );
  const handleResultPoseComplete = React.useCallback(() => {
    console.group('handleResultPoseComplete');
    onAnswered(
      currentState.context.chosen && currentState.context.chosen.data.right,
    );
    console.groupEnd();
  }, [currentState.context.chosen, onAnswered]);
  const handleSubmit = React.useCallback(() => {
    send(m.Event.ANSWER);
  }, [send]);

  const { chosen } = currentState.context;

  console.groupCollapsed(
    `SingleChoice.render.machineStateSnapshot: ${JSON.stringify(
      currentState.value,
    )}`,
  );
  console.log(JSON.stringify(currentState, null, 4));
  console.groupEnd();

  return (
    <>
      <SlotContent name="question-flow-submit-button">
        {process.env.NODE_ENV !== 'production' && (
          <div
            style={{
              marginTop: '1em',
              textAlign: 'center',
              color: '#16a085',
              wordBreak: 'break-all',
            }}
          >
            {JSON.stringify(currentState.value)}
          </div>
        )}

        <SubmitAnswerButton onClick={handleSubmit}>提交答案</SubmitAnswerButton>
      </SlotContent>

      <SlotContent name="question-flow-debug-tools">
        <RestButton
          onClick={() => {
            send(m.Event.RESET);
          }}
        />
      </SlotContent>

      <QuestionContainer>
        <QuestionTitle>{question.text}</QuestionTitle>

        {question.images.map((image, index) => {
          return <QuestionImage key={index} src={image} />;
        })}
      </QuestionContainer>

      <ChoicesContainer>
        <Chooser choices={choices} chosen={chosen} onChoose={handleChoose}>
          {enhancedChoice => {
            return (
              <CardChoiceWrapper key={enhancedChoice.index}>
                <CardChoice
                  {...enhancedChoice}
                  answeredStatus={answeredStatus}
                  onResultPoseComplete={handleResultPoseComplete}
                />
              </CardChoiceWrapper>
            );
          }}
        </Chooser>
      </ChoicesContainer>
    </>
  );
}
