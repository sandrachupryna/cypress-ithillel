
import BaseModal from '../base/BaseModal'
import ConfirmDeleteModal from './confirmDelete.modal';

class EditCarModal extends BaseModal {
    root = () => cy.get('.modal-content');

    elements = {
        removeCarButton: () => this.root().find('.btn').contains('Remove car')
    }

    checkRemoveButtonIsDanger() {
        this.elements.removeCarButton().should('have.class', 'btn-outline-danger');
        return this;
    }
    
    clickRemove() {
        this.elements.removeCarButton().click();
        return ConfirmDeleteModal; 
    }
}

export default new EditCarModal();