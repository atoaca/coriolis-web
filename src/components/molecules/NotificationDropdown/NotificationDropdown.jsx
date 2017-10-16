import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import bellImage from './images/bell.svg'
import errorImage from './images/error.svg'
import infoImage from './images/info.svg'
import successImage from './images/success.svg'

const Wrapper = styled.div`
  cursor: pointer;
  position: relative;
  font-size: 14px;
`
const Icon = styled.div`
  position: relative;
  transition: all ${StyleProps.animations.swift};

  &:hover {
    opacity: 0.9;
  }
`
const BellIcon = styled.div`
  width: 32px;
  height: 32px;
  background: url('${bellImage}') no-repeat center;
`
const Badge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: ${Palette.primary};
  border-radius: 50%;
  width: 14px;
  height: 14px;
  text-align: center;
`
const BadgeLabel = styled.div`
  margin-top: 2px;
  font-size: 10px;
  color: white;
  font-weight: ${StyleProps.fontWeights.medium};
`
const List = styled.div`
  cursor: pointer;
  background: ${Palette.grayscale[1]};
  border-radius: ${StyleProps.borderRadius};
  width: 224px;
  position: absolute;
  right: 0;
  top: 45px;
`
const ListItem = styled.div`
  display: flex;
  border-bottom: 1px solid ${Palette.grayscale[0]};
  flex-direction: column;
  padding: 8px;
  transition: all ${StyleProps.animations.swift};

  &:hover {
    background: ${Palette.grayscale[0]};
  }

  &:first-child {
    position: relative;
    border-top-left-radius: ${StyleProps.borderRadius};
    border-top-right-radius: ${StyleProps.borderRadius};

    &:hover:after {
      background: ${Palette.grayscale[0]};
      border-color: transparent transparent ${Palette.grayscale[0]} ${Palette.grayscale[0]};
    }

    &:after {
      content: ' ';
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${Palette.grayscale[1]};
      border: 1px solid ${Palette.grayscale[1]};
      border-color: transparent transparent ${Palette.grayscale[1]} ${Palette.grayscale[1]};
      transform: rotate(135deg);
      right: 10px;
      top: -6px;
      transition: all ${StyleProps.animations.swift};
    }
  }

  &:last-child {
    border-color: transparent;
    border-bottom-left-radius: ${StyleProps.borderRadius};
    border-bottom-right-radius: ${StyleProps.borderRadius};
  }
`
const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
`

const getTypeIcon = props => {
  if (props.success) {
    return successImage
  }
  if (props.error) {
    return errorImage
  }
  return infoImage
}
const TypeIcon = styled.div`
  width: 16px;
  height: 16px;
  background: url('${props => getTypeIcon(props)}') no-repeat center;
  margin-right: 8px;
`
const TitleLabel = styled.div`flex-grow: 1;`
const Time = styled.div`color: ${Palette.grayscale[4]};`
const Description = styled.div``

class NotificationDropdown extends React.Component {
  static propTypes = {
    onItemClick: PropTypes.func,
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
    console.log('notification item clicked', item)
    this.setState({ showDropdownList: false })
  }

  handlePageClick() {
    if (!this.itemMouseDown) {
      this.setState({ showDropdownList: false })
    }
  }

  handleButtonClick() {
    this.setState({ showDropdownList: !this.state.showDropdownList })

    if (this.props.onItemClick) {
      this.props.onItemClick()
    }
  }

  renderList() {
    if (!this.state.showDropdownList) {
      return null
    }

    let items = [{
      title: 'Migration',
      time: '12:53 PM',
      description: 'A full VM migration between two clouds',
      icon: { info: true },
    }, {
      title: 'Replica',
      time: '12:53 PM',
      description: 'Incrementally replicate virtual machines',
      icon: { error: true },
    }, {
      title: 'Endpoint',
      time: '12:53 PM',
      description: 'A conection to a public or private cloud',
      icon: { success: true },
    }]

    let list = (
      <List>
        {items.map(item => {
          return (
            <ListItem
              key={item.title}
              onMouseDown={() => { this.itemMouseDown = true }}
              onMouseUp={() => { this.itemMouseDown = false }}
              onClick={() => { this.handleItemClick(item) }}
            >
              <Title>
                <TypeIcon {...item.icon} />
                <TitleLabel>{item.title}</TitleLabel>
                <Time>{item.time}</Time>
              </Title>
              <Description>{item.description}</Description>
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
        >
          <BellIcon />
          <Badge>
            <BadgeLabel>7</BadgeLabel>
          </Badge>
        </Icon>
        {this.renderList()}
      </Wrapper>
    )
  }
}

export default NotificationDropdown
