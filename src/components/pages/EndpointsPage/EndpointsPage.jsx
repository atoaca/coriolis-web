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

import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import {
  MainTemplate,
  Navigation,
  FilterList,
  PageHeader,
  EndpointListItem,
  AlertModal,
} from 'components'

import ProjectStore from '../../../stores/ProjectStore'
import UserStore from '../../../stores/UserStore'
import EndpointStore from '../../../stores/EndpointStore'
import MigrationStore from '../../../stores/MigrationStore'
import ReplicaStore from '../../../stores/ReplicaStore'
import ProjectActions from '../../../actions/ProjectActions'
import EndpointActions from '../../../actions/EndpointActions'
import MigrationActions from '../../../actions/MigrationActions'
import ReplicaActions from '../../../actions/ReplicaActions'
import UserActions from '../../../actions/UserActions'
import Wait from '../../../utils/Wait'
import LabelDictionary from '../../../utils/LabelDictionary'

const Wrapper = styled.div``

const BulkActions = [
  { label: 'Delete', value: 'delete' },
]

class EndpointsPage extends React.Component {
  static propTypes = {
    projectStore: PropTypes.object,
    userStore: PropTypes.object,
    endpointStore: PropTypes.object,
    migrationStore: PropTypes.object,
    replicaStore: PropTypes.object,
  }

  static getStores() {
    return [UserStore, ProjectStore, EndpointStore, MigrationStore, ReplicaStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      projectStore: ProjectStore.getState(),
      endpointStore: EndpointStore.getState(),
      migrationStore: MigrationStore.getState(),
      replicaStore: ReplicaStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showDeleteEndpointsConfirmation: false,
      confirmationItems: null,
    }
  }

  componentDidMount() {
    document.title = 'Coriolis Endpoints'

    ProjectActions.getProjects()
    EndpointActions.getEndpoints()
    MigrationActions.getMigrations()
    ReplicaActions.getReplicas()
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }

  getFilterItems() {
    let types = [{ label: 'All', value: 'all' }]
    this.props.endpointStore.endpoints.forEach(endpoint => {
      if (!types.find(t => t.value === endpoint.type)) {
        types.push({ label: LabelDictionary.get(endpoint.type), value: endpoint.type })
      }
    })

    return types
  }

  getEndpointUsage(endpoint) {
    let replicasCount = this.props.replicaStore.replicas.filter(
      r => r.origin_endpoint_id === endpoint.id || r.destination_endpoint_id === endpoint.id).length
    let migrationsCount = this.props.migrationStore.migrations.filter(
      r => r.origin_endpoint_id === endpoint.id || r.destination_endpoint_id === endpoint.id).length

    return { migrationsCount, replicasCount }
  }

  handleProjectChange(project) {
    Wait.for(() => this.props.userStore.user.project.id === project.id, () => {
      ProjectActions.getProjects()
      EndpointActions.getEndpoints()
      MigrationActions.getMigrations()
      ReplicaActions.getReplicas()
    })

    UserActions.switchProject(project.id)
  }

  handleReloadButtonClick() {
    ProjectActions.getProjects()
    EndpointActions.getEndpoints()
    MigrationActions.getMigrations()
    ReplicaActions.getReplicas()
  }

  handleItemClick(item) {
    window.location.href = `/#/endpoint/${item.id}`
  }

  handleActionChange(items, action) {
    if (action === 'delete') {
      this.setState({
        showDeleteEndpointsConfirmation: true,
        confirmationItems: items,
      })
    }
  }

  handleCloseDeleteEndpointsConfirmation() {
    this.setState({
      showDeleteEndpointsConfirmation: false,
      confirmationItems: null,
    })
  }

  handleDeleteEndpointsConfirmation() {
    this.state.confirmationItems.forEach(endpoint => {
      EndpointActions.delete(endpoint)
    })
    this.handleCloseDeleteEndpointsConfirmation()
  }

  itemFilterFunction(item, filterItem, filterText) {
    if ((filterItem !== 'all' && (item.type !== filterItem)) ||
      (item.name.toLowerCase().indexOf(filterText) === -1 &&
      item.description.toLowerCase().indexOf(filterText) === -1)
    ) {
      return false
    }

    return true
  }

  render() {
    return (
      <Wrapper>
        <MainTemplate
          navigationComponent={<Navigation currentPage="endpoints" />}
          listComponent={
            <FilterList
              filterItems={this.getFilterItems()}
              selectionLabel="endpoint"
              loading={this.props.endpointStore.loading}
              items={this.props.endpointStore.endpoints}
              onItemClick={item => { this.handleItemClick(item) }}
              onReloadButtonClick={() => { this.handleReloadButtonClick() }}
              actions={BulkActions}
              onActionChange={(items, action) => { this.handleActionChange(items, action) }}
              itemFilterFunction={(...args) => this.itemFilterFunction(...args)}
              renderItemComponent={options =>
                (<EndpointListItem
                  {...options}
                  getUsage={endpoint => this.getEndpointUsage(endpoint)}
                />)
              }
            />
          }
          headerComponent={
            <PageHeader
              title="Coriolis Endpoints"
              onProjectChange={project => { this.handleProjectChange(project) }}
            />
          }
        />
        <AlertModal
          isOpen={this.state.showDeleteEndpointsConfirmation}
          title="Delete Endpoints?"
          message="Are you sure you want to delete the selected endpoints?"
          extraMessage="Deleting a Coriolis Cloud Endpoint is permanent!"
          onConfirmation={() => { this.handleDeleteEndpointsConfirmation() }}
          onRequestClose={() => { this.handleCloseDeleteEndpointsConfirmation() }}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(EndpointsPage)
