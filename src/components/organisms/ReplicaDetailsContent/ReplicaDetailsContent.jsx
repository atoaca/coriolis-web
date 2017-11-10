import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { DetailsNavigation, MainDetails, Button, Executions, Schedule } from 'components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

const Buttons = styled.div`
  & > button:last-child {
    float: right;
  }
`
const DetailsBody = styled.div`
  min-width: 800px;
  max-width: 800px;
`

const NavigationItems = [
  {
    label: 'Replica',
    value: '',
  }, {
    label: 'Executions',
    value: 'executions',
  }, {
    label: 'Schedule',
    value: 'schedule',
  },
]

class ReplicaDetailsContent extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    endpoints: PropTypes.array,
    scheduleStore: PropTypes.object,
    page: PropTypes.string,
    onCancelExecutionClick: PropTypes.func,
    onDeleteExecutionClick: PropTypes.func,
    onExecuteClick: PropTypes.func,
    onCreateMigrationClick: PropTypes.func,
    onDeleteReplicaClick: PropTypes.func,
    onAddScheduleClick: PropTypes.func,
    onScheduleChange: PropTypes.func,
    onScheduleRemove: PropTypes.func,
  }

  constructor() {
    super()

    this.state = {
      timezone: 'local',
    }
  }

  getLastExecution() {
    return this.props.item.executions && this.props.item.executions.length
      && this.props.item.executions[this.props.item.executions.length - 1]
  }

  getStatus() {
    let lastExecution = this.getLastExecution()
    return lastExecution && lastExecution.status
  }

  handleTimezoneChange(timezone) {
    this.setState({ timezone: timezone.value })
  }

  handleDetailsNavigationChange(item) {
    window.location.href = `/#/replica${(item.value && '/') || ''}${item.value}/${this.props.item.id}`
  }

  isEndpointMissing() {
    let originEndpoint = this.props.endpoints.find(e => e.id === this.props.item.origin_endpoint_id)
    let targetEndpoint = this.props.endpoints.find(e => e.id === this.props.item.destination_endpoint_id)

    return Boolean(!originEndpoint || !targetEndpoint)
  }

  renderBottomControls() {
    return (
      <Buttons>
        <Button
          primary
          disabled={this.getStatus() !== 'COMPLETED' || this.isEndpointMissing()}
          onClick={this.props.onCreateMigrationClick}
        >Create Migration</Button>
        <Button
          alert
          hollow
          onClick={this.props.onDeleteReplicaClick}
        >Delete Replica</Button>
      </Buttons>
    )
  }

  renderMainDetails() {
    if (this.props.page !== '') {
      return null
    }

    return (
      <MainDetails
        item={this.props.item}
        endpoints={this.props.endpoints}
        bottomControls={this.renderBottomControls()}
      />
    )
  }

  renderExecutions() {
    if (this.props.page !== 'executions') {
      return null
    }

    return (
      <Executions
        item={this.props.item}
        onCancelExecutionClick={this.props.onCancelExecutionClick}
        onDeleteExecutionClick={this.props.onDeleteExecutionClick}
        onExecuteClick={this.props.onExecuteClick}
      />
    )
  }

  renderSchedule() {
    if (this.props.page !== 'schedule') {
      return null
    }

    return (
      <Schedule
        schedules={this.props.scheduleStore.schedules}
        adding={this.props.scheduleStore.adding}
        loading={this.props.scheduleStore.loading}
        onAddScheduleClick={this.props.onAddScheduleClick}
        onChange={this.props.onScheduleChange}
        onRemove={this.props.onScheduleRemove}
        timezone={this.state.timezone}
        onTimezoneChange={timezone => { this.handleTimezoneChange(timezone) }}
      />
    )
  }

  render() {
    return (
      <Wrapper>
        <DetailsNavigation
          items={NavigationItems}
          selectedValue={this.props.page}
          onChange={item => this.handleDetailsNavigationChange(item)}
        />
        <DetailsBody>
          {this.renderMainDetails()}
          {this.renderExecutions()}
          {this.renderSchedule()}
        </DetailsBody>
      </Wrapper>
    )
  }
}

export default ReplicaDetailsContent
