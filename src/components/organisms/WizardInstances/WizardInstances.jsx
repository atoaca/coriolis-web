import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

import { LoadingAnimation, Checkbox, SearchInput, ReloadButton, Arrow, StatusIcon } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import instanceImage from './images/instance.svg'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const LoadingWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const InstancesWrapper = styled.div`
  margin-left: -32px;
  flex-grow: 1;
`
const InstanceContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  margin-left: 16px;
  border-top: 1px solid ${Palette.grayscale[1]};
  transition: background ${StyleProps.animations.swift};

  &:hover {
    background: ${Palette.grayscale[1]};
  }
`
const CheckboxStyled = styled(Checkbox) `
  opacity: 0;
  transition: all ${StyleProps.animations.swift};
`
const Instance = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;

  ${CheckboxStyled} {
    ${props => props.selected ? 'opacity: 1;' : ''}
  }

  &:hover ${CheckboxStyled} {
    opacity: 1;
  }

  &:last-child ${InstanceContent} {
    border-bottom: 1px solid ${Palette.grayscale[1]};
  }
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
const Label = styled.div`
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0 16px;
`
const Details = styled.div`
  font-size: 14px;
  color: ${Palette.grayscale[4]};
`
const FiltersWrapper = styled.div`
  padding: 8px 0 0 8px;
  min-height: 24px;
  margin-bottom: 16px;
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
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 64px;
  margin-top: 32px;
`
const Page = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${Palette.grayscale[3]};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  ${props => props.previous ? css`
    border-top-left-radius: ${StyleProps.borderRadius};
    border-bottom-left-radius: ${StyleProps.borderRadius};
    padding-top: 2px;
    height: 28px;
  ` : ''}
  ${props => props.number ? css`
    border-top: 1px solid ${Palette.grayscale[3]};
    border-bottom: 1px solid ${Palette.grayscale[3]};
    border-left: 1px solid white;
    border-right: 1px solid white;
    cursor: default;
  ` : ''}
  ${props => props.next ? css`
    border-top-right-radius: ${StyleProps.borderRadius};
    border-bottom-right-radius: ${StyleProps.borderRadius};
  ` : ''}
`
const Reloading = styled.div`
  margin: 32px auto 0 auto;
  flex-grow: 1;
`

class WizardInstances extends React.Component {
  static propTypes = {
    instances: PropTypes.array,
    selectedInstances: PropTypes.array,
    currentPage: PropTypes.number,
    loading: PropTypes.bool,
    searching: PropTypes.bool,
    loadingPage: PropTypes.bool,
    hasNextPage: PropTypes.bool,
    reloading: PropTypes.bool,
    onSearchInputChange: PropTypes.func,
    onNextPageClick: PropTypes.func,
    onPreviousPageClick: PropTypes.func,
    onReloadClick: PropTypes.func,
    onInstanceClick: PropTypes.func,
  }

  constructor() {
    super()

    this.state = {
      searchText: '',
    }
  }

  handleSeachInputChange(searchText) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({ searchText })
      this.props.onSearchInputChange(searchText)
    }, 500)
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
    if (this.props.reloading) {
      return (
        <Reloading>
          <LoadingAnimation />
        </Reloading>
      )
    }

    if (this.props.loading) {
      return null
    }

    return (
      <InstancesWrapper>
        {this.props.instances.map(instance => {
          let selected = Boolean(this.props.selectedInstances && this.props.selectedInstances.find(i => i.id === instance.id))
          let flavorName = instance.flavor_name ? ` | ${instance.flavor_name}` : ''
          return (
            <Instance
              key={instance.id}
              onClick={() => { this.props.onInstanceClick(instance) }}
              selected={selected}
            >
              <CheckboxStyled checked={selected} onChange={() => {}} />
              <InstanceContent>
                <Image />
                <Label>{instance.name}</Label>
                <Details>{`${instance.num_cpu} vCPU | ${instance.memory_mb} MB RAM${flavorName}`}</Details>
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

    let count = this.props.selectedInstances ? this.props.selectedInstances.length : 0
    let plural = count === 1 ? '' : 's'

    return (
      <FiltersWrapper>
        <SearchInput
          alwaysOpen
          onChange={searchText => { this.handleSeachInputChange(searchText) }}
          loading={this.props.searching}
          placeholder="Search VMs"
        />
        <FilterInfo>
          <SelectionInfo>{count} instance{plural} selected</SelectionInfo>
          <FilterSeparator>|</FilterSeparator>
          <ReloadButton onClick={() => { this.props.onReloadClick(this.state.searchText) }} />
        </FilterInfo>
      </FiltersWrapper>
    )
  }

  renderPagination() {
    if (this.props.loading) {
      return null
    }

    let areAllDisabled = this.props.searching || this.props.loadingPage
    let isPreviousDisabled = this.props.currentPage === 1 || areAllDisabled
    let isNextDisabled = !this.props.hasNextPage || areAllDisabled

    return (
      <Pagination>
        <Page
          previous
          disabled={isPreviousDisabled}
          onClick={() => { if (!isPreviousDisabled) { this.props.onPreviousPageClick() } }}
        >
          <Arrow orientation="left" disabled={isPreviousDisabled} />
        </Page>
        <Page number>
          {this.props.loadingPage ? <StatusIcon status="RUNNING" secondary /> : this.props.currentPage}
        </Page>
        <Page
          next
          onClick={() => { if (!isNextDisabled) { this.props.onNextPageClick(this.state.searchText) } }}
          disabled={isNextDisabled}
        >
          <Arrow disabled={isNextDisabled} />
        </Page>
      </Pagination>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderFilters()}
        {this.renderLoading()}
        {this.renderInstances()}
        {this.renderPagination()}
      </Wrapper>
    )
  }
}

export default WizardInstances