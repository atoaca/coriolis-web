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

// @flow

import React from 'react'
import { observer } from 'mobx-react'
import styled, { css } from 'styled-components'

import Checkbox from '../../atoms/Checkbox'
import ReloadButton from '../../atoms/ReloadButton'
import Arrow from '../../atoms/Arrow'
import StatusIcon from '../../atoms/StatusIcon'
import StatusImage from '../../atoms/StatusImage'
import Button from '../../atoms/Button'
import SearchInput from '../../molecules/SearchInput'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'
import type { Instance as InstanceType } from '../../../types/Instance'

import instanceImage from './images/instance.svg'
import bigInstanceImage from './images/instance-big.svg'

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
  overflow: auto;
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
  margin: 32px 0 16px 0;
  flex-shrink: 0;
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
const SearchNotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${props => props.marginTop ? 'margin-top: 64px;' : ''}
  * {
    margin-bottom: 42px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`
const SearchNotFoundText = styled.div`
  font-size: 18px;
`
const SearchNotFoundSubtitle = styled.div`
  color: ${Palette.grayscale[4]};
  margin-top: -32px;
`
const BigInstanceImage = styled.div`
  ${StyleProps.exactSize('96px')}
  background: url('${bigInstanceImage}') center no-repeat;
`

type Props = {
  instances: InstanceType[],
  selectedInstances: ?InstanceType[],
  currentPage: number,
  loading: boolean,
  searching: boolean,
  searchNotFound: boolean,
  loadingPage: boolean,
  hasNextPage: boolean,
  reloading: boolean,
  onSearchInputChange: (value: string) => void,
  onNextPageClick: (searchText: string) => void,
  onPreviousPageClick: () => void,
  onReloadClick: (searchText: string) => void,
  onInstanceClick: (instance: InstanceType) => void,
}

type State = {
  searchText: string,
}
@observer
class WizardInstances extends React.Component<Props, State> {
  timeout: TimeoutID

  constructor() {
    super()

    this.state = {
      searchText: '',
    }
  }

  handleSeachInputChange(searchText: string) {
    this.setState({ searchText })

    clearTimeout(this.timeout)
    this.setState({ searchText })
    this.timeout = setTimeout(() => {
      this.props.onSearchInputChange(searchText)
    }, 500)
  }

  areNoInstances() {
    return !this.props.loading && !this.props.searchNotFound && !this.props.reloading && this.props.instances.length === 0
  }

  renderNoInstances() {
    if (!this.areNoInstances()) {
      return null
    }

    return (
      <SearchNotFound marginTop>
        <BigInstanceImage />
        <SearchNotFoundText>It seems like you don’t have any Instances in this Endpoint</SearchNotFoundText>
        <SearchNotFoundSubtitle>You can retry the search or choose another Endpoint</SearchNotFoundSubtitle>
        <Button hollow onClick={() => { this.props.onReloadClick(this.state.searchText) }}>Retry Search</Button>
      </SearchNotFound>
    )
  }

  renderSearchNotFound() {
    if (!this.props.searchNotFound) {
      return null
    }

    return (
      <SearchNotFound>
        <StatusImage status="ERROR" />
        <SearchNotFoundText data-test-id="wInstances-notFoundText">Your search returned no results</SearchNotFoundText>
        <Button hollow onClick={() => { this.props.onReloadClick(this.state.searchText) }}>Retry</Button>
      </SearchNotFound>
    )
  }

  renderReloading() {
    if (!this.props.reloading) {
      return null
    }

    return (
      <Reloading>
        <StatusImage loading />
      </Reloading>
    )
  }

  renderLoading() {
    if (!this.props.loading) {
      return null
    }

    return (
      <LoadingWrapper>
        <StatusImage loading data-test-id="wInstances-loadingStatus" />
        <LoadingText>Loading instances...</LoadingText>
      </LoadingWrapper>
    )
  }

  renderInstances() {
    if (this.props.loading || this.props.searchNotFound || this.props.reloading || this.areNoInstances()) {
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
              data-test-id={`wInstances-item-${instance.id}`}
            >
              <CheckboxStyled checked={selected} onChange={() => { }} />
              <InstanceContent data-test-id="wInstances-instanceItem">
                <Image />
                <Label data-test-id="wInstances-itemName">{instance.instance_name}</Label>
                <Details data-test-id="wInstances-itemDetails">{`${instance.num_cpu} vCPU | ${instance.memory_mb} MB RAM${flavorName}`}</Details>
              </InstanceContent>
            </Instance>
          )
        })}
      </InstancesWrapper>
    )
  }

  renderFilters() {
    if (this.props.loading || this.areNoInstances()) {
      return null
    }

    let count = this.props.selectedInstances ? this.props.selectedInstances.length : 0
    let plural = count === 1 ? '' : 's'

    return (
      <FiltersWrapper>
        <SearchInput
          alwaysOpen
          onChange={searchText => { this.handleSeachInputChange(searchText) }}
          value={this.state.searchText}
          loading={this.props.searching}
          placeholder="Search VMs"
          data-test-id="wInstances-searchInput"
        />
        <FilterInfo>
          <SelectionInfo data-test-id="wInstances-selInfo">{count} instance{plural} selected</SelectionInfo>
          <FilterSeparator>|</FilterSeparator>
          <ReloadButton
            onClick={() => { this.props.onReloadClick(this.state.searchText) }}
            data-test-id="wInstances-reloadButton"
          />
        </FilterInfo>
      </FiltersWrapper>
    )
  }

  renderPagination() {
    if (this.props.loading || this.props.searchNotFound || this.props.reloading || this.areNoInstances()) {
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
          data-test-id="wInstances-prevPageButton"
        >
          <Arrow orientation="left" disabled={isPreviousDisabled} />
        </Page>
        <Page number data-test-id="wInstances-currentPage">
          {this.props.loadingPage ? (
            <StatusIcon
              status="RUNNING"
              secondary
              data-test-id="wInstances-pageLoadingStatus"
            />
          ) : this.props.currentPage}
        </Page>
        <Page
          next
          onClick={() => { if (!isNextDisabled) { this.props.onNextPageClick(this.state.searchText) } }}
          disabled={isNextDisabled}
          data-test-id="wInstances-nextPageButton"
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
        {this.renderReloading()}
        {this.renderSearchNotFound()}
        {this.renderInstances()}
        {this.renderPagination()}
        {this.renderNoInstances()}
      </Wrapper>
    )
  }
}

export default WizardInstances
