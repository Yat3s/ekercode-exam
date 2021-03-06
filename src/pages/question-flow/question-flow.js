import React from 'react';
import styled from 'styled-components';
import AV from 'leancloud-storage';

import Preloader from '@/components/preloader';
import Button from '@/components/button';
import { Slot, SlotsProvider } from '@/components/slot';

import { extractImages } from './utils';
import RightAnswerMask from './components/answered-result-mask';
import { QuestionType } from './constants';

const SingleChoice = React.lazy(() => import('./types/single-choice'));
const QuestionEssay = React.lazy(() => import('./types/essay'));
const Programing = React.lazy(() => import('./types/programming'));

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
  position: relative;
  height: 100%;
  flex: 1;
  margin-right: auto;
  padding: 1.25rem;
  overflow: hidden auto;
`;

const AnswerHeader = styled.h1``;

const ActionArea = styled.div`
  flex: 0 0 auto;
  width: 200px;
  padding: 1.25rem;
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
  type: QuestionType.SINGLE_CHOICE,
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
const essayData = {
  type: QuestionType.ESSAY,
  question: {
    text: `
训练师，你知道下面程序运行起来是什么结果吗？
提示：填空题不要加入多余的空格哦！
    `,
    images: ['https://placeimg.com/330/225/animals'],
  },
  referenceAnswer: 'Right Answer',
};
const programingData = {
  type: QuestionType.PROGRAMMING,
  question: {
    text: `现在需要告诉你一个关于input的秘密,input会为所有的输入都穿上一件衣服,那就是引号''变成字符串的格式,(python中,单引号和双引号在字符串中没有区别), 比如输入数字10,接收到的会是'10',这就是为什么直接执行＋1运算报错的原因了. 训练师,现在我给你一件装备,int.可以将仅包含整数的字符串转为整数. 比如 int('10') = 10 现在,快来完成下面的题目吧.请打印一个数字,该数字为输入的十倍`,
    input: `一个数字`,
    output: `一个数字`,
  },
  referenceAnswer: `a = input()
b = a * 10
print(b)`,
  sample: {
    input: '3',
    output: '9',
  },
};

const images =
  [] ||
  [singleChoiceData, essayData].reduce((acc, data) => {
    return [...acc, ...extractImages(data)];
  }, []);

export default function QuestionFlow() {
  const [{ answeredMaskVisible, answeredRight }, setFlowState] = React.useState(
    {
      answeredMaskVisible: false,
      answeredRight: null,
    },
  );
  const handleAnswered = React.useCallback(answeredRight => {
    console.group('QuestionFlow.handleAnswered');
    setFlowState(() => ({ answeredMaskVisible: true, answeredRight }));
    console.groupEnd();
  }, []);
  const handleAnsweredFinish = React.useCallback(() => {
    console.group('QuestionFlow.handleAnsweredFinish');
    setFlowState(() => ({
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

  const flowHandlers = {
    onAnswered: handleAnswered,
    onAnsweredFinish: handleAnsweredFinish,
    onNext: handleNext,
  };

  return (
    <SlotsProvider>
      <Preloader images={images}>
        {() => (
          <Root>
            <AnswerArea>
              <AnswerHeader>闯关</AnswerHeader>

              {/* <SingleChoice
                {...singleChoiceData}
                {...flowHandlers}
              /> */}
              {/* <QuestionEssay {...essayData} {...flowHandlers} /> */}

              <Programing {...programingData} {...flowHandlers} />
            </AnswerArea>

            <ActionArea>
              <NextQuestionButton>下一题</NextQuestionButton>

              <Slot name="question-flow-submit-button" />
              {process.env.NODE_ENV !== 'production' && (
                <div style={{ marginTop: '1rem' }}>
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
