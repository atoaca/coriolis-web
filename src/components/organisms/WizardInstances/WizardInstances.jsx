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
  padding: 8px 16px 8px 0;
  margin-left: 16px;
  border-top: 1px solid ${Palette.grayscale[1]};
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

class WizardInstances extends React.Component {
  static propTypes = {
    instances: PropTypes.array,
    currentPage: PropTypes.number,
    loading: PropTypes.bool,
    searching: PropTypes.bool,
    loadingPage: PropTypes.bool,
    hasNextPage: PropTypes.bool,
    onSearchInputChange: PropTypes.func,
    onNextPageClick: PropTypes.func,
    onPreviousPageClick: PropTypes.func,
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
    if (this.props.loading) {
      return null
    }

    return (
      <InstancesWrapper>
        {this.props.instances.map(instance => {
          return (
            <Instance key={instance.id}>
              <CheckboxStyled />
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
        <SearchInput
          alwaysOpen
          onChange={searchText => { this.handleSeachInputChange(searchText) }}
          loading={this.props.searching}
          placeholder="Search VMs"
        />
        <FilterInfo>
          <SelectionInfo>0 instances selected</SelectionInfo>
          <FilterSeparator>|</FilterSeparator>
          <ReloadButton />
        </FilterInfo>
      </FiltersWrapper>
    )
  }

  renderPagination() {
    if (this.props.loading) {
      return null
    }

    return (
      <Pagination>
        <Page
          previous
          disabled={this.props.currentPage === 1}
          onClick={() => { if (this.props.currentPage > 1) { this.props.onPreviousPageClick() } }}
        >
          <Arrow orientation="left" disabled={this.props.currentPage === 1} />
        </Page>
        <Page number>
          {this.props.loadingPage ? <StatusIcon status="RUNNING" secondary /> : this.props.currentPage}
        </Page>
        <Page
          next
          onClick={() => { if (this.props.hasNextPage) { this.props.onNextPageClick(this.state.searchText) } }}
          disabled={!this.props.hasNextPage}
        >
          <Arrow disabled={!this.props.hasNextPage} />
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
