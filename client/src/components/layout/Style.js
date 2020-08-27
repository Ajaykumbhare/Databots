import styled, { keyframes } from "styled-components";

export const keyFrameExampleOne = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
`;

export const Nav = styled.header`
  box-shadow: rgba(160, 160, 160, 0.11) 0px 3px 5px;
  font: 16px/1.45 "Nunito", sans-serif;
  padding: 10px;
  background: white;
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(-360deg);
  }
`;
