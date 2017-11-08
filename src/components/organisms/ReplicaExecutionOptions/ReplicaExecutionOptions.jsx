import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Field, Button } from 'components'

import LabelDictionary from '../../../utils/LabelDictionary'

import executionImage from './images/execution.svg'

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

class ReplicaExecutionOptions extends React.Component {
  static propTypes = {
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
      fields: [
        {
          name: 'shutdown_instances',
          type: 'boolean',
        },
      ],
    }
  }

  handleValueChange(field, value) {
    this.state.fields.find(f => f.name === field.name).value = value
    this.setState({ fields: this.state.fields })
  }

  render() {
    return (
      <Wrapper>
        <ExecutionImage />
        <Form>
          {this.state.fields.map(field => {
            return (
              <Field
                key={field.name}
                type={field.type}
                value={field.value}
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
