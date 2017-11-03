import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import errorImage from './images/error.svg'
import progressWithBackgroundImage from './images/progress-background.svg'
import progressImage from './images/progress.js'
import successImage from './images/success.svg'
import warningImage from './images/warning.svg'
import pendingImage from './images/pending.svg'

const getRunningImageUrl = props => {
  const smallCircleColor = props.secondary ? Palette.grayscale[0] : Palette.primary

  if (props.useBackground) {
    return `url('${progressWithBackgroundImage}')`
  }

  return `url('data:image/svg+xml;utf8,${progressImage(Palette.grayscale[3], smallCircleColor)}')`
}

const statuses = props => {
  return {
    COMPLETED: css`
      background-image: url('${successImage}');
    `,
    RUNNING: css`
      background-image: ${getRunningImageUrl(props)};
      ${StyleProps.animations.rotation}
    `,
    ERROR: css`
      background-image: url('${errorImage}');
    `,
    WARNING: css`
      background-image: url('${warningImage}');
    `,
    CANCELED: css`
      background-image: url('${warningImage}');
    `,
    PENDING: css`
      background-image: url('${pendingImage}');
    `,
  }
}

const Wrapper = styled.div`
  min-width: 16px;
  max-width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-position: center;
  ${props => statuses(props)[props.status]}
`

class StatusIcon extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    useBackground: PropTypes.bool,
  }

  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default StatusIcon
