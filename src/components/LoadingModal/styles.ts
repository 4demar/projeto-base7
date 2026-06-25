import styled from "styled-components";

export const Container = styled.div`
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1090;

  > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sk-rotating-plane {
    align-items: center;
    left: 50%;
    top: 50%;
    width: 60px;
    height: 60px;
    -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
    animation: sk-rotateplane 1.2s infinite ease-in-out;
  }
`;
