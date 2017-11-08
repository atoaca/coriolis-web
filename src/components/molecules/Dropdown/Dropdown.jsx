import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { DropdownButton } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  position: relative;
`
const getWidth = props => {
  if (props.large) {
    return StyleProps.inputSizes.large.width - 2
  }

  if (props.width) {
    return props.width - 2
  }

  return StyleProps.inputSizes.regular.width - 2
}
const List = styled.div`
  position: absolute;
  top: 45px;
  background: white;
  cursor: pointer;
  width: ${props => getWidth(props)}px;
  border: 1px solid ${Palette.grayscale[3]};
  border-radius: ${StyleProps.borderRadius};
  z-index: 10;
  max-height: 400px;
  overflow: auto;
`

const ListItem = styled.div`
  position: relative;
  color: ${Palette.grayscale[4]};
  padding: 8px 16px;
  transition: all ${StyleProps.animations.swift};
  ${props => props.selected ? `font-weight: ${StyleProps.fontWeights.medium};` : ''}

  &:first-child {
    border-top-left-radius: ${StyleProps.borderRadius};
    border-top-right-radius: ${StyleProps.borderRadius};

    &:after {
      content: ' ';
      position: absolute;
      width: 10px;
      height: 10px;
      background: white;
      border: 1px solid ${Palette.grayscale[3]};
      border-color: transparent transparent ${Palette.grayscale[3]} ${Palette.grayscale[3]};
      transform: rotate(135deg);
      right: 8px;
      top: -6px;
      transition: all ${StyleProps.animations.swift};
    }

    &:hover:after {
      background: ${Palette.primary};
    }
  }

  &:last-child {
    border-bottom-left-radius: ${StyleProps.borderRadius};
    border-bottom-right-radius: ${StyleProps.borderRadius};
  }

  &:hover {
    background: ${Palette.primary};
    color: white;
  }
`

class Dropdown extends React.Component {
  static propTypes = {
    selectedItem: PropTypes.any,
    items: PropTypes.array,
    labelField: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    noItemsMessage: PropTypes.string,
    noSelectionMessage: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
  }

  static defaultProps = {
    noSelectionMessage: 'Select an item',
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

  getLabel(item) {
    let labelField = this.props.labelField || 'label'

    if (item === null || item === undefined) {
      return this.props.noSelectionMessage
    }

    return (item[labelField] !== null && item[labelField] !== undefined && item[labelField].toString()) || item.toString()
  }

  handlePageClick() {
    if (!this.itemMouseDown) {
      this.setState({ showDropdownList: false })
    }
  }

  handleButtonClick() {
    if (this.props.disabled) {
      return
    }

    this.setState({ showDropdownList: !this.state.showDropdownList })
  }

  handleItemClick(item) {
    this.setState({ showDropdownList: false })

    if (this.props.onChange) {
      this.props.onChange(item)
    }
  }

  renderList() {
    if (!this.props.items || this.props.items.length === 0 || !this.state.showDropdownList) {
      return null
    }

    let selectedLabel = this.getLabel(this.props.selectedItem)
    let list = (
      <List {...this.props}>
        {this.props.items.map((item) => {
          let label = this.getLabel(item)
          let listItem = (
            <ListItem
              key={label}
              onMouseDown={() => { this.itemMouseDown = true }}
              onMouseUp={() => { this.itemMouseDown = false }}
              onClick={() => { this.handleItemClick(item) }}
              selected={label === selectedLabel}
            >{label}
            </ListItem>
          )

          return listItem
        })}
      </List>
    )

    return list
  }

  render() {
    let buttonValue = () => {
      if (this.props.items && this.props.items.length) {
        return this.getLabel(this.props.selectedItem)
      }

      return this.props.noItemsMessage || ''
    }

    return (
      <Wrapper className={this.props.className}>
        <DropdownButton
          {...this.props}
          onMouseDown={() => { this.itemMouseDown = true }}
          onMouseUp={() => { this.itemMouseDown = false }}
          value={buttonValue()}
          onClick={() => this.handleButtonClick()}
        />
        {this.renderList()}
      </Wrapper>
    )
  }
}

export default Dropdown
