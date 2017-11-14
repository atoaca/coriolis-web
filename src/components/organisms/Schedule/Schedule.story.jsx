import React from 'react'
import { storiesOf } from '@storybook/react'

import Schedule from './Schedule'

storiesOf('Schedule', module)
  .add('no schedules', () => (
    <Schedule />
  ))
  .add('enabled/disabled schedules', () => (
    <Schedule
      schedules={[{}, { enabled: true }]}
    />
  ))
