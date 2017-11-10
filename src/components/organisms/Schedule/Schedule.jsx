import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Switch, Dropdown, Button, DatetimePicker, ReplicaExecutionOptions, Modal, DropdownLink } from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import NotificationActions from '../../../actions/NotificationActions'

import deleteImage from './images/delete.svg'
import deleteHoverImage from './images/delete-hover.svg'

const Wrapper = styled.div`
  width: 100%;
`
const Table = styled.div``
const Header = styled.div`
  display: flex;
  margin-bottom: 4px;
`
const HeaderData = styled.div`
  width: ${props => props.width};
  font-size: 10px;
  font-weight: ${StyleProps.fontWeights.medium};
  color: ${Palette.grayscale[5]};
  text-transform: uppercase;
`
const Body = styled.div``
const Row = styled.div`
  display: flex;
  border-top: 1px solid ${Palette.grayscale[1]};
  padding: 16px 0;
  position: relative;
  &:last-child {
    border-bottom: 1px solid ${Palette.grayscale[1]};
  }
`
const DeleteButton = styled.div`
  width: 16px;
  height: 16px;
  background: url('${deleteImage}') center no-repeat;
  position: absolute;
  cursor: pointer;
  right: -32px;
  top: 24px;

  &:hover {
    background: url('${deleteHoverImage}') center no-repeat;
  }
`
const RowData = styled.div`
  width: ${props => props.width};
`
const NoSchedules = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const NoSchedulesMessage = styled.div`
  font-size: 16px;
  margin-bottom: 32px;
`
const DropdownStyled = styled(Dropdown) `
  font-size: 11px;
`
const Label = styled.div`
  background: ${Palette.grayscale[7]};
  height: 100%;
  font-size: 11px;
  margin-right: 8px;
  border-radius: ${StyleProps.borderRadius};
  padding: 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  line-height: 35px;
  margin-bottom: -8px;
`
const Footer = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Timezone = styled.div`
  display: flex;
  align-items: center;
`
const TimezoneLabel = styled.div`
  margin-right: 4px;
`

const colWidths = ['6%', '16%', '16%', '16%', '9%', '9%', '22%', '6%']
const daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
class Schedule extends React.Component {
  static propTypes = {
    schedules: PropTypes.array,
    timezone: PropTypes.string,
    onTimezoneChange: PropTypes.func,
    onAddScheduleClick: PropTypes.func,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
  }

  constructor() {
    super()

    this.state = {
      showOptionsModal: false,
      selectedSchedule: null,
      executionOptions: null,
    }
  }

  getFieldValue(schedule, items, fieldName, zeroBasedIndex) {
    if (schedule === null || schedule === undefined || schedule[fieldName] === null || schedule[fieldName] === undefined) {
      return items[0]
    }

    if (zeroBasedIndex) {
      return items[schedule[fieldName] + 1]
    }

    return items[schedule[fieldName]]
  }

  padNumber(number) {
    if (number < 10) {
      return `0${number}`
    }

    return number
  }

  handleShowOptions(selectedSchedule) {
    this.setState({ showOptionsModal: true, executionOptions: selectedSchedule, selectedSchedule })
  }

  handleCloseOptionsModal() {
    this.setState({ showOptionsModal: false })
  }

  handleOptionsSave(fields) {
    this.setState({ showOptionsModal: false })
    let options = {}
    fields.forEach(f => {
      options[f.name] = f.value || false
    })

    this.props.onChange(this.state.selectedSchedule.id, options)
  }

  handleExecutionOptionsChange(fieldName, value) {
    let options = this.state.executionOptions
    if (!options) {
      options = {}
    }
    options = {
      ...options,
    }
    options[fieldName] = value

    this.setState({ executionOptions: options })
  }

  handleMonthChange(s, item) {
    let month = item.value || 1
    let maxNumDays = daysInMonths[month - 1]
    let change = { schedule: { month: item.value } }
    if (s.schedule && s.schedule.dom && s.schedule.dom > maxNumDays) {
      change.schedule.dom = maxNumDays
    }

    this.props.onChange(s.id, change)
  }

  handleExpirationDateChange(s, date) {
    if (moment(date).diff(new Date(), 'minutes') < 60) {
      NotificationActions.notify('Please select a further expiration date.', 'error')
      return
    }

    this.props.onChange(s.id, { expiration_date: date.toDate() })
  }

  renderHeader() {
    let headerLabels = ['Run', 'Month', 'Day of month', 'Day of week', 'Hour', 'Minute', 'Until', 'Options']

    return (
      <Header>
        {headerLabels.map((l, i) => {
          return <HeaderData key={l} width={colWidths[i]}>{l}</HeaderData>
        })}
      </Header>
    )
  }

  renderLabel(value) {
    return <Label>{value.label}</Label>
  }

  renderMonthValue(s) {
    let items = [{ label: 'Any', value: null }]
    let months = moment.months()
    months.forEach((label, value) => {
      items.push({ label, value: value + 1 })
    })

    if (s.enabled) {
      return this.renderLabel(this.getFieldValue(s.schedule, items, 'month'))
    }

    return (
      <DropdownStyled
        centered
        width={120}
        items={items}
        selectedItem={this.getFieldValue(s.schedule, items, 'month')}
        onChange={item => { this.handleMonthChange(s, item) }}
      />
    )
  }

  renderDayOfMonthValue(s) {
    let month = (s.schedule && s.schedule.month) || 1
    let items = [{ label: 'Any', value: null }]
    for (let i = 1; i <= daysInMonths[month - 1]; i += 1) {
      items.push({ label: i, value: i })
    }

    if (s.enabled) {
      return this.renderLabel(this.getFieldValue(s.schedule, items, 'dom'))
    }

    return (
      <DropdownStyled
        centered
        width={120}
        items={items}
        selectedItem={this.getFieldValue(s.schedule, items, 'dom')}
        onChange={item => { this.props.onChange(s.id, { schedule: { dom: item.value } }) }}
      />
    )
  }

  renderDayOfWeekValue(s) {
    let items = [{ label: 'Any', value: null }]
    let days = moment.weekdays(true)
    days.forEach((label, value) => {
      items.push({ label, value })
    })

    if (s.enabled) {
      return this.renderLabel(this.getFieldValue(s.schedule, items, 'dow'))
    }

    return (
      <DropdownStyled
        centered
        width={120}
        items={items}
        selectedItem={this.getFieldValue(s.schedule, items, 'dow', true)}
        onChange={item => { this.props.onChange(s.id, { schedule: { dow: item.value } }) }}
      />
    )
  }

  renderHourValue(s) {
    let items = [{ label: 'Any', value: null }]
    for (let i = 0; i <= 23; i += 1) {
      items.push({ label: this.padNumber(i), value: i })
    }

    if (s.enabled) {
      return this.renderLabel(this.getFieldValue(s.schedule, items, 'hour'))
    }

    return (
      <DropdownStyled
        centered
        width={64}
        items={items}
        selectedItem={this.getFieldValue(s.schedule, items, 'hour', true)}
        onChange={item => { this.props.onChange(s.id, { schedule: { hour: item.value } }) }}
      />
    )
  }

  renderMinuteValue(s) {
    let items = [{ label: 'Any', value: null }]
    for (let i = 0; i <= 59; i += 1) {
      items.push({ label: this.padNumber(i), value: i })
    }

    if (s.enabled) {
      return this.renderLabel(this.getFieldValue(s.schedule, items, 'minute'))
    }

    return (
      <DropdownStyled
        centered
        width={64}
        items={items}
        selectedItem={this.getFieldValue(s.schedule, items, 'minute', true)}
        onChange={item => { this.props.onChange(s.id, { schedule: { minute: item.value } }) }}
      />
    )
  }

  renderExpirationValue(s) {
    let momentInstance = moment
    if (this.props.timezone === 'utc') {
      momentInstance = moment.utc
    }

    let date = s.expiration_date && momentInstance(s.expiration_date)

    if (s.enabled) {
      return this.renderLabel({ label: (date && date.format('DD/MM/YYYY hh:mm A')) || '-' })
    }

    return (
      <DatetimePicker
        value={date}
        onChange={date => { this.handleExpirationDateChange(s, date) }}
      />
    )
  }

  renderBody() {
    return (
      <Body>
        {this.props.schedules.map((s, i) => {
          return (
            <Row key={i}>
              <RowData width={colWidths[0]}>
                <Switch
                  noLabel
                  height={16}
                  checked={s.enabled !== null && s.enabled !== undefined ? s.enabled : false}
                  onChange={enabled => { this.props.onChange(s.id, { enabled }) }}
                />
              </RowData>
              <RowData width={colWidths[1]}>
                {this.renderMonthValue(s)}
              </RowData>
              <RowData width={colWidths[2]}>
                {this.renderDayOfMonthValue(s)}
              </RowData>
              <RowData width={colWidths[3]}>
                {this.renderDayOfWeekValue(s)}
              </RowData>
              <RowData width={colWidths[4]}>
                {this.renderHourValue(s)}
              </RowData>
              <RowData width={colWidths[5]}>
                {this.renderMinuteValue(s)}
              </RowData>
              <RowData width={colWidths[6]}>
                {this.renderExpirationValue(s)}
              </RowData>
              <RowData width={colWidths[7]}>
                <Button
                  onClick={() => { this.handleShowOptions(s) }}
                  secondary
                  width="48px"
                >...</Button>
              </RowData>
              <DeleteButton onClick={() => { this.props.onRemove(s.id) }} />
            </Row>
          )
        })}
      </Body>
    )
  }

  renderTable() {
    if (!this.props.schedules || this.props.schedules.length === 0) {
      return null
    }

    return (
      <Table>
        {this.renderHeader()}
        {this.renderBody()}
      </Table>
    )
  }

  renderNoSchedules() {
    if (this.props.schedules && this.props.schedules.length > 0) {
      return null
    }

    return (
      <NoSchedules>
        <NoSchedulesMessage>There is no schedule added.</NoSchedulesMessage>
        <Button onClick={this.props.onAddScheduleClick}>Add Schedule</Button>
      </NoSchedules>
    )
  }

  renderFooter() {
    if (!this.props.schedules || this.props.schedules.length === 0) {
      return null
    }

    let timezoneItems = [
      { label: 'Local Time', value: 'local' },
      { label: 'UTC', value: 'utc' },
    ]

    return (
      <Footer>
        <Button secondary onClick={this.props.onAddScheduleClick}>Add Schedule</Button>
        <Timezone>
          <TimezoneLabel>Show all times in</TimezoneLabel>
          <DropdownLink
            items={timezoneItems}
            selectedItem={this.props.timezone}
            onChange={this.props.onTimezoneChange}
          />
        </Timezone>
      </Footer>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderTable()}
        {this.renderFooter()}
        {this.renderNoSchedules()}
        <Modal
          isOpen={this.state.showOptionsModal}
          title="Execution options"
          onRequestClose={() => { this.handleCloseOptionsModal() }}
        >
          <ReplicaExecutionOptions
            options={this.state.executionOptions}
            onChange={(fieldName, value) => { this.handleExecutionOptionsChange(fieldName, value) }}
            executionLabel="Save"
            onCancelClick={() => { this.handleCloseOptionsModal() }}
            onExecuteClick={fields => { this.handleOptionsSave(fields) }}
          />
        </Modal>
      </Wrapper>
    )
  }
}

export default Schedule
