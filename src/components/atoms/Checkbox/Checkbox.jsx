import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import checkmarkImage from './images/checkmark.svg'

const Wrapper = styled.div`display: flex;`
const InputStyled = styled.input`
  width: 16px;
  height: 16px;
  border: 1px solid ${Palette.grayscale[3]};
  border-radius: 3px;
  background: white;
  appearance: none;
  outline: 0;
  transition: all ${StyleProps.animations.swift};
  position: relative;
  margin: 0;
  cursor: pointer;

  &:after {
    content: ' ';
    position: absolute;
    top: 4px;
    left: 2px;
    width: 10px;
    height: 7px;
    background: url('${checkmarkImage}') no-repeat center;
  }

  &:checked {
    border-color: ${Palette.primary};
    background: ${Palette.primary};
  }
`

class Checkbox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    let { className, ...props } = this.props
    return (
      <Wrapper className={className}>
        <InputStyled {...props} type="checkbox" />
      </Wrapper>
    )
  }
}

export default Checkbox
