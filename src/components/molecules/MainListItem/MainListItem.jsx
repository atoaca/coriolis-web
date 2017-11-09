import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Checkbox, StatusPill, EndpointLogos } from 'components'
import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'
import DateUtils from '../../../utils/DateUtils'

import arrowImage from './images/arrow.svg'

const CheckboxStyled = styled(Checkbox) `
  opacity: ${props => props.checked ? 1 : 0};
  transition: all ${StyleProps.animations.swift};
`
const Content = styled.div`
  display: flex;
  align-items: center;
  margin-left: 32px;
  border-top: 1px solid ${Palette.grayscale[1]};
  padding: 8px 16px;
  cursor: pointer;
  flex-grow: 1;
  transition: all ${StyleProps.animations.swift};
  min-width: 785px;

  &:hover {
    background: ${Palette.grayscale[1]};
  }
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;

  &:hover ${CheckboxStyled} {
    opacity: 1;
  }

  &:last-child ${Content} {
    border-bottom: 1px solid ${Palette.grayscale[1]};
  }
`

const Image = styled.div`
  min-width: 48px;
  height: 48px;
  background: url('${props => props.image}') no-repeat center;
  margin-right: 16px;
`
const Title = styled.div`
  flex-grow: 1;
  overflow: hidden;
  margin-right: 48px;
  min-width: 100px;
`
const TitleLabel = styled.div`
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const EndpointsImages = styled.div`
  display: flex;
  align-items: center;
  margin-right: 48px;
`
const EndpointImageArrow = styled.div`
  width: 16px;
  height: 16px;
  margin: 0 16px;
  background: url('${arrowImage}') center no-repeat;
`
const LastExecution = styled.div`
  min-width: 175px;
  margin-right: 25px;
`
const ItemLabel = styled.div`
  color: ${Palette.grayscale[4]};
`
const ItemValue = styled.div`
  color: ${Palette.primary};
`

const TasksRemaining = styled.div`
  min-width: 114px;
`

class MainListItem extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    image: PropTypes.string,
    endpointType: PropTypes.func,
    onSelectedChange: PropTypes.func,
  }

  getLastExecution() {
    if (this.props.item.executions && this.props.item.executions.length) {
      return this.props.item.executions[this.props.item.executions.length - 1]
    }

    if (typeof this.props.item.executions === 'undefined') {
      return this.props.item
    }

    return {}
  }

  getStatus() {
    let lastExecution = this.getLastExecution()
    if (lastExecution) {
      return lastExecution.status
    }

    return null
  }

  getLastExecutionTime() {
    let lastExecution = this.getLastExecution()
    if (lastExecution) {
      return DateUtils.getLocalTime(lastExecution.updated_at || lastExecution.created_at)
        .format('DD MMMM YYYY, HH:mm')
    }

    return null
  }

  getTasksRemaining() {
    let lastExecution = this.getLastExecution()

    if (!lastExecution || !lastExecution.tasks || lastExecution.tasks.length === 0) {
      return '-'
    }

    let unfinished = lastExecution.tasks.filter(task => task.status !== 'COMPLETED').length

    if (unfinished === 0) {
      return '-'
    }

    let total = lastExecution.tasks.length

    return `${unfinished} of ${total}`
  }

  renderLastExecution() {
    return (
      <LastExecution>
        <ItemLabel>
          {typeof this.props.item.executions !== 'undefined' ? 'Last Execution' : 'Created'}
        </ItemLabel>
        <ItemValue>
          {this.getLastExecutionTime()}
        </ItemValue>
      </LastExecution>
    )
  }

  render() {
    let sourceType = this.props.endpointType(this.props.item.origin_endpoint_id)
    let destinationType = this.props.endpointType(this.props.item.destination_endpoint_id)
    let endpointImages = (
      <EndpointsImages>
        <EndpointLogos height={32} endpoint={sourceType} />
        <EndpointImageArrow />
        <EndpointLogos height={32} endpoint={destinationType} />
      </EndpointsImages>
    )
    return (
      <Wrapper>
        <CheckboxStyled
          checked={this.props.selected}
          onChange={this.props.onSelectedChange}
        />
        <Content onClick={this.props.onClick}>
          <Image image={this.props.image} />
          <Title>
            <TitleLabel>{this.props.item.instances[0]}</TitleLabel>
            {this.getStatus() ? <StatusPill status={this.getStatus()} /> : null}
          </Title>
          {endpointImages}
          {this.renderLastExecution()}
          <TasksRemaining>
            <ItemLabel>Tasks Remaining</ItemLabel>
            <ItemValue>{this.getTasksRemaining()}</ItemValue>
          </TasksRemaining>
        </Content>
      </Wrapper>
    )
  }
}

export default MainListItem
