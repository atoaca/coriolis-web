import React from 'react'
import { shallow } from 'enzyme'
import Button from './Button'

const wrap = (props = {}) => shallow(<Button {...props} />).dive()

it('renders with different combination of props', () => {
  wrap({ disabled: true })
  wrap({ primary: true })
  wrap({ disabled: true, primary: true })
})
