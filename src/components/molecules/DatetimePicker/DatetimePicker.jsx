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
import styled, { injectGlobal } from 'styled-components'
import Datetime from 'react-datetime'
import PropTypes from 'prop-types'
import moment from 'moment'

import { DropdownButton } from 'components'

import DomUtils from '../../../utils/DomUtils'

import style from './style.js'

require('moment/locale/en-gb')

injectGlobal`${style}`

const Wrapper = styled.div`
  position: relative;
`
const DropdownButtonStyled = styled(DropdownButton)`
  font-size: 11px;
`
const DatetimeStyled = styled(Datetime)`
  position: absolute;
  right: 5px;
  top: 45px;
  z-index: 10;

  .rdtPicker {
    display: ${props => props.open ? 'block' : 'none'};
  }
`

class DatetimePicker extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
  }

  constructor() {
    super()

    this.state = {
      showPicker: false,
    }
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handlePageClick, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handlePageClick, false)
  }

  handlePageClick(e) {
    let path = DomUtils.getEventPath(e)

    if (!this.itemMouseDown && !path.find(n => n.className === 'rdtPicker')) {
      this.setState({ showPicker: false })
    }
  }

  handleDropdownClick() {
    this.setState({ showPicker: !this.state.showPicker })
  }

  render() {
    return (
      <Wrapper>
        <DropdownButtonStyled
          width={176}
          value={(this.props.value && moment(this.props.value).format('DD/MM/YYYY hh:mm A')) || '-'}
          centered
          onClick={() => { this.handleDropdownClick() }}
          onMouseDown={() => { this.itemMouseDown = true }}
          onMouseUp={() => { this.itemMouseDown = false }}
        />
        <DatetimeStyled
          input={false}
          value={this.props.value}
          open={this.state.showPicker}
          onChange={this.props.onChange}
          dateFormat="DD/MM/YYYY"
          timeFormat="hh:mm A"
          locale="en-gb"
        />
      </Wrapper>
    )
  }
}

export default DatetimePicker