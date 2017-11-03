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
import { wizardConfig } from '../../../config'

const Wrapper = styled.div``

class WizardPage extends React.Component {
  static propTypes = {
    userStore: PropTypes.object,
    wizardStore: PropTypes.object,
    providerStore: PropTypes.object,
    endpointStore: PropTypes.object,
    instanceStore: PropTypes.object,
    match: PropTypes.object,
  }

  static getStores() {
    return [UserStore, WizardStore, ProviderStore, EndpointStore, InstanceStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      wizardStore: WizardStore.getState(),
      providerStore: ProviderStore.getState(),
      endpointStore: EndpointStore.getState(),
      instanceStore: InstanceStore.getState(),
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
    let currentPageIndex = wizardConfig.pages.findIndex(p => p.id === this.props.wizardStore.currentPage.id)

    if (currentPageIndex === 0) {
      window.history.back()
      return
    }

    let page = wizardConfig.pages[currentPageIndex - 1]
    this.loadDataForPage(page)
    WizardActions.setCurrentPage(page)
  }

  handleNextClick() {
    let currentPageIndex = wizardConfig.pages.findIndex(p => p.id === this.props.wizardStore.currentPage.id)
    let page = wizardConfig.pages[currentPageIndex + 1]
    this.loadDataForPage(page)
    WizardActions.setCurrentPage(page)
  }

  handleSourceEndpointChange(source) {
    WizardActions.updateData({ source })
  }

  handleTargetEndpointChange(target) {
    WizardActions.updateData({ target })
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
