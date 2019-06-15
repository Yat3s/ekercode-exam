import React from 'react';
import styled from 'styled-components';
import AV from 'leancloud-storage';

import Preloader from '@/components/preloader';
import Button from '@/components/button';
import { Slot, SlotsProvider } from '@/components/slot';

import SingleChoice from './types/single-choice';
import { extractImages } from './utils';
import RightAnswerMask from './components/answered-result-mask';

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
`;

const AnswerArea = styled.div`
  flex: 1;
  margin-right: auto;
  padding: 20px;
  overflow: hidden auto;
`;

const AnswerHeader = styled.h1``;

const ActionArea = styled.div`
  flex: 0 0 auto;
  width: 200px;
  padding: 20px;
  border-left: 1px solid #c5c5c5;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
`;

const NextQuestionButton = styled(Button)`
  display: block;
`;

const singleChoiceData = {
  question: {
    text: `
  在源码编辑器中下图中哪一个选项是源码编辑器的积木脚本呢？
  
  说明：积木脚本也可以叫做积木块，在源码编辑器中。
    `,
    images: ['https://placeimg.com/660/450/animals'],
  },
  choices: Array.from({ length: 4 }).map((_, index) => ({
    image: 'https://placeimg.com/330/225/animals',
    text: `${String.fromCharCode(
      'A'.charCodeAt(0) + index,
    )}. Lorem ipsum dolor sit amet consectetur adipisicing elit.`,
    right: index === 2,
  })),
};
const images = [singleChoiceData].reduce((acc, data) => {
  return [...acc, ...extractImages(data)];
}, []);

export default function QuestionFlow() {
  const [
    { answeredMaskVisible, answeredRight },
    setRightMaskVisible,
  ] = React.useState({
    answeredMaskVisible: false,
    answeredRight: null,
  });
  const handleAnswered = React.useCallback(answeredRight => {
    console.group('QuestionFlow.handleAnswered');
    setRightMaskVisible(() => ({ answeredMaskVisible: true, answeredRight }));
    console.groupEnd();
  }, []);
  const handleAnsweredFinish = React.useCallback(() => {
    console.group('QuestionFlow.handleAnsweredFinish');
    setRightMaskVisible(() => ({
      answeredMaskVisible: false,
      answeredRight: null,
    }));
    console.groupEnd();
  }, []);

  const handleNext = React.useCallback(() => {
    console.group('QuestionFlow.handleNext()');
    console.log();
    console.groupEnd();
  }, []);

  return (
    <SlotsProvider>
      <Preloader images={images}>
        {() => (
          <Root>
            <AnswerArea>
              <AnswerHeader>闯关</AnswerHeader>

              <SingleChoice
                {...singleChoiceData}
                onAnswered={handleAnswered}
                onAnsweredFinish={handleAnsweredFinish}
                onNext={handleNext}
              />
            </AnswerArea>

            <ActionArea>
              <NextQuestionButton>下一题</NextQuestionButton>

              <Slot name="question-flow-submit-button" />
              {process.env.NODE_ENV !== 'production' && (
                <div style={{ marginTop: '1em' }}>
                  <Slot name="question-flow-debug-tools" />
                </div>
              )}
            </ActionArea>

            {answeredMaskVisible && (
              <RightAnswerMask
                visible={answeredMaskVisible}
                right={answeredRight}
              />
            )}
          </Root>
        )}
      </Preloader>
    </SlotsProvider>
  );
}
