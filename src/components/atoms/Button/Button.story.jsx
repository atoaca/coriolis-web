import React from 'react'
import { storiesOf, action } from '@storybook/react'
import Button from './Button'

storiesOf('Button', module)
  .add('primary', () => (
    <Button onClick={action('clicked')}>Hello</Button>
  ))
  .add('secondary', () => (
    <Button secondary onClick={action('clicked')}>Hello</Button>
  ))
  .add('alert', () => (
    <Button alert onClick={action('clicked')}>Hello</Button>
  ))
  .add('hollow primary', () => (
    <Button hollow onClick={action('clicked')}>Hello</Button>
  ))
  .add('hollow secondary', () => (
    <Button hollow secondary onClick={action('clicked')}>Hello</Button>
  ))
  .add('hollow alert', () => (
    <Button hollow alert onClick={action('clicked')}>Hello</Button>
  ))
