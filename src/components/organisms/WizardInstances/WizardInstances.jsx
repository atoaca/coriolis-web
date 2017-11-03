import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { LoadingAnimation, Checkbox, SearchInput, ReloadButton } from 'components'

import Palette from '../../styleUtils/Palette'

import instanceImage from './images/instance.svg'

const Wrapper = styled.div`
  width: 100%;
`
const LoadingWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-top: 32px;
  flex-direction: column;
`
const InstancesWrapper = styled.div``
const Instance = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`
const InstanceContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`
const LoadingText = styled.div`
  margin-top: 38px;
  font-size: 18px;
`
const Image = styled.div`
  width: 48px;
  height: 48px;
  background: url('${instanceImage}') center no-repeat;
`
const Label = styled.div``
const Details = styled.div``
const FiltersWrapper = styled.div`
  padding: 8px 0 0 8px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
`
const FilterInfo = styled.div`
  display: flex;
  color: ${Palette.grayscale[4]};
`
const SelectionInfo = styled.div``
const FilterSeparator = styled.div`
  margin: 0 14px 0 16px;
`

class WizardInstances extends React.Component {
  static propTypes = {
    instances: PropTypes.array,
    loading: PropTypes.bool,
  }

  renderLoading() {
    if (!this.props.loading) {
      return null
    }

    return (
      <LoadingWrapper>
        <LoadingAnimation />
        <LoadingText>Loading instances...</LoadingText>
      </LoadingWrapper>
    )
  }

  renderInstances() {
    if (this.props.loading) {
      return null
    }

    return (
      <InstancesWrapper>
        {this.props.instances.map(instance => {
          return (
            <Instance key={instance.id}>
              <Checkbox />
              <InstanceContent>
                <Image />
                <Label>{instance.name}</Label>
                <Details>{`${instance.num_cpu} vCPU | ${instance.memory_mb} MB RAM | ${instance.flavor_name}`}</Details>
              </InstanceContent>
            </Instance>
          )
        })}
      </InstancesWrapper>
    )
  }

  renderFilters() {
    if (this.props.loading) {
      return null
    }

    return (
      <FiltersWrapper>
        <SearchInput alwaysOpen />
        <FilterInfo>
          <SelectionInfo>0 instances selected</SelectionInfo>
          <FilterSeparator>|</FilterSeparator>
          <ReloadButton />
        </FilterInfo>
      </FiltersWrapper>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderFilters()}
        {this.renderLoading()}
        {this.renderInstances()}
      </Wrapper>
    )
  }
}

export default WizardInstances
