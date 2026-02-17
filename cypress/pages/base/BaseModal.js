class BaseModal {
  get root() {
    throw new Error('Modal root selector is not defined')
  }

  shouldBeVisible() {
    this.root().should('be.visible')
    return this
  }

  shouldNotExist() {
    this.root().should('not.exist')
    return this
  }

  closeByOverlay() {
    cy.get('.modal-backdrop').click({ force: true })
    return this
  }

  close() {
    this.root().find('.close').click()
    return this
  }

  cancel() {
    this.root().find('.btn').contains('Cancel').click()
    return this
  }
}

export default BaseModal
