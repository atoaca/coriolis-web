import React from 'react'
import styled from 'styled-components'
import connectToStores from 'alt-utils/lib/connectToStores'
import PropTypes from 'prop-types'

import {
  WizardTemplate,
  DetailsPageHeader,
  WizardPageContent,
  Modal,
  Endpoint,
} from 'components'

import UserStore from '../../../stores/UserStore'
import UserActions from '../../../actions/UserActions'
import ProviderActions from '../../../actions/ProviderActions'
import ProviderStore from '../../../stores/ProviderStore'
import EndpointActions from '../../../actions/EndpointActions'
import EndpointStore from '../../../stores/EndpointStore'
import WizardStore from '../../../stores/WizardStore'
import WizardActions from '../../../actions/WizardActions'
import InstanceStore from '../../../stores/InstanceStore'
import InstanceActions from '../../../actions/InstanceActions'
import NetworkActions from '../../../actions/NetworkActions'
import NetworkStore from '../../../stores/NetworkStore'
import { wizardConfig } from '../../../config'

const Wrapper = styled.div``

class WizardPage extends React.Component {
  static propTypes = {
    userStore: PropTypes.object,
    wizardStore: PropTypes.object,
    providerStore: PropTypes.object,
    endpointStore: PropTypes.object,
    instanceStore: PropTypes.object,
    networkStore: PropTypes.object,
    match: PropTypes.object,
  }

  static getStores() {
    return [UserStore, WizardStore, ProviderStore, EndpointStore, InstanceStore, NetworkStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      wizardStore: WizardStore.getState(),
      providerStore: ProviderStore.getState(),
      endpointStore: EndpointStore.getState(),
      instanceStore: InstanceStore.getState(),
      networkStore: NetworkStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      type: 'migration',
      showNewEndpointModal: false,
    }
  }

  componentWillMount() {
    let type = this.props.match && this.props.match.params.type
    if (type === 'migration' || type === 'replica') {
      this.setState({ type })
    }
  }

  componentDidMount() {
    document.title = 'Coriolis Wizard'
  }

  componentWillUnmount() {
    WizardActions.clearData()
  }

  loadDataForPage(page) {
    switch (page.id) {
      case 'source':
        ProviderActions.loadProviders()
        EndpointActions.getEndpoints()
        break
      case 'vms':
        InstanceActions.loadInstances(this.props.wizardStore.data.source.id)
        break
      case 'options':
        ProviderActions.loadOptionsSchema(this.props.wizardStore.data.target.type, this.state.type)
        break
      case 'networks':
        InstanceActions.loadInstancesDetails(this.props.wizardStore.data.source.id, this.props.wizardStore.data.selectedInstances)
        NetworkActions.loadNetworks(this.props.wizardStore.data.target.id, this.props.wizardStore.data.options)
        break
      default:
    }
  }

  handleUserItemClick(item) {
    switch (item.value) {
      case 'signout':
        UserActions.logout()
        return
      case 'profile':
        window.location.href = '/#/profile'
        break
      default:
    }
  }

  handleTypeChange(isReplica) {
    this.setState({ type: isReplica ? 'replica' : 'migration' })
  }

  handleBackClick() {
    let pages = wizardConfig.pages.filter(p => !p.excludeFrom || p.excludeFrom !== this.state.type)
    let currentPageIndex = pages.findIndex(p => p.id === this.props.wizardStore.currentPage.id)

    if (currentPageIndex === 0) {
      window.history.back()
      return
    }

    let page = pages[currentPageIndex - 1]
    this.loadDataForPage(page)
    WizardActions.setCurrentPage(page)
  }

  handleNextClick() {
    let pages = wizardConfig.pages.filter(p => !p.excludeFrom || p.excludeFrom !== this.state.type)
    let currentPageIndex = pages.findIndex(p => p.id === this.props.wizardStore.currentPage.id)
    let page = pages[currentPageIndex + 1]
    this.loadDataForPage(page)
    WizardActions.setCurrentPage(page)
  }

  handleSourceEndpointChange(source) {
    WizardActions.updateData({ source, selectedInstances: null, networks: null })
  }

  handleTargetEndpointChange(target) {
    WizardActions.updateData({ target, networks: null })
  }

  handleAddEndpoint(newEndpointType, newEndpointFromSource) {
    this.setState({
      showNewEndpointModal: true,
      newEndpointType,
      newEndpointFromSource,
    })
  }

  handleCloseNewEndpointModal(autoClose) {
    if (autoClose) {
      if (this.state.newEndpointFromSource) {
        WizardActions.updateData({ source: this.props.endpointStore.endpoints[0] })
      } else {
        WizardActions.updateData({ target: this.props.endpointStore.endpoints[0] })
      }
    }
    this.setState({ showNewEndpointModal: false })
  }

  handleInstancesSearchInputChange(searchText) {
    InstanceActions.searchInstances(this.props.wizardStore.data.source.id, searchText)
  }

  handleInstancesNextPageClick(searchText) {
    InstanceActions.loadNextPage(this.props.wizardStore.data.source.id, searchText)
  }

  handleInstancesPreviousPageClick() {
    InstanceActions.loadPreviousPage()
  }

  handleInstancesReloadClick(searchText) {
    InstanceActions.reloadInstances(this.props.wizardStore.data.source.id, searchText)
  }

  handleInstanceClick(instance) {
    WizardActions.updateData({ networks: null })
    WizardActions.toggleInstanceSelection(instance)
  }

  handleOptionsChange(field, value) {
    WizardActions.updateData({ networks: null })
    WizardActions.updateOptions({ field, value })
  }

  handleNetworkChange(sourceNic, targetNetwork) {
    WizardActions.updateNetworks({ sourceNic, targetNetwork })
  }

  handleAddScheduleClick() {
    WizardActions.addSchedule()
  }

  handleScheduleChange(scheduleId, data) {
    WizardActions.updateSchedule(scheduleId, data)
  }

  handleScheduleRemove(scheduleId) {
    WizardActions.removeSchedule(scheduleId)
  }

  render() {
    return (
      <Wrapper>
        <WizardTemplate
          pageHeaderComponent={<DetailsPageHeader
            user={this.props.userStore.user}
            onUserItemClick={item => { this.handleUserItemClick(item) }}
          />}
          pageContentComponent={<WizardPageContent
            page={this.props.wizardStore.currentPage}
            providerStore={this.props.providerStore}
            instanceStore={this.props.instanceStore}
            networkStore={this.props.networkStore}
            endpoints={this.props.endpointStore.endpoints}
            wizardData={this.props.wizardStore.data}
            type={this.state.type}
            onTypeChange={isReplica => { this.handleTypeChange(isReplica) }}
            onBackClick={() => { this.handleBackClick() }}
            onNextClick={() => { this.handleNextClick() }}
            onSourceEndpointChange={endpoint => { this.handleSourceEndpointChange(endpoint) }}
            onTargetEndpointChange={endpoint => { this.handleTargetEndpointChange(endpoint) }}
            onAddEndpoint={(type, fromSource) => { this.handleAddEndpoint(type, fromSource) }}
            onInstancesSearchInputChange={searchText => { this.handleInstancesSearchInputChange(searchText) }}
            onInstancesNextPageClick={searchText => { this.handleInstancesNextPageClick(searchText) }}
            onInstancesPreviousPageClick={() => { this.handleInstancesPreviousPageClick() }}
            onInstancesReloadClick={searchText => { this.handleInstancesReloadClick(searchText) }}
            onInstanceClick={instance => { this.handleInstanceClick(instance) }}
            onOptionsChange={(field, value) => { this.handleOptionsChange(field, value) }}
            onNetworkChange={(sourceNic, targetNetwork) => { this.handleNetworkChange(sourceNic, targetNetwork) }}
            onAddScheduleClick={() => { this.handleAddScheduleClick() }}
            onScheduleChange={(scheduleId, data) => { this.handleScheduleChange(scheduleId, data) }}
            onScheduleRemove={scheduleId => { this.handleScheduleRemove(scheduleId) }}
          />}
        />
        <Modal
          isOpen={this.state.showNewEndpointModal}
          title="New Cloud Endpoint"
          onRequestClose={() => { this.handleCloseNewEndpointModal() }}
        >
          <Endpoint
            deleteOnCancel
            type={this.state.newEndpointType}
            onCancelClick={autoClose => { this.handleCloseNewEndpointModal(autoClose) }}
          />
        </Modal>
      </Wrapper>
    )
  }
}

export default connectToStores(WizardPage)
