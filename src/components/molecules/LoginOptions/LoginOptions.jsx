import React from 'react'
import styled, { css } from 'styled-components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import { loginButtons } from '../../../config'
import googleLogo from './images/google-logo.svg'
import microsoftLogo from './images/microsoft-logo.svg'
import facebookLogo from './images/facebook-logo.svg'
import githubLogo from './images/github-logo.svg'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${loginButtons.length > 2 ? '420px' : '210px'};
  margin-left: -16px;
  margin-top: 16px;
`

const buttonStyle = (id, isLogo) => {
  switch (id) {
    case 'google':
      return isLogo ?
        css`background-image: url('${googleLogo}');`
        : css`
          color: ${Palette.grayscale[4]};
          border-color: ${Palette.grayscale[2]};
          background-color: white;
        `
    case 'microsoft':
      return isLogo ?
        css`background-image: url('${microsoftLogo}');`
        : css`
          border-color: #0078D7;
          background-color: #0078D7;
        `
    case 'facebook':
      return isLogo ?
        css`
          height: 27px;
          background-image: url('${facebookLogo}');
          margin-top: 8px;
        `
        : css`
          border-color: #2553B4;
          background-color: #2553B4;
        `
    case 'github':
      return isLogo ?
        css`background-image: url('${githubLogo}');`
        : css`
          border-color: ${Palette.grayscale[4]};
          background-color: ${Palette.grayscale[4]};
        `
    default:
      return ''
  }
}

const Button = styled.div`
  width: ${StyleProps.inputSizes.regular.width - 2}px;
  height: ${StyleProps.inputSizes.regular.height - 2}px;
  display: flex;
  align-items: center;
  border: 1px solid;
  border-radius: ${StyleProps.borderRadius};
  color: white;
  cursor: pointer;
  margin-left: 16px;
  margin-bottom: 16px;
  ${props => buttonStyle(props.id)}
`

const Logo = styled.div`
  width: 17px;
  height: 17px;
  background-repeat: no-repeat;
  margin: 0 8px 0 8px;
  ${props => buttonStyle(props.id, true)}
`

const LoginOptions = () => {
  if (loginButtons.length === 0) {
    return null
  }

  return (
    <Wrapper>{loginButtons.map((button) => {
      return (
        <Button key={button.id} id={button.id}>
          <Logo id={button.id} />Sign in with {button.name}
        </Button>
      )
    })}</Wrapper>
  )
}

export default LoginOptions
