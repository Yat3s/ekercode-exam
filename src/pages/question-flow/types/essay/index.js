import React from 'react';
import posed from 'react-pose';
import styled from 'styled-components';
import { useMachine } from '@xstate/react';

import Text from '@/components/text';
import { springEnter } from '@/style/popmotion-animations';
import { SlotContent } from '@/components/slot';

import { SubmitAnswerButton, RestButton } from '../../components/flow';
import RawTextarea from './input';
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
});
const QuestionImage = styled(PosedQuestionImg).attrs({
  initialPose: 'hidden',
  pose: 'visible',
})`
  flex: 0 1 auto;
  height: 100%;
`;

const TextareaContainer = styled.div`
  position: absolute;
  bottom: 1.25rem;
  left: 1.25rem;
  right: 1.25rem;
`;

const Textarea = styled(RawTextarea)``;

export default function QuestionEssay({
  question,
  referenceAnswer,
  onAnswered,
  onAnsweredFinish,
  onNext,
}) {
  const machine = React.useMemo(() => {
    return m.machine
      .withConfig({
        actions: {
          [m.Action.ANSWER_FINISH]: onAnsweredFinish || (() => {}),
        },
      })
      .withContext({
        answer: '',
        answeredStatus: null,
        referenceAnswer,
      });
    // machine 只能创建一次，所以不能因为依赖了 onComplete 就重新创建一次
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [currentState, send] = useMachine(machine, {});
  const handleEssayAnswerChange = React.useCallback(
    e => {
      send(m.Event.INPUT, { payload: e.target.value });
    },
    [send],
  );
  const handleResultPoseComplete = React.useCallback(() => {
    console.group('handleResultPoseComplete');
    onAnswered(currentState.context.answeredStatus === 'right');
    console.groupEnd();
  }, [currentState, onAnswered]);
  const handleSubmit = React.useCallback(() => {
    send(m.Event.SUBMIT_ANSWER);
  }, [send]);

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

      <TextareaContainer>
        <Textarea
          rows={1}
          placeholder="请输入你的答案"
          answeredStatus={currentState.context.answeredStatus}
          readOnly={currentState.matches(m.State.ANSWERED)}
          value={currentState.context.answer}
          onChange={handleEssayAnswerChange}
          onResultPoseComplete={handleResultPoseComplete}
        />
      </TextareaContainer>
    </>
  );
}
