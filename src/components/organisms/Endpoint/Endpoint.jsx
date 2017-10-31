import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import { EndpointLogos, Field, Button, StatusIcon, LoadingButton, CopyButton } from 'components'
import LabelDictionary from '../../../utils/LabelDictionary'
import NotificationActions from '../../../actions/NotificationActions'
import EndpointStore from '../../../stores/EndpointStore'
import EndpointActions from '../../../actions/EndpointActions'
import ProviderStore from '../../../stores/ProviderStore'
import ProviderActions from '../../../actions/ProviderActions'
import ObjectUtils from '../../../utils/ObjectUtils'
import Wait from '../../../utils/Wait'
import Palette from '../../styleUtils/Palette'
import DomUtils from '../../../utils/DomUtils'

const Wrapper = styled.div`
  padding: 48px 32px 32px 32px;
  display: flex;
  align-items: center;
  flex-direction: column;
`
const Fields = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -64px;
  margin-top: 32px;
`
const FieldStyled = styled(Field) `
  margin-left: 64px;
  min-width: 224px;
  max-width: 224px;
  margin-bottom: 16px;
`
const RadioGroup = styled.div`
  width: 100%;
`
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 32px;
`
const Status = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const StatusHeader = styled.div`
  display: flex;
`
const StatusMessage = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: center;
  line-height: 12px;
`
const ShowErrorButton = styled.span`
  font-size: 10px;
  color: ${Palette.primary};
  margin-left: 8px;
  cursor: pointer;
`
const StatusError = styled.div`
  margin-top: 32px;
  cursor: pointer;

  &:hover > span {
    opacity: 1;
  }
  > span {
    background-position-y: 4px;
    margin-left: 4px;
  }
`

class Endpoint extends React.Component {
  static propTypes = {
    isNew: PropTypes.bool,
    type: PropTypes.string,
    endpoint: PropTypes.object,
    connectionInfo: PropTypes.object,
    onFieldChange: PropTypes.func,
    onCancelClick: PropTypes.func,
    onResizeUpdate: PropTypes.func,
    onValidateClick: PropTypes.func,
    endpointStore: PropTypes.object,
    providerStore: PropTypes.object,
  }

  static getStores() {
    return [EndpointStore, ProviderStore]
  }

  static getPropsFromStores() {
    return {
      endpointStore: EndpointStore.getState(),
      providerStore: ProviderStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      fields: null,
      invalidFields: [],
      validating: false,
      showErrorMessage: false,
      endpoint: {},
    }
  }

  componentDidMount() {
    ProviderActions.getConnectionInfoSchema(this.getEndpointType())
  }

  componentWillReceiveProps(props) {
    let selectedRadio = this.getSelectedRadio(props.endpointStore.connectionInfo,
      props.providerStore.connectionInfoSchema)

    if (this.state.validating) {
      if (props.endpointStore.validation && !props.endpointStore.validation.valid) {
        this.setState({ validating: false })
      }
    }

    if (props.endpoint && props.endpointStore.connectionInfo) {
      this.setState({
        endpoint: {
          ...ObjectUtils.flatten(props.endpoint),
          ...selectedRadio,
          ...ObjectUtils.flatten(props.endpointStore.connectionInfo),
        },
      })
    } else {
      this.setState({
        endpoint: {
          ...selectedRadio,
        },
      })
    }

    this.props.onResizeUpdate()
  }

  componentWillUnmount() {
    EndpointActions.clearValidation()
    clearTimeout(this.closeTimeout)
  }

  getEndpointType() {
    if (this.props.isNew) {
      return this.props.type
    }

    return this.props.endpoint.type
  }

  getSelectedRadio(connectionInfo, schema) {
    let radioGroup = schema.find(f => f.type === 'radio-group')

    if (!radioGroup) {
      return null
    }

    let selectedGroupItem = {}

    if (!connectionInfo) {
      selectedGroupItem[radioGroup.name] = radioGroup.default
    } else {
      radioGroup.items.forEach(i => {
        let key = Object.keys(connectionInfo).find(k => k === i.name)
        if (key) {
          selectedGroupItem[radioGroup.name] = key
        }
      })
    }

    return selectedGroupItem
  }

  getFieldValue(field, parentGroup) {
    if (parentGroup) {
      return this.state.endpoint[parentGroup.name] === field.name
    }

    if (this.state.endpoint[field.name]) {
      return this.state.endpoint[field.name]
    }

    if (Object.keys(field).find(k => k === 'default')) {
      return field.default
    }

    return ''
  }

  isValidating() {
    return this.state.validating
  }

  findInvalidFields(invalidFields, schemaRoot) {
    schemaRoot.forEach(field => {
      if (field.type === 'radio-group') {
        let selectedItem = field.items.find(i => i.name === this.state.endpoint[field.name])
        this.findInvalidFields(invalidFields, selectedItem.fields)
      } else if (field.required) {
        let value = this.getFieldValue(field)
        if (!value) {
          invalidFields.push(field.name)
        }
      }
    })
  }

  highlightRequired() {
    let invalidFields = []
    this.findInvalidFields(invalidFields, this.props.providerStore.connectionInfoSchema)
    this.setState({ invalidFields })
    return invalidFields.length > 0
  }

  handleFieldChange(field, value, parentGroup) {
    let endpoint = { ...this.state.endpoint }

    if (parentGroup) {
      endpoint[parentGroup.name] = field.name
    } else {
      endpoint[field.name] = value
    }

    this.setState({ endpoint })
  }

  handleValidateClick() {
    if (!this.highlightRequired()) {
      this.setState({ validating: true })

      NotificationActions.notify('Saving endpoint ...')
      EndpointActions.clearValidation()
      EndpointActions.update(this.state.endpoint)
      Wait.for(() => EndpointStore.getState().updating === false, () => {
        NotificationActions.notify('Validating endpoint ...')
        EndpointActions.validate(this.state.endpoint)
      })
    } else {
      NotificationActions.notify('Please fill all the required fields', 'error')
    }
  }

  handleShowErrorMessageClick() {
    this.setState({ showErrorMessage: !this.state.showErrorMessage })
  }

  handleCopyErrorMessageClick() {
    let succesful = DomUtils.copyTextToClipboard(this.props.endpointStore.validation.message)

    if (succesful) {
      NotificationActions.notify('The message has been copied to clipboard.')
    }
  }

  renderFields(fields, parentGroup) {
    let renderedFields = []

    fields.forEach(field => {
      if (field.type === 'radio-group') {
        renderedFields = renderedFields.concat(
          <RadioGroup key={field.name}>{this.renderFields(field.items, field)}</RadioGroup>
        )

        field.items.forEach(item => {
          if (this.getFieldValue(item, field)) {
            renderedFields = renderedFields.concat(this.renderFields(item.fields))
          }
        })

        return
      }

      renderedFields = renderedFields.concat(
        <FieldStyled
          {...field}
          large
          disabled={this.isValidating()
            || (this.props.endpointStore.validation && this.props.endpointStore.validation.valid)}
          key={field.name}
          password={field.name === 'password'}
          type={field.type}
          highlight={this.state.invalidFields.findIndex(fn => fn === field.name) > -1}
          label={LabelDictionary.get(field.name)}
          value={this.getFieldValue(field, parentGroup)}
          onChange={value => { this.handleFieldChange(field, value, parentGroup) }}
        />
      )
    })

    return renderedFields
  }

  renderEndpointStatus() {
    let validation = this.props.endpointStore.validation
    if (!this.isValidating() && !validation) {
      return null
    }

    let status = 'RUNNING'
    let message = 'Validating Endpoint ...'
    let error = null
    let showErrorButton = null

    if (validation) {
      if (validation.valid) {
        message = 'Endpoint is Valid'
        status = 'COMPLETED'
      } else {
        status = 'ERROR'
        message = 'Validation failed'
        if (validation.message) {
          showErrorButton = (
            <ShowErrorButton onClick={() => { this.handleShowErrorMessageClick() }}>
              {this.state.showErrorMessage ? 'Hide' : 'Show'} Error</ShowErrorButton>
          )
          error = this.state.showErrorMessage ?
            <StatusError onClick={() => { this.handleCopyErrorMessageClick() }}>{validation.message}<CopyButton /></StatusError> : null
        }
      }
    }

    return (
      <Status>
        <StatusHeader>
          <StatusIcon status={status} />
          <StatusMessage>{message}{showErrorButton}</StatusMessage>
        </StatusHeader>
        {error}
      </Status>
    )
  }

  renderActionButton() {
    if (this.props.isNew) {
      return null
    }

    let button = <Button large onClick={() => this.handleValidateClick()}>Validate and save</Button>

    let message = 'Validating Endpoint ...'
    let validation = this.props.endpointStore.validation

    if (this.isValidating() || (validation && validation.valid)) {
      if (validation && validation.valid) {
        message = 'Saving ...'
      }

      button = <LoadingButton large>{message}</LoadingButton>
    }

    return button
  }

  render() {
    if (this.props.endpointStore.validation && this.props.endpointStore.validation.valid
      && !this.closeTimeout) {
      this.closeTimeout = setTimeout(() => {
        this.props.onCancelClick()
      }, 2000)
    }

    return (
      <Wrapper>
        <EndpointLogos style={{ marginBottom: '16px' }} height={128} endpoint={this.getEndpointType()} />
        {this.renderEndpointStatus()}
        <Fields>
          {this.renderFields(this.props.providerStore.connectionInfoSchema)}
        </Fields>
        <Buttons>
          <Button large secondary onClick={this.props.onCancelClick}>Cancel</Button>
          {this.renderActionButton()}
        </Buttons>
      </Wrapper>
    )
  }
}

export default connectToStores(Endpoint)
