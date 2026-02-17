
import BaseModal from '../base/BaseModal'

class ConfirmDeleteModal extends BaseModal {
    root = () => cy.get('.modal-content');

    elements = {
        removeButton: () => this.root().find('.btn').contains('Remove')
    }

    checkRemoveButtonIsDanger() {
        this.elements.removeButton().should('have.class', 'btn-danger');
        return this;
    }
    
    confirmRemove() {
        this.elements.removeButton().click();
    }
}

export default new ConfirmDeleteModal();
