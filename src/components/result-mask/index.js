import React from 'react';
import posed from 'react-pose';
import styled, { css } from 'styled-components';
import { variants, is } from 'styled-fns';
import RawIconCheck from 'react-feather/dist/icons/check';
import RawIconCross from 'react-feather/dist/icons/x';

import { fadeIn, springClick, wrongShake } from '@/style/popmotion-animations';

const IconCheck = styled(RawIconCheck).attrs({
  color: '#ffffff',
  size: 40,
})``;
const IconCross = styled(RawIconCross).attrs({
  color: '#ffffff',
  size: 40,
})``;

const PosedMask = posed.div({
  right: { ...springClick() },
  wrong: { ...wrongShake() },
});
const MASK_OPACITY = 0.9;
const maskStatusVariants = variants(
  {
    right: css`
      background-color: rgba(65, 214, 91, ${MASK_OPACITY});
    `,
    wrong: css`
      background-color: rgb(241, 58, 58, ${MASK_OPACITY});
    `,
  },
  'answeredStatus',
);

const Mask = styled(PosedMask)`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
  user-select: none;
  /* transition: 0.3s ease background-color; */
  ${is(p => p.answeredStatus === null)`
    ${IconCheck}, ${IconCross} {
      visibility: hidden;
      opacity: 0;
    }
  `};
  ${maskStatusVariants};
`;

export default function ResultMask({ answeredStatus, ...props }) {
  return (
    <Mask
      pose={answeredStatus ? answeredStatus : null}
      answeredStatus={answeredStatus}
      {...props}
    >
      {answeredStatus === 'right' ? <IconCheck /> : <IconCross />}
    </Mask>
  );
}

ResultMask.defaultProps = {
  answeredStatus: null,
};
