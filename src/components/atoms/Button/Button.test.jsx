import React from 'react'
import { shallow } from 'enzyme'
import Button from './Button'

const wrap = props => shallow(<Button {...props} />)

it('renders with different combination of props', () => {
  let disabled = wrap({ disabled: true })
  expect(disabled.prop('disabled')).toBe(true)
  wrap({ primary: true })
  wrap({ disabled: true, primary: true })
})
