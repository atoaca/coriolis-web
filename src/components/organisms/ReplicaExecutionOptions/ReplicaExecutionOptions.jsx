import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { WizardOptionsField, Button } from 'components'

import LabelDictionary from '../../../utils/LabelDictionary'

import executionImage from './images/execution.svg'

import { executionOptions } from '../../../config'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 32px 32px 32px;
`
const ExecutionImage = styled.div`
  margin-top: 48px;
  margin-bottom: 96px;
  width: 96px;
  height: 96px;
  background: url('${executionImage}') no-repeat center;
`
const Form = styled.div`
  height: 224px;
`
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const WizardOptionsFieldStyled = styled(WizardOptionsField) `
  width: 319px;
  justify-content: space-between;
`

class ReplicaExecutionOptions extends React.Component {
  static propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func,
    executionLabel: PropTypes.string,
    onCancelClick: PropTypes.func,
    onExecuteClick: PropTypes.func,
  }

  static defaultProps = {
    executionLabel: 'Execute',
  }

  constructor() {
    super()

    this.state = {
      fields: [...executionOptions],
    }
  }

  getFieldValue(field) {
    if (!this.props.options || this.props.options[field.name] === null || this.props.options[field.name] === undefined) {
      return field.value
    }

    return this.props.options[field.name]
  }

  handleValueChange(field, value) {
    let fields = this.state.fields.map(f => {
      if (f.name === field.name) {
        return { ...f, value }
      }
      return { ...f }
    })
    this.setState({ fields })

    if (this.props.onChange) {
      this.props.onChange(field.name, value)
    }
  }

  render() {
    return (
      <Wrapper>
        <ExecutionImage />
        <Form>
          {this.state.fields.map(field => {
            return (
              <WizardOptionsFieldStyled
                key={field.name}
                name={field.name}
                type="strict-boolean"
                value={this.getFieldValue(field)}
                label={LabelDictionary.get(field.name)}
                onChange={value => this.handleValueChange(field, value)}
              />
            )
          })}
        </Form>
        <Buttons>
          <Button secondary onClick={this.props.onCancelClick}>Cancel</Button>
          <Button onClick={() => { this.props.onExecuteClick(this.state.fields) }}>{this.props.executionLabel}</Button>
        </Buttons>
      </Wrapper>
    )
  }
}

export default ReplicaExecutionOptions
