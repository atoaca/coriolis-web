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

import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { StatusImage } from 'components'

import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div`
  margin-top: 8px;
`
const Separator = styled.div`
  height: 1px;
  background: ${Palette.grayscale[1]};;
`
const Loading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 88px;
`
const LoadingText = styled.div`
  font-size: 18px;
  margin-top: 39px;
`
const List = styled.div``

const NoResults = styled.div`
  margin-top: 39px;
  text-align: center;
`

class MainList extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    selectedItems: PropTypes.array,
    loading: PropTypes.bool,
    onSelectedChange: PropTypes.func,
    onItemClick: PropTypes.func,
    renderItemComponent: PropTypes.func,
  }

  renderList() {
    if (!this.props.items || this.props.items.length === 0) {
      return null
    }

    return (
      <List>
        {this.props.items.map(item => {
          let selected = Boolean(this.props.selectedItems.find(i => i.id === item.id))
          return this.props.renderItemComponent({
            key: item.id,
            item,
            selected,
            onClick: () => { this.props.onItemClick(item) },
            onSelectedChange: e => { this.props.onSelectedChange(item, e.target.checked) },
          })
        })}
      </List>
    )
  }

  renderLoading() {
    return (
      <Loading>
        <StatusImage loading />
        <LoadingText>Loading ...</LoadingText>
      </Loading>
    )
  }

  renderNoResults() {
    return (
      <NoResults>No results</NoResults>
    )
  }

  render() {
    let renderContent = () => {
      if (this.props.loading) {
        return this.renderLoading()
      }

      if (this.props.items.length === 0) {
        return this.renderNoResults()
      }

      return this.renderList()
    }

    return (
      <Wrapper>
        {this.props.loading || this.props.items.length === 0 ? <Separator /> : null}
        {renderContent()}
      </Wrapper>
    )
  }
}

export default MainList
