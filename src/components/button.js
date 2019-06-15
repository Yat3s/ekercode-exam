import React from 'react';
import styled from 'styled-components';

const Root = styled.button`
  appearance: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 20px;
  outline: none;
  cursor: pointer;

  &:hover {
    border-color: #1b9cfd;
  }

  &:active {
    background-color: #1b9cfd;
    color: white;
  }
`;

export default function Button({ children, ...props }) {
  return <Root {...props}>{children}</Root>;
}
