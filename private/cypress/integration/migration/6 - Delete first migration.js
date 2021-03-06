/*
Copyright (C) 2018  Cloudbase Solutions SRL
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

// @flow

describe('Delete the first migration', () => {
  before(() => {
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token', 'projectId')
  })

  it('Deletes migration', () => {
    cy.server()
    cy.route({ url: '**/replicas/**', method: 'GET' }).as('replicas')
    cy.wait('@replicas')
    cy.get('a').contains('Migrations').click()
    cy.get('div[data-test-id="mainListItem-content"]').first().click()
    cy.get('button').last().should('contain', 'Delete Migration').click()
    cy.route({ url: '**/migrations/**', method: 'DELETE' }).as('delete')
    cy.get('button').contains('Yes').click()
    cy.wait('@delete')
  })
})
