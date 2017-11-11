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

import loadingImage from './images/loading.svg'

const Wrapper = styled.div`
  width: 96px;
  height: 96px;
  background: url('${loadingImage}') center no-repeat;
  transform-origin: 48px 48px;
  animation: rotate 1s linear infinite;

  @keyframes rotate {
    0% {transform: rotate(0deg);}
    100% {transform: rotate(360deg);}
  }
`

class LoadingAnimation extends React.Component {
  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default LoadingAnimation
