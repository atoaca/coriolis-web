import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import StyleProps from '../../styleUtils/StyleProps'
import coriolisLargeImage from './images/coriolis-large.svg'
import coriolisSmallImage from './images/coriolis-small.svg'

const largeProps = css`
  width: 256px;
  height: 307px;
  background: url('${coriolisLargeImage}') center no-repeat;
`

const smallProps = css`
  width: 245px;
  height: 48px;
  background: url('${coriolisSmallImage}') center no-repeat;
`

const Wrapper = styled.div``
const Coriolis = styled.div`
  ${props => props.small ? smallProps : largeProps}
  ${props => !props.large && !props.small ? StyleProps.media.handheld`
    width: 225px;
    height: 42px;
    background: url('${coriolisSmallImage}') center no-repeat;
  ` : ''}
`

const Logo = ({ className, large, small }) => {
  return (
    <Wrapper className={className}>
      <Coriolis large={large} small={small} />
    </Wrapper>
  )
}

Logo.propTypes = {
  className: PropTypes.string,
  large: PropTypes.bool,
  small: PropTypes.bool,
}

export default Logo
