import React from 'react';
import styled from 'styled-components';
import posed from 'react-pose';

import { fadeIn } from '@/style/popmotion-animations';
import Text from '@/components/text';

const PosedRoot = posed.div({
  visible: fadeIn(true),
  hidden: fadeIn(false),
});
const Root = styled(PosedRoot).attrs(p => ({
  initialPose: 'hidden',
  pose: p.visible ? 'visible' : 'hidden',
}))`
  position: fixed;
  top: 0;
  left: 0;
  height: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  /* transition: all 300ms ease; */
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextContent = styled(Text)`
  text-align: center;
  color: white;
  font-size: 3rem;
`;

export default function RightAnswerMask({ visible, right }) {
  return (
    <Root visible={visible}>
      <TextContent>
        {right ? (
          <>
            <p>回答正确</p>
            <p>即将进入下一题</p>
          </>
        ) : (
          <>
            <p>回答错误</p>
            <p>即将查看答案解析</p>
          </>
        )}
      </TextContent>
    </Root>
  );
}
