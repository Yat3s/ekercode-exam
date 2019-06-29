import React from 'react';
import styled, { css } from 'styled-components';
import posed from 'react-pose';
import { is } from 'styled-fns';

import RawText from '@/components/text';
import ResultMask from '@/components/result-mask';
import { fadeIn } from '@/style/popmotion-animations';

const Root = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  background-color: white;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.1);

  ${is('dim')`
    opacity: 0.2;
    transition: all 0.3s ease;
  `};
`;

const PosedImage = posed.img({
  initial: {},
  visible: fadeIn(true),
  hidden: fadeIn(false),
});
const Image = styled(PosedImage)`
  user-select: none;
  width: 100%;
`;

const Text = styled(RawText)`
  user-select: none;
  padding: 10px;
`;

export default function CardChoice({
  data: { text, image },
  chosenCurrent,
  chosen,
  onChoose,
  answeredStatus,
  onResultPoseComplete,
}) {
  const handleResultPoseComplete = React.useCallback(() => {
    if (chosenCurrent) {
      onResultPoseComplete();
    }
  }, [chosenCurrent, onResultPoseComplete]);
  return (
    <Root dim={chosen && !chosenCurrent} onClick={onChoose}>
      <Image initialPose="hidden" pose="visible" src={image} />

      {text ? <Text>{text}</Text> : null}

      {chosenCurrent && answeredStatus !== null ? (
        <ResultMask
          // 可以使得刚渲染的元素完成动画过程
          initialPose="initial"
          answeredStatus={answeredStatus}
          onPoseComplete={handleResultPoseComplete}
        />
      ) : null}
    </Root>
  );
}
CardChoice.Root = Root;
CardChoice.Image = Image;
CardChoice.Text = Text;
