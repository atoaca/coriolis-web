import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import { EndpointLogos, CopyButton, Table } from 'components'

import NotificationActions from '../../../actions/NotificationActions'
import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import Clipboard from '../../../utils/Clipboard'

import arrowImage from './images/arrow.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const ColumnsLayout = styled.div`
  display: flex;
`
const Column = styled.div`
  width: ${props => props.small ? '160px' : '320px'};
`
const Arrow = styled.div`
  width: 34px;
  height: 24px;
  background: url('${arrowImage}') center no-repeat;
  margin-top: 68px;
`
const Row = styled.div`
  margin-bottom: ${props => props.marginBottom ? 32 : 16}px;
`
const Field = styled.div`
  display: flex;
  flex-direction: column;
`
const Label = styled.div`
  font-size: 10px;
  color: ${Palette.grayscale[3]};
  font-weight: ${StyleProps.fontWeights.medium};
  text-transform: uppercase;
`
const Value = styled.div`
  display: inline-table;
  margin-top: 3px;
  ${props => props.link ? `color: ${Palette.primary};` : ''}
  ${props => props.link || props.pointer ? 'cursor: pointer;' : ''}
  ${props => props.capitalize ? 'text-transform: capitalize;' : ''}

   & > span:first-child {
    width: 192px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
   }

    &:hover > span:last-child {
      opacity: 1;
    }
`
const TableStyled = styled(Table)`
  width: 800px;
  margin-top: 89px;
`

class MainDetails extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    endpoints: PropTypes.array,
  }

  getSourceEndpoint() {
    let endpoint = this.props.endpoints.find(e => e.id === this.props.item.origin_endpoint_id)
    return endpoint || {}
  }

  getDestinationEndpoint() {
    let endpoint = this.props.endpoints.find(e => e.id === this.props.item.destination_endpoint_id)
    return endpoint || {}
  }

  getLastExecution() {
    if (this.props.item.executions && this.props.item.executions.length) {
      return this.props.item.executions[this.props.item.executions.length - 1]
    }

    return {}
  }

  getLastExecutionTime() {
    let lastExecution = this.getLastExecution()
    if (lastExecution) {
      return moment(lastExecution.updated_at).format('YYYY-MM-DD HH:mm:ss')
    }

    return '-'
  }

  getConnectedVms(networkId) {
    let vms = []
    Object.keys(this.props.item.info).forEach(key => {
      let instance = this.props.item.info[key]
      if (instance.export_info && instance.export_info.devices.nics.length) {
        instance.export_info.devices.nics.forEach(nic => {
          if (nic.network_name === networkId) {
            vms.push(key)
          }
        })
      }
    })

    return vms.length === 0 ? '-' : vms
  }

  getNetworks() {
    if (!this.props.item || !this.props.item.destination_environment) {
      return null
    }
    let networks = []
    Object.keys(this.props.item.destination_environment.network_map).forEach(key => {
      let newItem
      if (typeof this.props.item.destination_environment.network_map[key] === 'object') {
        newItem = [
          this.props.item.destination_environment.network_map[key].source_network,
          this.getConnectedVms(key),
          this.props.item.destination_environment.network_map[key].destination_network,
          'Existing network',
        ]
      } else {
        newItem = [
          key,
          this.getConnectedVms(key),
          this.props.item.destination_environment.network_map[key],
          'Existing network',
        ]
      }
      networks.push(newItem)
    })

    return networks
  }

  handleCopyIdClick() {
    let succesful = Clipboard.copyTextToClipboard(this.props.item.id)

    if (succesful) {
      NotificationActions.notify('The ID has been copied to clipboard.')
    } else {
      NotificationActions.notify('The ID couldn\'t be copied', 'error')
    }
  }

  renderNetworksTable() {
    let items = this.getNetworks()

    if (!items || !items.length) {
      return null
    }

    return (
      <TableStyled
        header={['Source Network', 'Connected VMs', 'Destination Network', 'Destination Type']}
        items={items}
        columnsStyle={[css`color: ${Palette.black};`]}
      />
    )
  }

  render() {
    return (
      <Wrapper>
        <ColumnsLayout>
          <Column>
            <Row>
              <Field>
                <Label>Source</Label>
                <Value link>{this.getSourceEndpoint().name}</Value>
              </Field>
            </Row>
            <Row>
              <EndpointLogos endpoint={this.getSourceEndpoint().type} />
            </Row>
            <Row marginBottom>
              <Field>
                <Label>Id</Label>
                <Value
                  pointer
                  onClick={() => this.handleCopyIdClick()}
                  onMouseDown={e => e.stopPropagation()}
                  onMouseUp={e => e.stopPropagation()}
                >
                  <span>{this.props.item.id}</span><CopyButton />
                </Value>
              </Field>
            </Row>
            <Row>
              <Field>
                <Label>Created</Label>
                <Value>{moment(this.props.item.created_at).format('YYYY-MM-DD HH:mm:ss')}</Value>
              </Field>
            </Row>
          </Column>
          <Column small>
            <Arrow />
          </Column>
          <Column>
            <Row>
              <Field>
                <Label>Target</Label>
                <Value link>{this.getDestinationEndpoint().name}</Value>
              </Field>
            </Row>
            <Row>
              <EndpointLogos endpoint={this.getDestinationEndpoint().type} />
            </Row>
            <Row marginBottom>
              <Field>
                <Label>Type</Label>
                <Value capitalize>Coriolis {this.props.item.type}</Value>
              </Field>
            </Row>
            <Row>
              <Field>
                <Label>Last Updated</Label>
                <Value>{this.getLastExecutionTime()}</Value>
              </Field>
            </Row>
          </Column>
        </ColumnsLayout>
        {this.renderNetworksTable()}
      </Wrapper>
    )
  }
}

export default MainDetails
