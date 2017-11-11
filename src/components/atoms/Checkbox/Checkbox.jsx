/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
