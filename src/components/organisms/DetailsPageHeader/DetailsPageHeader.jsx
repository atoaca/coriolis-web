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
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { SideMenu, NotificationDropdown, UserDropdown } from 'components'

import backgroundImage from './images/star-bg.jpg'
import logoImage from './images/logo.svg'

const Wrapper = styled.div`
  display: flex;
  height: 64px;
  background: url('${backgroundImage}');
  align-items: center;
  padding: 0 22px;
`

const Logo = styled.div`
  width: 232px;
  height: 48px;
  background: url('${logoImage}') no-repeat;
  flex-grow: 1;
`

const UserDropdownStyled = styled(UserDropdown) `
  margin-left: 16px;
`

class DetailsPageHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    onUserItemClick: PropTypes.func,
  }

  render() {
    return (
      <Wrapper>
        <SideMenu />
        <Logo />
        <NotificationDropdown white />
        <UserDropdownStyled
          white
          user={this.props.user}
          onItemClick={this.props.onUserItemClick}
        />
      </Wrapper>
    )
  }
}

export default DetailsPageHeader
