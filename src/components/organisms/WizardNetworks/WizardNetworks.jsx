import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { LoadingAnimation, Dropdown } from 'components'

import Palette from '../../styleUtils/Palette'

import networkImage from './images/network.svg'
import arrowImage from './images/arrow.svg'

const Wrapper = styled.div`
  width: 100%;
`
const LoadingWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const LoadingText = styled.div`
  margin-top: 38px;
  font-size: 18px;
`
const NicsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Nic = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${Palette.grayscale[1]};
  padding: 8px 0;

  &:last-child {
    border-bottom: 1px solid ${Palette.grayscale[1]};
  }
`
const NetworkImage = styled.div`
  width: 48px;
  height: 48px;
  background: url('${networkImage}') center no-repeat;
  margin-right: 16px;
`
const NetworkTitle = styled.div``
const NetworkName = styled.div`
  font-size: 16px;
`
const NetworkSubtitle = styled.div`
  font-size: 12px;
  color: ${Palette.grayscale[5]};
  margin-top: 1px;
`
const ArrowImage = styled.div`
  width: 32px;
  height: 16px;
  background: url('${arrowImage}') center no-repeat;
  flex-grow: 1;
`
const NoNicsMessage = styled.div`
  text-align: center;
`

class WizardNetworks extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    loadingInstancesDetails: PropTypes.bool,
    networks: PropTypes.array,
    instancesDetails: PropTypes.array,
    selectedNetworks: PropTypes.array,
    onChange: PropTypes.func,
  }

  isLoading() {
    return this.props.loadingInstancesDetails || this.props.loading
  }

  renderLoading() {
    if (!this.isLoading()) {
      return null
    }

    return (
      <LoadingWrapper>
        <LoadingAnimation />
        <LoadingText>Loading networks...</LoadingText>
      </LoadingWrapper>
    )
  }

  renderNoNics() {
    let singular = this.props.instancesDetails.length === 1
    let message = singular ? 'The selected instance has no NICs.' : 'The selected instances have no NICs.'

    return (
      <NoNicsMessage>{message}</NoNicsMessage>
    )
  }

  renderNics() {
    if (this.isLoading()) {
      return null
    }
    let nics = []
    this.props.instancesDetails.forEach(instance => {
      if (!instance.devices || !instance.devices.nics) {
        return
      }
      instance.devices.nics.forEach(nic => {
        if (nics.find(n => n.id === nic.id)) {
          return
        }
        nics.push(nic)
      })
    })

    if (nics.length === 0) {
      return this.renderNoNics()
    }

    return (
      <NicsWrapper>
        {nics.map(nic => {
          let connectedTo = this.props.instancesDetails.filter(i => {
            if (!i.devices || !i.devices.nics) {
              return false
            }
            if (i.devices.nics.find(n => n.id === nic.id)) {
              return true
            }
            return false
          }).map(i => i.instance_name)
          let selectedNetworkName = this.props.selectedNetworks && this.props.selectedNetworks.find(n => n.sourceNic.id === nic.id)
          if (selectedNetworkName) {
            selectedNetworkName = selectedNetworkName.targetNetwork.name
          }
          return (
            <Nic key={nic.id}>
              <NetworkImage />
              <NetworkTitle>
                <NetworkName>{nic.network_name}</NetworkName>
                <NetworkSubtitle>{`Connected to ${connectedTo.join(', ')}`}</NetworkSubtitle>
              </NetworkTitle>
              <ArrowImage />
              <Dropdown
                large
                centered
                noSelectionMessage="Select ..."
                noItemsMessage="No networks found"
                selectedItem={selectedNetworkName}
                items={this.props.networks}
                labelField="name"
                onChange={item => { this.props.onChange(nic, item) }}
              />
            </Nic>
          )
        })}
      </NicsWrapper>
    )
  }

  render() {
    console.log('this.props.instancesDetails', this.props.instancesDetails)
    return (
      <Wrapper>
        {this.renderLoading()}
        {this.renderNics()}
      </Wrapper>
    )
  }
}

export default WizardNetworks
