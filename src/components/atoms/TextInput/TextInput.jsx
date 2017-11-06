import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import starImage from './images/star.svg'

const Wrapper = styled.div`
  position: relative;
`
const getInputWidth = props => {
  if (props.width) {
    return props.width
  }

  if (props.large) {
    return `${StyleProps.inputSizes.large.width}px`
  }

  return `${StyleProps.inputSizes.regular.width}px`
}
const Input = styled.input`
  width: ${props => getInputWidth(props)};
  height: ${StyleProps.inputSizes.regular.height}px;
  border-radius: ${StyleProps.borderRadius};
  background-color: #FFF;
  border: 1px solid ${props => props.highlight ? Palette.alert : Palette.grayscale[3]};
  color: ${Palette.black};
  padding: 0 ${props => props.required ? '29px' : '8px'} 0 16px;
  font-size: inherit;
  transition: all ${StyleProps.animations.swift};
  box-sizing: border-box;
  &:hover {
    border-color: ${Palette.primary};
  }
  &:focus {
    border-color: ${Palette.primary};
    outline: none;
  }
  &:disabled {
    color: ${Palette.grayscale[3]};
    border-color: ${Palette.grayscale[0]};
    background-color: ${Palette.grayscale[0]};
  }
  &::placeholder {
    color: ${Palette.grayscale[3]};
  }
`
const Required = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  right: 12px;
  top: 13px;
  width: 8px;
  height: 8px;
  background: url('${starImage}') center no-repeat;
`

const TextInput = ({ _ref, required, ...props }) => {
  return (
    <Wrapper>
      <Input innerRef={_ref} type="text" required={required} {...props} />
      <Required show={required} />
    </Wrapper>
  )
}

TextInput.propTypes = {
  _ref: PropTypes.func,
  required: PropTypes.bool,
}

export default TextInput
