import React from 'react';
import posed from 'react-pose';

import { springEnter } from '@/style/popmotion-animations';

const Container = posed.div({
  visible: springEnter(true),
  hidden: springEnter(false),
});

export default function Text({ children, visible, ...props }) {
  return (
    <Container
      initialPose="hidden"
      pose={visible ? 'visible' : 'hidden'}
      {...props}
    >
      {children}
    </Container>
  );
}

Text.defaultProps = {
  visible: true,
};
