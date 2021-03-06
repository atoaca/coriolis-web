/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// @flow

import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import EndpointLogos from '../../atoms/EndpointLogos'
import WizardType from '../../molecules/WizardType'
import Button from '../../atoms/Button'
import WizardBreadcrumbs from '../../molecules/WizardBreadcrumbs'
import WizardEndpointList from '../WizardEndpointList'
import WizardInstances from '../WizardInstances'
import WizardNetworks from '../WizardNetworks'
import WizardOptions from '../WizardOptions'
import Schedule from '../Schedule'
import WizardSummary from '../WizardSummary'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import { providerTypes, wizardConfig } from '../../../config'
import type { WizardData } from '../../../types/WizardData'
import type { Endpoint } from '../../../types/Endpoint'
import type { Instance, Nic } from '../../../types/Instance'
import type { Field } from '../../../types/Field'
import type { Network } from '../../../types/Network'
import type { Schedule as ScheduleType } from '../../../types/Schedule'
import instanceStore from '../../../stores/InstanceStore'
import providerStore from '../../../stores/ProviderStore'

import migrationArrowImage from './images/migration.js'
import networkStore from '../../../stores/NetworkStore'

const Wrapper = styled.div`
  ${StyleProps.exactWidth(`${parseInt(StyleProps.contentWidth, 10) + 64}px`)}
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
  justify-content: center;
  flex-grow: 1;
  margin: 0 76px;
`
const Footer = styled.div``
const WizardTypeIcon = styled.div`
  width: 60px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 32px;
`
type Props = {
  page: { id: string, title: string },
  type: 'replica' | 'migration',
  nextButtonDisabled: boolean,
  providerStore: typeof providerStore,
  instanceStore: typeof instanceStore,
  networkStore: typeof networkStore,
  wizardData: WizardData,
  endpoints: Endpoint[],
  onTypeChange: (isReplicaChecked: ?boolean) => void,
  onBackClick: () => void,
  onNextClick: () => void,
  onSourceEndpointChange: (endpoint: Endpoint) => void,
  onTargetEndpointChange: (endpoint: Endpoint) => void,
  onAddEndpoint: (provider: string, fromSource: boolean) => void,
  onInstancesSearchInputChange: (searchText: string) => void,
  onInstancesNextPageClick: (searchText: string) => void,
  onInstancesPreviousPageClick: () => void,
  onInstancesReloadClick: (searchText: string) => void,
  onInstanceClick: (instance: Instance) => void,
  onOptionsChange: (field: Field, value: any) => void,
  onNetworkChange: (nic: Nic, network: Network) => void,
  onAddScheduleClick: (schedule: ScheduleType) => void,
  onScheduleChange: (scheduleId: string, schedule: ScheduleType) => void,
  onScheduleRemove: (scheudleId: string) => void,
  onContentRef: (ref: any) => void,
}
type TimezoneValue = 'local' | 'utc'
type State = {
  useAdvancedOptions: boolean,
  timezone: TimezoneValue,
}

@observer
class WizardPageContent extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      useAdvancedOptions: false,
      timezone: 'local',
    }
  }

  componentDidMount() {
    this.props.onContentRef(this)
  }

  componentWillUnmount() {
    this.props.onContentRef(null)
  }

  getProvidersType(type: string) {
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

  getProviders(type: string) {
    let providers = []
    let providerType = this.getProvidersType(type)
    let providersObject = this.props.providerStore.providers

    if (!providersObject) {
      return []
    }

    Object.keys(providersObject).forEach(provider => {
      if (providersObject[provider].types.findIndex(t => t === providerType) > -1) {
        providers.push(provider)
      }
    })

    return providers
  }

  isNetworksPageValid() {
    if (this.props.networkStore.loading || this.props.instanceStore.loadingInstancesDetails) {
      return false
    }

    let instances = this.props.instanceStore.instancesDetails
    if (instances.length === 0) {
      return true
    }

    if (instances.find(i => i.devices)) {
      if (instances.find(i => i.devices.nics && i.devices.nics.length > 0)) {
        return this.props.wizardData.networks && this.props.wizardData.networks.length > 0
      }
      return true
    }

    return false
  }

  isOptionsPageValid() {
    const isValid = (field: Field): boolean => {
      return (this.props.wizardData.options &&
        this.props.wizardData.options[field.name] !== null &&
        this.props.wizardData.options[field.name] !== undefined &&
        this.props.wizardData.options[field.name] !== ''
      ) || (field.default !== null && field.default !== undefined)
    }

    let schema = this.props.providerStore.optionsSchema
    if (schema && schema.length > 0) {
      let required = schema.filter(f => f.required && f.type !== 'object')
      schema.forEach(f => {
        if (f.type === 'object' && f.properties && f.properties.filter(p => isValid(p)).length > 0) {
          required = required.concat(f.properties.filter(p => p.required))
        }
      })

      let validFieldsCount = 0
      required.forEach(f => {
        if (isValid(f)) {
          validFieldsCount += 1
        }
      })

      if (validFieldsCount === required.length) {
        return true
      }
    }

    return false
  }

  isNextButtonDisabled() {
    if (this.props.nextButtonDisabled) {
      return true
    }

    switch (this.props.page.id) {
      case 'source':
        return !this.props.wizardData.source
      case 'target':
        return !this.props.wizardData.target
      case 'vms':
        return !this.props.wizardData.selectedInstances || !this.props.wizardData.selectedInstances.length
      case 'options':
        return !this.isOptionsPageValid()
      case 'networks':
        return !this.isNetworksPageValid()
      default:
        return false
    }
  }

  handleAdvancedOptionsToggle(useAdvancedOptions: boolean) {
    this.setState({ useAdvancedOptions })
  }

  handleTimezoneChange(timezone: TimezoneValue) {
    this.setState({ timezone })
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
            searchNotFound={this.props.instanceStore.searchNotFound}
            reloading={this.props.instanceStore.reloading}
            onSearchInputChange={this.props.onInstancesSearchInputChange}
            onNextPageClick={this.props.onInstancesNextPageClick}
            onPreviousPageClick={this.props.onInstancesPreviousPageClick}
            hasNextPage={this.props.instanceStore.hasNextPage}
            currentPage={this.props.instanceStore.currentPage}
            loadingPage={this.props.instanceStore.loadingPage}
            onReloadClick={this.props.onInstancesReloadClick}
            onInstanceClick={this.props.onInstanceClick}
            selectedInstances={this.props.wizardData.selectedInstances}
          />
        )
        break
      case 'options':
        body = (
          <WizardOptions
            loading={this.props.providerStore.optionsSchemaLoading || this.props.providerStore.destinationOptionsLoading}
            selectedInstances={this.props.wizardData.selectedInstances}
            fields={this.props.providerStore.optionsSchema}
            onChange={this.props.onOptionsChange}
            data={this.props.wizardData.options}
            useAdvancedOptions={this.state.useAdvancedOptions}
            wizardType={this.props.type}
            onAdvancedOptionsToggle={useAdvancedOptions => { this.handleAdvancedOptionsToggle(useAdvancedOptions) }}
          />
        )
        break
      case 'networks':
        body = (
          <WizardNetworks
            networks={this.props.networkStore.networks}
            selectedNetworks={this.props.wizardData.networks}
            loading={this.props.networkStore.loading}
            instancesDetails={this.props.instanceStore.instancesDetails}
            loadingInstancesDetails={this.props.instanceStore.loadingInstancesDetails}
            onChange={this.props.onNetworkChange}
          />
        )
        break
      case 'schedule':
        body = (
          <Schedule
            schedules={this.props.wizardData.schedules}
            onAddScheduleClick={this.props.onAddScheduleClick}
            onChange={this.props.onScheduleChange}
            onRemove={this.props.onScheduleRemove}
            timezone={this.state.timezone}
            onTimezoneChange={timezone => { this.handleTimezoneChange(timezone) }}
            secondaryEmpty
          />
        )
        break
      case 'summary':
        body = (
          <WizardSummary
            data={this.props.wizardData}
            wizardType={this.props.type}
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
    let currentPageIndex = wizardConfig.pages.findIndex(p => p.id === this.props.page.id)
    let isLastPage = currentPageIndex === wizardConfig.pages.length - 1

    return (
      <Navigation>
        <Button secondary onClick={this.props.onBackClick}>Back</Button>
        <IconRepresentation>
          <EndpointLogos height={32} endpoint={sourceEndpoint} />
          <WizardTypeIcon
            dangerouslySetInnerHTML={{
              __html: this.props.type === 'replica'
                ? migrationArrowImage(Palette.alert) : migrationArrowImage(Palette.primary),
            }}
          />
          <EndpointLogos height={32} endpoint={targetEndpoint} />
        </IconRepresentation>
        <Button
          onClick={this.props.onNextClick}
          disabled={this.isNextButtonDisabled()}
        >{isLastPage ? 'Finish' : 'Next'}</Button>
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
          <WizardBreadcrumbs selected={this.props.page} wizardType={this.props.type} />
        </Footer>
      </Wrapper>
    )
  }
}

export default WizardPageContent
