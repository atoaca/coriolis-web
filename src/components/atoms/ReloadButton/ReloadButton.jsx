import React from 'react'
import styled from 'styled-components'

import reloadImage from './images/reload.svg'

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  background: url('${reloadImage}') no-repeat center;
  cursor: pointer;
`

class ReloadButton extends React.Component {
  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default ReloadButton
