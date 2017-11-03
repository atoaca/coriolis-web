import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {
  WizardType,
  Button,
  WizardBreadcrumbs,
  EndpointLogos,
  WizardEndpointList,
  WizardInstances,
} from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import { providerTypes } from '../../../config'

import migrationArrowImage from './images/migration.js'

const bodyWidth = 800
const Wrapper = styled.div`
  ${StyleProps.exactWidth(`${bodyWidth + 64}px`)}
  margin: 64px auto 32px auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: ${StyleProps.fontWeights.light};
  color: ${Palette.primary};
  margin-bottom: 32px;
`
const Body = styled.div`
  flex-grow: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 0 32px;
`
const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 32px 0 32px;
  margin-bottom: 80px;
`
const IconRepresentation = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin: 0 76px;
`
const Footer = styled.div``
const WizardTypeIcon = styled.div`
  width: 60px;
  height: 32px;
  background: url('data:image/svg+xml;utf8,${props => props.type === 'replica' ? migrationArrowImage(Palette.alert) : migrationArrowImage(Palette.primary)}') center no-repeat;
`

class WizardPageContent extends React.Component {
  static propTypes = {
    page: PropTypes.object,
    type: PropTypes.string,
    providerStore: PropTypes.object,
    instanceStore: PropTypes.object,
    wizardData: PropTypes.object,
    endpoints: PropTypes.array,
    onTypeChange: PropTypes.func,
    onBackClick: PropTypes.func,
    onNextClick: PropTypes.func,
    onSourceEndpointChange: PropTypes.func,
    onTargetEndpointChange: PropTypes.func,
    onAddEndpoint: PropTypes.func,
    onInstancesSearchInputChange: PropTypes.func,
    onInstancesNextPageClick: PropTypes.func,
    onInstancesPreviousPageClick: PropTypes.func,
  }

  getProvidersType(type) {
    if (this.props.type === 'replica') {
      if (type === 'source') {
        return providerTypes.SOURCE_REPLICA
      }
      return providerTypes.TARGET_REPLICA
    }

    if (type === 'source') {
      return providerTypes.SOURCE_MIGRATION
    }
    return providerTypes.TARGET_MIGRATION
  }

  getProviders(type) {
    let providers = []
    let providerType = this.getProvidersType(type)

    Object.keys(this.props.providerStore.providers || {}).forEach(provider => {
      if (this.props.providerStore.providers[provider].types.findIndex(t => t === providerType) > -1) {
        providers.push(provider)
      }
    })

    return providers
  }

  isNextButtonDisabled() {
    switch (this.props.page.id) {
      case 'type':
        return false
      case 'source':
        return !this.props.wizardData.source
      case 'target':
        return !this.props.wizardData.target
      default:
        return true
    }
  }

  renderHeader() {
    let title = this.props.page.title

    if (this.props.page.id === 'type') {
      title += ` ${this.props.type.charAt(0).toUpperCase() + this.props.type.substr(1)}`
    }

    return <Header>{title}</Header>
  }

  renderBody() {
    let body = null

    switch (this.props.page.id) {
      case 'type':
        body = (
          <WizardType
            selected={this.props.type}
            onChange={this.props.onTypeChange}
          />
        )
        break
      case 'source':
        body = (
          <WizardEndpointList
            providers={this.getProviders('source')}
            loading={this.props.providerStore.providersLoading}
            otherEndpoint={this.props.wizardData.target}
            selectedEndpoint={this.props.wizardData.source}
            endpoints={this.props.endpoints}
            onChange={this.props.onSourceEndpointChange}
            onAddEndpoint={type => { this.props.onAddEndpoint(type, true) }}
          />
        )
        break
      case 'target':
        body = (
          <WizardEndpointList
            providers={this.getProviders('target')}
            loading={this.props.providerStore.providersLoading}
            otherEndpoint={this.props.wizardData.source}
            selectedEndpoint={this.props.wizardData.target}
            endpoints={this.props.endpoints}
            onChange={this.props.onTargetEndpointChange}
            onAddEndpoint={type => { this.props.onAddEndpoint(type, false) }}
          />
        )
        break
      case 'vms':
        body = (
          <WizardInstances
            instances={this.props.instanceStore.instances}
            loading={this.props.instanceStore.instancesLoading}
            searching={this.props.instanceStore.searching}
            onSearchInputChange={this.props.onInstancesSearchInputChange}
            onNextPageClick={this.props.onInstancesNextPageClick}
            onPreviousPageClick={this.props.onInstancesPreviousPageClick}
            hasNextPage={this.props.instanceStore.hasNextPage}
            currentPage={this.props.instanceStore.currentPage}
            loadingPage={this.props.instanceStore.loadingPage}
          />
        )
        break
      default:
    }

    return <Body>{body}</Body>
  }

  renderNavigationActions() {
    let sourceEndpoint = this.props.wizardData.source && this.props.wizardData.source.type
    let targetEndpoint = this.props.wizardData.target && this.props.wizardData.target.type

    return (
      <Navigation>
        <Button secondary onClick={this.props.onBackClick}>Back</Button>
        <IconRepresentation>
          <EndpointLogos height={32} endpoint={sourceEndpoint} />
          <WizardTypeIcon type={this.props.type} />
          <EndpointLogos height={32} endpoint={targetEndpoint} />
        </IconRepresentation>
        <Button onClick={this.props.onNextClick} disabled={this.isNextButtonDisabled()}>Next</Button>
      </Navigation>
    )
  }

  render() {
    if (!this.props.page) {
      return null
    }

    return (
      <Wrapper>
        {this.renderHeader()}
        {this.renderBody()}
        <Footer>
          {this.renderNavigationActions()}
          <WizardBreadcrumbs selected={this.props.page} />
        </Footer>
      </Wrapper>
    )
  }
}

export default WizardPageContent
