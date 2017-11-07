import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import arrowImage from './images/arrow.js'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const getLabelColor = props => {
  if (props.disabled) {
    return Palette.grayscale[3]
  }

  if (props.primary) {
    return 'white'
  }

  return Palette.black
}
const Label = styled.div`
  color: ${props => getLabelColor(props)};
  margin: 0 32px 0 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${props => props.centered ? 'text-align: center;' : ''}
`

const getBackgroundColor = props => {
  if (props.disabled) {
    return Palette.grayscale[7]
  }

  if (props.primary) {
    return Palette.primary
  }

  return 'white'
}
const getArrowColor = props => {
  if (props.disabled) {
    return Palette.grayscale[0]
  }

  if (props.primary) {
    return 'white'
  }

  return Palette.grayscale[4]
}
const getWidth = props => {
  if (props.large) {
    return StyleProps.inputSizes.large.width - 2
  }
  if (props.width) {
    return props.width - 2
  }
  return StyleProps.inputSizes.regular.width - 2
}
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: ${props => getWidth(props)}px;
  height: ${props => props.large ? StyleProps.inputSizes.large.height - 2
    : StyleProps.inputSizes.regular.height - 2}px;
  border: 1px solid ${props => props.disabled ? Palette.grayscale[7] : Palette.grayscale[3]};
  border-radius: ${StyleProps.borderRadius};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all ${StyleProps.animations.swift};
  background: ${props => getBackgroundColor(props)};

  #dropdown-arrow-image {stroke: ${props => getArrowColor(props)};}
  &:hover {
    #dropdown-arrow-image {stroke: ${props => props.disabled ? '' : 'white'};}
    background: ${props => props.disabled ? '' : Palette.primary};
  }

  &:hover ${Label} {
    color: ${props => props.disabled ? '' : 'white'};
  }
`
const Arrow = styled.div`
  position: absolute;
  right: 8px;
`

const DropdownButton = ({ value, onClick, ...props }) => {
  return (
    <Wrapper onClick={onClick} {...props}>
      <Label {...props}>{value}</Label>
      <Arrow {...props} dangerouslySetInnerHTML={{ __html: arrowImage }} />
    </Wrapper>
  )
}

DropdownButton.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
}

export default DropdownButton
