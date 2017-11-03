import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import arrowImage from './images/arrow.js'

const getOrientation = props => `
  ${props.orientation === 'left' ? 'transform: rotate(180deg);' : ''}
  ${props.orientation === 'up' ? 'transform: rotate(-90deg);' : ''}
  ${props.orientation === 'down' ? 'transform: rotate(90deg);' : ''}
`

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.useDefaultCursor || props.disabled ? 'default' : 'pointer'};
  opacity: ${props => props.opacity};
  transition: all ${StyleProps.animations.swift};
  ${props => getOrientation(props)}
`

class Arrow extends React.Component {
  static propTypes = {
    primary: PropTypes.bool,
    useDefaultCursor: PropTypes.bool,
    orientation: PropTypes.string,
    opacity: PropTypes.number,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    orientation: 'right',
    opacity: 1,
  }

  render() {
    let color = this.props.primary ? Palette.primary : Palette.grayscale[4]
    color = this.props.disabled ? Palette.grayscale[0] : color
    return (
      <Wrapper
        {...this.props}
        dangerouslySetInnerHTML={
          { __html: arrowImage(color) }
        }
      />
    )
  }
}

export default Arrow
