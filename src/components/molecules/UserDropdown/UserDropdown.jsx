import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import userImage from './images/user.svg'

const Wrapper = styled.div`
  position: relative;
`
const Icon = styled.div`
  position: relative;
  cursor: pointer;
  transition: all ${StyleProps.animations.swift};
  width: 32px;
  height: 32px;
  background: url('${userImage}') no-repeat center;

  &:hover {
    opacity: 0.8;
  }
`
const List = styled.div`
  background: ${Palette.grayscale[1]};
  border-radius: ${StyleProps.borderRadius};
  position: absolute;
  right: 0;
  top: 45px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  z-index: 10;
`
const ListItem = styled.div`
  padding: 8px 0;

  &:last-child {
    padding-bottom: 0;
  }
`

const Label = styled.div`
  display: inline-block;
  cursor: pointer;

  &:hover {
    color: ${Palette.primary};
  }
`

const ListHeader = styled.div`
  position: relative;

  &:after {
    content: ' ';
    position: absolute;
    width: 10px;
    height: 10px;
    background: ${Palette.grayscale[1]};
    border: 1px solid ${Palette.grayscale[1]};
    border-color: transparent transparent ${Palette.grayscale[1]} ${Palette.grayscale[1]};
    transform: rotate(135deg);
    right: -6px;
    top: -22px;
    transition: all ${StyleProps.animations.swift};
  }
`
const Username = styled.div`
  font-size: 16px;
`
const Email = styled.div`
  font-size: 10px;
  color: ${Palette.grayscale[4]};
  margin-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${Palette.grayscale[3]};
`

class UserDropdown extends React.Component {
  static propTypes = {
    onItemClick: PropTypes.func,
    user: PropTypes.object,
  }

  constructor() {
    super()

    this.state = {
      showDropdownList: false,
    }

    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handlePageClick, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handlePageClick, false)
  }

  handleItemClick(item) {
    if (this.props.onItemClick) {
      this.props.onItemClick(item)
    }

    this.setState({ showDropdownList: false })
  }

  handlePageClick() {
    if (!this.itemMouseDown) {
      this.setState({ showDropdownList: false })
    }
  }

  handleButtonClick() {
    this.setState({ showDropdownList: !this.state.showDropdownList })
  }

  renderList() {
    if (!this.state.showDropdownList) {
      return null
    }

    let items = [{
      label: 'Profile',
      value: 'profile',
    }, {
      label: 'Sign Out',
      value: 'signout',
    }]
    let list = (
      <List>
        <ListHeader>
          <Username>{this.props.user.name}</Username>
          <Email>{this.props.user.email}</Email>
        </ListHeader>
        {items.map(item => {
          return (
            <ListItem
              key={item.value}
              onMouseDown={() => { this.itemMouseDown = true }}
              onMouseUp={() => { this.itemMouseDown = false }}
            >
              <Label onClick={() => { this.handleItemClick(item) }}>{item.label}</Label>
            </ListItem>
          )
        })}
      </List>
    )

    return list
  }
  render() {
    return (
      <Wrapper>
        <Icon
          onMouseDown={() => { this.itemMouseDown = true }}
          onMouseUp={() => { this.itemMouseDown = false }}
          onClick={() => this.handleButtonClick()}
        />
        {this.renderList()}
      </Wrapper>
    )
  }
}

export default UserDropdown
