import React from 'react'
import styled from 'styled-components'

import loadingImage from './images/loading.svg'

const Wrapper = styled.div`
  width: 96px;
  height: 96px;
  background: url('${loadingImage}') center no-repeat;
  transform-origin: 48px 48px;
  animation: rotate 1s linear infinite;

  @keyframes rotate {
    0% {transform: rotate(0deg);}
    100% {transform: rotate(360deg);}
  }
`

class LoadingAnimation extends React.Component {
  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default LoadingAnimation
