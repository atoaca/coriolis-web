import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

import { LoadingAnimation, Button, CopyButton } from 'components'

import Palette from '../../styleUtils/Palette'

import failedImage from './images/failed.svg'
import NotificationActions from '../../../actions/NotificationActions'
import DomUtils from '../../../utils/DomUtils'

const Wrapper = styled.div`
  padding: 48px 32px 32px 32px;
`
const contentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Loading = styled.div`
  ${contentStyle}
`
const Validation = styled.div`
  ${contentStyle}
`
const FailedImage = styled.div`
  width: 96px;
  height: 96px;
  background: url('${failedImage}') center no-repeat;
`
const Message = styled.div`
  margin-top: 48px;
  text-align: center;
`
const Title = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`
const SuccessTitle = styled.div`
  font-size: 18px;
`
const Subtitle = styled.div`
  color: ${Palette.grayscale[4]};
`
const Buttons = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: ${props => props.center ? 'center' : 'space-between'};
`
const Error = styled.div`
  text-align: left;
  cursor: pointer;

  &:hover > span {
    opacity: 1;
  }
  > span {
    background-position-y: 4px;
    margin-left: 4px;
  }
`

class EndpointValidation extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    validation: PropTypes.object,
    onCancelClick: PropTypes.func,
    onRetryClick: PropTypes.func,
  }

  handleCopyClick(message) {
    let succesful = DomUtils.copyTextToClipboard(message)

    if (succesful) {
      NotificationActions.notify('The value has been copied to clipboard.')
    } else {
      NotificationActions.notify('The value couldn\'t be copied', 'error')
    }
  }

  renderLoading() {
    if (!this.props.loading) {
      return null
    }

    return (
      <Loading>
        <LoadingAnimation />
        <Message>
          <Title>Validating Endpoint</Title>
          <Subtitle>Please wait ...</Subtitle>
        </Message>
      </Loading>
    )
  }

  renderSuccessValidationMessage() {
    if (!this.props.validation || !this.props.validation.valid || this.props.loading) {
      return null
    }

    return (
      <Validation>
        <SuccessTitle>Endpoint is valid</SuccessTitle>
      </Validation>
    )
  }

  renderFailedValidationMessage() {
    if (!this.props.validation || this.props.validation.valid || this.props.loading) {
      return null
    }

    let message = this.props.validation.message || 'An unexpected error occurred.'

    return (
      <Validation>
        <FailedImage />
        <Message>
          <Title>Validation Failed</Title>
          <Error onClick={() => { this.handleCopyClick(message) }}>
            {message}<CopyButton />
          </Error>
        </Message>
      </Validation>
    )
  }

  renderButtons() {
    if (!this.props.loading && this.props.validation && this.props.validation.valid) {
      return (
        <Buttons center>
          <Button secondary onClick={this.props.onCancelClick}>Dismiss</Button>
        </Buttons>
      )
    }

    return (
      <Buttons>
        <Button secondary onClick={this.props.onCancelClick}>Cancel</Button>
        <Button disabled={this.props.loading} onClick={this.props.onRetryClick}>Retry</Button>
      </Buttons>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderLoading()}
        {this.renderFailedValidationMessage()}
        {this.renderSuccessValidationMessage()}
        {this.renderButtons()}
      </Wrapper>
    )
  }
}

export default EndpointValidation
