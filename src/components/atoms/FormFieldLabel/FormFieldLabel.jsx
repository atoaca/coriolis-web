import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  color: white;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: ${StyleProps.fontWeights.medium};
  font-size: 9px;
`

const FormFieldLabel = ({ content }) => {
  return (
    <Wrapper>{content}</Wrapper>
  )
}

FormFieldLabel.propTypes = {
  content: PropTypes.string.isRequired,
}

export default FormFieldLabel