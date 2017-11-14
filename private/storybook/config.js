import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

const req = require.context('components', true, /.story.jsx$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

addDecorator(story => {
  return React.createElement(BrowserRouter, null, story())
})

configure(loadStories, module)
