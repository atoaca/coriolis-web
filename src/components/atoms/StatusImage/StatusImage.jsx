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
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import StyleProps from '../../styleUtils/StyleProps'

import errorImage from './images/error.svg'

const statuses = () => {
  return {
    ERROR: css`
      background-image: url('${errorImage}');
    `,
  }
}
const Wrapper = styled.div`
  ${StyleProps.exactSize('96px')}
  background-repeat: no-repeat;
  background-position: center;
  ${props => statuses(props)[props.status]}
`

class StatusImage extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default StatusImage
