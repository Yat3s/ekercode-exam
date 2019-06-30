import React from 'react';
import posed from 'react-pose';
import styled from 'styled-components';
import { useMachine } from '@xstate/react';

import { SlotContent } from '@/components/slot';
import { springClick, wrongShake } from '@/style/popmotion-animations';

import { SubmitAnswerButton, RestButton } from '../../components/flow';
import * as m from './machine';
import { useMonacoEditor } from './monaco-editor';

const Root = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 600px;
`;

const QuestionPanel = styled.div`
  width: 40%;
  margin-right: 2rem;
`;

const PosedProgrammingPanel = posed.div({
  initial: {},
  right: { ...springClick() },
  wrong: { ...wrongShake() },
});
const ProgrammingPanel = styled(PosedProgrammingPanel).attrs(
  ({ answeredStatus }) => ({
    initialPose: 'initial',
    pose: answeredStatus ? answeredStatus : 'initial',
  }),
)`
  width: 60%;
`;

const QuestionSection = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 1rem;
  }
`;

const SectionTitle = styled.div`
  font-weight: 500;
  font-size: 1.25rem;
  border-bottom: 2px solid blueviolet;
  line-height: 2;
  margin-bottom: 10px;
`;

const SectionContent = styled.div``;

export default function Programming({
  question,
  referenceAnswer,
  sample,
  onAnswered,
  onAnsweredFinish,
  onNext,
}) {
  const machine = React.useMemo(() => {
    return m.machine
      .withConfig({
        actions: {
          [m.Action.ANSWER_FINISH]: onAnsweredFinish,
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

  const { containerCallbackRef, editorRef, addDisposable } = useMonacoEditor();
  const handleCodeChange = React.useCallback(
    e => {
      const codes = editorRef.current.getValue();
      send(m.Event.INPUT, { payload: codes });
    },
    [editorRef, send],
  );
  React.useEffect(() => {
    if (!editorRef.current) {
      console.warn('editor has not been instantiated');
      return;
    }

    addDisposable(editor => {
      return editor.onDidChangeModelContent(handleCodeChange);
    }, 'onDidChangeModelContent');
  }, [addDisposable, editorRef, handleCodeChange]);

  const handleResultPoseComplete = React.useCallback(() => {
    if (!currentState.context.answeredStatus) {
      console.log('还未提交答案');
      return;
    }

    console.group('handleResultPoseComplete');
    onAnswered(currentState.context.answeredStatus === 'right');
    console.groupEnd();
  }, [currentState, onAnswered]);
  const handleSubmit = React.useCallback(() => {
    send(m.Event.SUBMIT_ANSWER);
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly: true });
    }
  }, [editorRef, send]);

  console.groupCollapsed(
    `Programming.render.machineStateSnapshot: ${JSON.stringify(
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

      <Root>
        <QuestionPanel>
          <QuestionSection>
            <SectionTitle>输入</SectionTitle>

            <SectionContent>{question.input}</SectionContent>
          </QuestionSection>

          <QuestionSection>
            <SectionTitle>输出</SectionTitle>

            <SectionContent>{question.output}</SectionContent>
          </QuestionSection>

          <QuestionSection>
            <SectionTitle>示例</SectionTitle>

            <SectionContent>
              <div>
                <p>输入：</p>
                <p>{sample.input}</p>
              </div>

              <div>
                <p>输出：</p>
                <p>{sample.output}</p>
              </div>
            </SectionContent>
          </QuestionSection>
        </QuestionPanel>

        <ProgrammingPanel
          answeredStatus={currentState.context.answeredStatus}
          onPoseComplete={handleResultPoseComplete}
          ref={containerCallbackRef}
        />
      </Root>
    </>
  );
}

Programming.defaultProps = {
  onAnswered: () => {},
  onAnsweredFinish: () => {},
};
