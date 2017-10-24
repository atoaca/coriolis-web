import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Logo } from 'components'

import backgroundImage from './images/star-bg.jpg'

const Wrapper = styled.div`
  background-image: url('${backgroundImage}');
  display: flex;
  flex-direction: column;
  height: 100%;
`

const LogoStyled = styled(Logo)`margin: 40px auto 0 auto;`

const Menu = styled.div`margin-top:32px`

const MenuItem = styled.div`
  font-size: 18px;
  color: ${props => props.selected ? '#007AFF' : 'white'};
  cursor: pointer;
  margin-top: 26px;
  margin-left: 96px;
  display: inline-block;
`
const Footer = styled.div``

const MenuItems = [
  {
    label: 'Replicas',
    value: 'replicas',
  }, {
    label: 'Migrations',
    value: 'migrations',
  }, {
    label: 'Cloud Endpoints',
    value: 'endpoints',
  }, {
    label: 'Projects',
    value: 'projects',
  },
]

class Navigation extends React.Component {
  static propTypes = {
    currentPage: PropTypes.string,
  }

  handleMenuItemClick(item) {
    window.location.href = `/#/${item}`
  }

  renderMenu() {
    return (
      <Menu>
        {MenuItems.map(item => {
          return (
            <MenuItem
              key={item.value}
              selected={this.props.currentPage === item.value}
              onClick={() => { this.handleMenuItemClick(item.value) }}
            >{item.label}</MenuItem>
          )
        })}
      </Menu>
    )
  }

  render() {
    return (
      <Wrapper>
        <LogoStyled small />
        {this.renderMenu()}
        <Footer />
      </Wrapper>
    )
  }
}

export default Navigation
