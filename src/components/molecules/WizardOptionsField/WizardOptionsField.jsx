import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Switch, TextInput, PropertiesTable, Dropdown } from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import LabelDictionary from '../../../utils/LabelDictionary'

const getDirection = props => {
  if (props.type === 'strict-boolean' || props.type === 'boolean') {
    return 'row'
  }

  return 'column'
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: ${props => getDirection(props)};
  ${props => getDirection(props) === 'row' ? '' : 'justify-content: center;'}
`
const Label = styled.div`
  font-weight: ${StyleProps.fontWeights.medium};
  ${props => getDirection(props) === 'column' ? 'margin-bottom: 8px;' : ''}
`

class WizardOptionsField extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    valueCallback: PropTypes.func,
    className: PropTypes.string,
    properties: PropTypes.array,
    enum: PropTypes.array,
    required: PropTypes.bool,
  }

  renderSwitch({ triState }) {
    return (
      <Switch
        triState={triState}
        checked={this.props.value}
        onChange={checked => { this.props.onChange(checked) }}
        style={{ marginTop: '-8px' }}
        leftLabel
      />
    )
  }

  renderTextInput() {
    return (
      <TextInput
        width="320px"
        required={this.props.required}
        value={this.props.value}
        onChange={e => { this.props.onChange(e.target.value) }}
        placeholder={LabelDictionary.get(this.props.name)}
      />
    )
  }

  renderObjectTable() {
    if (!this.props.properties) {
      return null
    }

    return (
      <PropertiesTable
        properties={this.props.properties}
        valueCallback={this.props.valueCallback}
        onChange={this.props.onChange}
      />
    )
  }

  renderEnumDropdown() {
    let items = this.props.enum.map(e => {
      return {
        label: LabelDictionary.get(e),
        value: e,
      }
    })

    items = [
      { label: 'Choose a value', value: null },
      ...items,
    ]

    return (
      <Dropdown
        width={320}
        noSelectionMessage="Choose a value"
        selectedItem={items.find(i => i.value === this.props.value).label}
        items={items}
        onChange={item => this.props.onChange(item.value)}
      />
    )
  }

  renderField() {
    let field = null
    switch (this.props.type) {
      case 'strict-boolean':
        field = this.renderSwitch({ triState: false })
        break
      case 'boolean':
        field = this.renderSwitch({ triState: true })
        break
      case 'string':
        if (this.props.enum) {
          field = this.renderEnumDropdown()
        } else {
          field = this.renderTextInput()
        }
        break
      case 'object':
        field = this.renderObjectTable()
        break
      default:
    }

    return field
  }

  renderLabel() {
    return <Label>{LabelDictionary.get(this.props.name)}</Label>
  }

  render() {
    let field = this.renderField()

    if (!field) {
      return null
    }

    return (
      <Wrapper type={this.props.type} className={this.props.className}>
        {this.renderLabel()}
        {field}
      </Wrapper>
    )
  }
}

export default WizardOptionsField
