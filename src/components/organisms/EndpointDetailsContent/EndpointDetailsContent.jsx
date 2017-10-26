import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { EndpointLogos, PasswordValue, Button, CopyValue } from 'components'
import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import DateUtils from '../../../utils/DateUtils'
import LabelDictionary from '../../../utils/LabelDictionary'

const Wrapper = styled.div`
  min-width: 656px;
  max-width: 656px;
  margin: 0 auto;
`
const Info = styled.div`
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
`
const Field = styled.div`
  margin-bottom: 32px;
  min-width: 50%;
  max-width: 50%;
`
const Label = styled.div`
  font-size: 10px;
  font-weight: ${StyleProps.fontWeights.medium};
  color: ${Palette.grayscale[3]};
  text-transform: uppercase;
  margin-bottom: 3px;
`
const Value = styled.div``
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`
const MainButtons = styled.div`
  display: flex;
  flex-direction: column;
  button {
    margin-bottom: 16px;
  }
`
const DeleteButton = styled.div``

class EndpointDetailsContent extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    connectionInfo: PropTypes.object,
    onDeleteClick: PropTypes.func,
    onValidateClick: PropTypes.func,
  }

  isUrl(value) {
    return /^https?:\/\//.test(value)
  }

  renderConnectionInfo(connectionInfo) {
    if (!connectionInfo) {
      return null
    }

    return Object.keys(connectionInfo).map(key => {
      let value = connectionInfo[key]

      if (typeof connectionInfo[key] === 'object') {
        return this.renderConnectionInfo(connectionInfo[key])
      }

      if (this.renderedKeys[key]) {
        return null
      }

      this.renderedKeys[key] = true

      if (value === true) {
        value = 'Yes'
      } else if (value === false) {
        value = 'No'
      } else if (!value) {
        value = '-'
      }

      let valueClass = null

      if (key === 'password') {
        valueClass = <PasswordValue value={value} />
      } else if (this.isUrl(value)) {
        valueClass = <CopyValue value={value} maxWidth="90%" />
      } else {
        valueClass = <Value>{value}</Value>
      }

      return (
        <Field key={key}>
          <Label>{LabelDictionary.get(key)}</Label>
          {valueClass}
        </Field>
      )
    })
  }

  renderButtons() {
    return (
      <Buttons>
        <MainButtons>
          <Button secondary onClick={this.props.onEditClick}>Edit Endpoint</Button>
          <Button onClick={this.props.onValidateClick}>Validate Endpoint</Button>
        </MainButtons>
        <DeleteButton>
          <Button hollow alert onClick={this.props.onDeleteClick}>Delete Endpoint</Button>
        </DeleteButton>
      </Buttons>
    )
  }

  render() {
    this.renderedKeys = {}

    return (
      <Wrapper>
        <EndpointLogos endpoint={this.props.item.type} />
        <Info>
          <Field>
            <Label>Name</Label>
            <Value>{this.props.item.name}</Value>
          </Field>
          <Field>
            <Label>Type</Label>
            <Value>{this.props.item.type}</Value>
          </Field>
          <Field>
            <Label>Description</Label>
            <Value>{this.props.item.description || '-'}</Value>
          </Field>
          <Field>
            <Label>Created</Label>
            <Value>{DateUtils.getLocalTime(this.props.item.created_at).format('DD/MM/YYYY HH:mm')}</Value>
          </Field>
          {this.renderConnectionInfo(this.props.connectionInfo)}
        </Info>
        {this.renderButtons()}
      </Wrapper>
    )
  }
}

export default EndpointDetailsContent
