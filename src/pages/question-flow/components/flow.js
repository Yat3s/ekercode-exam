import React from 'react';
import styled from 'styled-components';

import Button from '@/components/button';

export const SubmitAnswerButton = styled(Button)`
  margin-top: auto;
  display: block;
`;

export const RestButton = styled(Button).attrs({
  children: <>重置（调试）</>,
})``;
