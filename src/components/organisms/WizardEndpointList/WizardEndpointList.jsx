import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

import { EndpointLogos, Dropdown, LoadingAnimation } from 'components'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${props => !props.loading ? css`
    margin-left: -112px;
    margin-top: -96px;
  ` : null}
  align-items: center;
  margin-bottom: 64px;
`
const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 112px;
  margin-top: 96px;
`
const EndpointLogosStyled = styled(EndpointLogos) `
  margin-bottom: 32px;
`

class WizardEndpointList extends React.Component {
  static propTypes = {
    providers: PropTypes.array,
    endpoints: PropTypes.array,
    loading: PropTypes.bool,
    selectedEndpoint: PropTypes.object,
    otherEndpoint: PropTypes.object,
    onChange: PropTypes.func,
    onAddEndpoint: PropTypes.func,
  }

  handleOnChange(selectedItem) {
    if (selectedItem.id !== 'addNew') {
      this.props.onChange(selectedItem)
      return
    }

    this.props.onAddEndpoint(selectedItem.provider)
  }

  renderProviders() {
    if (this.props.loading) {
      return null
    }

    return this.props.providers.map(provider => {
      let otherEndpoint = this.props.otherEndpoint
      let items = this.props.endpoints.filter(e => e.type === provider && (!otherEndpoint || otherEndpoint.id !== e.id))
      let selectedItem = this.props.selectedEndpoint && this.props.selectedEndpoint.type === provider
        ? this.props.selectedEndpoint : null

      items = [
        ...items,
        { id: 'addNew', name: 'Add new ...', provider },
      ]

      return (
        <Item key={provider}>
          <EndpointLogosStyled height={128} endpoint={provider} />
          <Dropdown
            primary={Boolean(selectedItem)}
            items={items}
            labelField="name"
            noItemsMessage="Add"
            noSelectionMessage="Select"
            centered
            selectedItem={selectedItem}
            onChange={selectedItem => { this.handleOnChange(selectedItem) }}
          />
        </Item>
      )
    })
  }

  renderLoading() {
    if (!this.props.loading) {
      return null
    }

    return <LoadingAnimation />
  }

  render() {
    return (
      <Wrapper loading={this.props.loading}>
        {this.renderLoading()}
        {this.renderProviders()}
      </Wrapper>
    )
  }
}

export default WizardEndpointList
