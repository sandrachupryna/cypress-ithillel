import BaseModal from '../base/BaseModal'

class AddCarModal extends BaseModal {
  root = () => cy.get('.modal-content');

  elements = {
    brandSelect: () => this.root().find('#addCarBrand'),
    modelSelect: () => this.root().find('#addCarModel'),
    mileageInput: () => this.root().find('#addCarMileage'),
    addButton: () => this.root().find('.btn').contains('Add'),
    validationMessage: () => this.root().find('.invalid-feedback')
  }

  fillCar({ brand, model, mileage }) {
    if (brand) this.elements.brandSelect().select(brand);
    if (model) this.elements.modelSelect().select(model);
    if (mileage) this.elements.mileageInput().clear().type(mileage);
    return this;
  }
  
  clickAddButton() {
    this.elements.addButton().click();
    return this;
  }
}

export default new AddCarModal();
