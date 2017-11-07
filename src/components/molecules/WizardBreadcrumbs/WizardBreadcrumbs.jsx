import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Arrow } from 'components'

import { wizardConfig } from '../../../config'
import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`
const ArrowStyled = styled(Arrow)``
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;

  &:last-child ${ArrowStyled} {
    display: none;
  }
`
const Name = styled.div`
  color: ${props => props.selected ? Palette.primary : Palette.black};
`

class WizardBreadcrumbs extends React.Component {
  static propTypes = {
    selected: PropTypes.object,
    wizardType: PropTypes.string,
  }

  render() {
    let pages = wizardConfig.pages.filter(p => !p.excludeFrom || p.excludeFrom !== this.props.wizardType)
    return (
      <Wrapper>
        {pages.map(page => {
          return (
            <Breadcrumb key={page.id}>
              <Name selected={this.props.selected.id === page.id}>{page.breadcrumb}</Name>
              <ArrowStyled primary={this.props.selected.id === page.id} useDefaultCursor />
            </Breadcrumb>
          )
        })}
      </Wrapper>
    )
  }
}

export default WizardBreadcrumbs
