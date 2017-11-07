import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Switch, Dropdown, Button } from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'

import deleteImage from './images/delete.svg'

const Wrapper = styled.div`
  width: 100%;
`
const Table = styled.div``
const Header = styled.div`
  display: flex;
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
const colWidths = ['6%', '16%', '16%', '16%', '9%', '9%', '22%', '6%']

class Schedule extends React.Component {
  static propTypes = {
    schedules: PropTypes.array,
    onAddScheduleClick: PropTypes.func,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
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

  generateMonthItems() {
    let items = [{ label: 'Every Month', value: null }]
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    months.forEach((label, value) => {
      items.push({ label, value: value + 1 })
    })
    return items
  }

  generateMonthDayItems() {
    let items = [{ label: 'Every Day', value: null }]
    for (let i = 1; i <= 31; i += 1) {
      items.push({ label: i, value: i })
    }

    return items
  }

  generateWeekDayItems() {
    let items = [{ label: 'Every Day', value: null }]
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    days.forEach((label, value) => {
      items.push({ label, value })
    })
    return items
  }

  padNumber(number) {
    if (number < 10) {
      return `0${number}`
    }

    return number
  }

  generateHourItems() {
    let items = [{ label: 'Every Hour', value: null }]
    for (let i = 0; i <= 23; i += 1) {
      items.push({ label: this.padNumber(i), value: i })
    }
    return items
  }

  generateMinuteItems() {
    let items = [{ label: 'Every Minute', value: null }]
    for (let i = 0; i <= 59; i += 1) {
      items.push({ label: this.padNumber(i), value: i })
    }
    return items
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
                <DropdownStyled
                  width={120}
                  items={this.generateMonthItems()}
                  selectedItem={this.getFieldValue(s.schedule, this.generateMonthItems(), 'month')}
                  onChange={item => { this.props.onChange(s.id, { schedule: { month: item.value } }) }}
                />
              </RowData>
              <RowData width={colWidths[2]}>
                <DropdownStyled
                  width={120}
                  items={this.generateMonthDayItems()}
                  selectedItem={this.getFieldValue(s.schedule, this.generateMonthDayItems(), 'dom')}
                  onChange={item => { this.props.onChange(s.id, { schedule: { dom: item.value } }) }}
                />
              </RowData>
              <RowData width={colWidths[3]}>
                <DropdownStyled
                  width={120}
                  items={this.generateWeekDayItems()}
                  selectedItem={this.getFieldValue(s.schedule, this.generateWeekDayItems(), 'dow', true)}
                  onChange={item => { this.props.onChange(s.id, { schedule: { dow: item.value } }) }}
                />
              </RowData>
              <RowData width={colWidths[4]}>
                <DropdownStyled
                  width={64}
                  items={this.generateHourItems()}
                  selectedItem={this.getFieldValue(s.schedule, this.generateHourItems(), 'hour', true)}
                  onChange={item => { this.props.onChange(s.id, { schedule: { hour: item.value } }) }}
                />
              </RowData>
              <RowData width={colWidths[5]}>
                <DropdownStyled
                  width={64}
                  items={this.generateMinuteItems()}
                  selectedItem={this.getFieldValue(s.schedule, this.generateMinuteItems(), 'minute', true)}
                  onChange={item => { this.props.onChange(s.id, { schedule: { minute: item.value } }) }}
                />
              </RowData>
              <RowData width={colWidths[6]}><DropdownStyled width={160} /></RowData>
              <RowData width={colWidths[7]}><Button secondary width="48px">...</Button></RowData>
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

  render() {
    return (
      <Wrapper>
        {this.renderTable()}
        {this.renderNoSchedules()}
      </Wrapper>
    )
  }
}

export default Schedule
