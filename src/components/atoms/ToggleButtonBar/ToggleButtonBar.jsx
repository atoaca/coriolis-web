import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`
const Item = styled.div`
  width: 112px;
  height: 18px;
  background: ${props => props.selected ? Palette.primary : 'white'};
  color: ${props => props.selected ? 'white' : Palette.primary};
  border: 1px solid ${Palette.primary};
  border-right: 1px solid white;
  text-align: center;
  line-height: 19px;
  text-transform: uppercase;
  font-size: 9px;
  font-weight: ${StyleProps.fontWeights.medium};
  transition: all ${StyleProps.animations.swift};
  cursor: pointer;
  &:first-child {
    border-top-left-radius: ${StyleProps.borderRadius};
    border-bottom-left-radius: ${StyleProps.borderRadius};
    border-right: 1px solid ${Palette.primary};
  }
  &:last-child {
    border-top-right-radius: ${StyleProps.borderRadius};
    border-bottom-right-radius: ${StyleProps.borderRadius};
    border-right: 1px solid ${Palette.primary};
  }
`

class ToggleButtonBar extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    selectedValue: PropTypes.string,
    onChange: PropTypes.func,
  }

  render() {
    return (
      <Wrapper>
        {this.props.items.map(item => {
          return (
            <Item
              key={item.value}
              selected={this.props.selectedValue === item.value}
              onClick={() => { this.props.onChange(item) }}
            >{item.label}</Item>
          )
        })}
      </Wrapper>
    )
  }
}

export default ToggleButtonBar
