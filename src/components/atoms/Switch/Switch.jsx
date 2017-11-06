import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  display: flex;
  height: ${StyleProps.inputSizes.regular.height}px;
  align-items: center;
  ${props => props.disabled ? 'opacity: 0.5;' : ''}
`
const InputWrapper = styled.div`
  position: relative;
  width: ${props => props.height * 2}px;
  height: ${props => props.height}px;
  ${props => !props.disabled ? 'cursor: pointer;' : ''};
`
const inputBackground = props => {
  if (props.big) {
    if (props.checked) {
      return Palette.alert
    }
    return Palette.primary
  }

  if (props.secondary && props.checked) {
    return Palette.grayscale[5]
  }

  if (props.checked) {
    return Palette.primary
  }

  return 'white'
}
const getInputBorderColor = props => {
  if (props.big && props.checked) {
    return Palette.alert
  }

  if (props.secondary) {
    return Palette.grayscale[5]
  }

  if (props.triState && props.checked === null) {
    return Palette.grayscale[2]
  }

  return Palette.primary
}
const InputBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all ${StyleProps.animations.swift};
  background: ${props => inputBackground(props)};
  border-radius: 50px;
  border: 1px solid ${props => getInputBorderColor(props)};
`
const getThumbLeft = props => {
  if (props.checked) {
    return props.height - 1
  }

  if (props.triState && props.checked === null) {
    return (props.height / 2) - 1
  }

  return -1
}
const InputThumb = styled.div`
  position: absolute;
  width: ${props => props.height - 2}px;
  height: ${props => props.height - 2}px;
  transition: all ${StyleProps.animations.swift};
  top: -1px;
  left: ${props => getThumbLeft(props)}px;
  background: white;
  border: 1px solid ${props => getInputBorderColor(props)};
  border-radius: 50%;
`
const Label = styled.div`
  margin-left: 16px;
  ${props => props.secondary ? `color: ${Palette.grayscale[4]};` : ''}
  white-space: nowrap;
`
const LeftLabel = styled.div`
  margin-right: 16px;
  color: ${Palette.grayscale[4]};
  white-space: nowrap;
`

class Switch extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    triState: PropTypes.bool,
    leftLabel: PropTypes.bool,
    secondary: PropTypes.bool,
    height: PropTypes.number,
    big: PropTypes.bool,
    checkedLabel: PropTypes.string,
    uncheckedLabel: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    checkedLabel: 'Yes',
    uncheckedLabel: 'No',
    height: 24,
  }

  constructor() {
    super()

    this.state = {
      lastChecked: null,
    }
  }

  getLabel() {
    let label = this.props.checked ? this.props.checkedLabel : this.props.uncheckedLabel
    if (this.props.triState && this.props.checked === null) {
      label = 'Not Set'
    }

    return label
  }

  handleInputChange() {
    if (this.props.disabled) {
      return
    }

    if (this.props.triState) {
      if (this.props.checked === true || this.props.checked === false) {
        this.setState({ lastChecked: this.props.checked })
        this.props.onChange(null)
      } else {
        this.props.onChange(!this.state.lastChecked)
      }
    } else {
      this.props.onChange(!this.props.checked)
    }
  }

  renderInput() {
    return (
      <InputWrapper
        triState={this.props.triState}
        big={this.props.big}
        height={this.props.height}
        secondary={this.props.secondary}
        disabled={this.props.disabled}
        onClick={() => { this.handleInputChange() }}
      >
        <InputBackground
          triState={this.props.triState}
          big={this.props.big}
          checked={this.props.checked}
          height={this.props.height}
          secondary={this.props.secondary}
        >
          <InputThumb
            triState={this.props.triState}
            big={this.props.big}
            checked={this.props.checked}
            height={this.props.height}
            secondary={this.props.secondary}
          />
        </InputBackground>
      </InputWrapper>
    )
  }

  renderLeftLabel() {
    if (!this.props.leftLabel) {
      return null
    }

    return (
      <LeftLabel>{this.getLabel()}</LeftLabel>
    )
  }

  renderRightLabel() {
    if (this.props.big || this.props.leftLabel) {
      return null
    }

    return (
      <Label secondary={this.props.secondary}>{this.getLabel()}</Label>
    )
  }

  render() {
    return (
      <Wrapper disabled={this.props.disabled} style={this.props.style}>
        {this.renderLeftLabel()}
        {this.renderInput()}
        {this.renderRightLabel()}
      </Wrapper>
    )
  }
}

export default Switch
