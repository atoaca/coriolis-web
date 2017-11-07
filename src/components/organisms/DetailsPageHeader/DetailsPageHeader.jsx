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
