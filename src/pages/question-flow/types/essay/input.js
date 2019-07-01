import React from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { springClick, wrongShake } from '@/style/popmotion-animations';

const PosedRoot = posed.div({
  initial: {},
  right: { ...springClick() },
  wrong: { ...wrongShake() },
});
const Root = styled(PosedRoot).attrs(({ answeredStatus }) => ({
  initialPose: 'initial',
  pose: answeredStatus ? answeredStatus : 'initial',
}))``;

function backgroundColor({ answeredStatus }) {
  if (!answeredStatus) return 'rgba(0, 0, 0, 0.1)';

  if (answeredStatus === 'right') {
    return 'green';
  }

  return 'red';
}
const TextareaInput = styled.textarea`
  border: 1px solid ${backgroundColor};
  width: 100%;
  font-size: 1.25rem;
  padding: 1rem;
  border-radius: 4px;
  resize: none;
  font-family: 'Courier New', Courier, monospace;

  &:active,
  &:focus {
    outline: none;
  }
  &[readonly] {
    cursor: default;
  }
`;

export default function Textarea({
  className,
  answeredStatus,
  onResultPoseComplete,
  ...props
}) {
  const handleResultPoseComplete = React.useCallback(() => {
    if (answeredStatus) {
      onResultPoseComplete();
    }
  }, [answeredStatus, onResultPoseComplete]);

  return (
    <Root
      className={className}
      answeredStatus={answeredStatus}
      onPoseComplete={handleResultPoseComplete}
    >
      <TextareaInput answeredStatus={answeredStatus} rows={2} {...props} />
    </Root>
  );
}

Textarea.defaultProps = {
  onResultPoseComplete: () => {},
};
