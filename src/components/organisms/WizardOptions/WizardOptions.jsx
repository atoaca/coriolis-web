import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { ToggleButtonBar, WizardOptionsField } from 'components'

const Wrapper = styled.div``
const Fields = styled.div`
  margin-top: 46px;
  display: flex;
`
const OneColumn = styled.div``
const Column = styled.div`
  ${props => props.left ? 'margin-right: 160px;' : ''}
`
const WizardOptionsFieldStyled = styled(WizardOptionsField) `
  width: 320px;
  justify-content: space-between;
  margin-bottom: 39px;
`

class WizardOptions extends React.Component {
  static propTypes = {
    fields: PropTypes.array,
    selectedInstances: PropTypes.array,
    data: PropTypes.object,
    onChange: PropTypes.func,
    useAdvancedOptions: PropTypes.bool,
    onAdvancedOptionsToggle: PropTypes.func,
    wizardType: PropTypes.string,
  }

  getFieldValue(fieldName, defaultValue) {
    if (!this.props.data || this.props.data[fieldName] === undefined) {
      return defaultValue
    }

    return this.props.data[fieldName]
  }

  getDefaultFieldsSchema() {
    let fieldsSchema = [
      { name: 'description', type: 'string' },
    ]

    if (this.props.selectedInstances.length > 1) {
      fieldsSchema.unshift({ name: 'separate_vm', type: 'strict-boolean', default: true })
    }

    if (this.props.wizardType === 'replica') {
      fieldsSchema.push({ name: 'execute_now', type: 'strict-boolean', default: true })
      let executeNowValue = this.getFieldValue('execute_now', true)
      if (executeNowValue) {
        fieldsSchema = [
          ...fieldsSchema,
          {
            name: 'execute_now_options',
            type: 'object',
            properties: [
              { name: 'shutdown_instances', type: 'boolean' },
            ],
          },
        ]
      }
    }

    return fieldsSchema
  }

  renderOptionsField(field) {
    if (field.type === 'object' && field.properties) {
      return (
        <WizardOptionsFieldStyled
          key={field.name}
          name={field.name}
          type={field.type}
          valueCallback={f => this.getFieldValue(f.name, f.default)}
          properties={field.properties}
          onChange={(f, value) => { this.props.onChange(f, value) }}
        />
      )
    }
    return (
      <WizardOptionsFieldStyled
        key={field.name}
        name={field.name}
        type={field.type}
        enum={field.enum}
        required={field.required}
        value={this.getFieldValue(field.name, field.default)}
        onChange={value => { this.props.onChange(field, value) }}
      />
    )
  }

  renderOptionsFields() {
    let fieldsSchema = this.getDefaultFieldsSchema()

    fieldsSchema = fieldsSchema.concat(this.props.fields.filter(f => f.required))

    if (this.props.useAdvancedOptions) {
      fieldsSchema = fieldsSchema.concat(this.props.fields.filter(f => !f.required))
    }

    let executeNowColumn
    let fields = fieldsSchema.map((field, i) => {
      let column = i % 2 === 0 ? 'left' : 'right'
      if (field.name === 'execute_now') {
        executeNowColumn = column
      }
      if (field.name === 'execute_now_options') {
        column = executeNowColumn
      }

      return {
        column,
        component: this.renderOptionsField(field),
      }
    })

    if (fields.length < 8) {
      return (
        <Fields>
          <OneColumn>
            {fields.map(f => f.component)}
          </OneColumn>
        </Fields>
      )
    }

    return (
      <Fields>
        <Column left>
          {fields.map(f => f.column === 'left' && f.component)}
        </Column>
        <Column right>
          {fields.map(f => f.column === 'right' && f.component)}
        </Column>
      </Fields>
    )
  }

  render() {
    return (
      <Wrapper>
        <ToggleButtonBar
          items={[{ label: 'Simple', value: 'simple' }, { label: 'Advanced', value: 'advanced' }]}
          selectedValue={this.props.useAdvancedOptions ? 'advanced' : 'simple'}
          onChange={item => { this.props.onAdvancedOptionsToggle(item.value === 'advanced') }}
        />
        {this.renderOptionsFields()}
      </Wrapper>
    )
  }
}

export default WizardOptions
