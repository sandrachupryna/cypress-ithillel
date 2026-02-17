import BaseModal from '../base/BaseModal'

class AddExpenseModal extends BaseModal {
  root = () => cy.get('.modal-content');

  elements = {
    vehicleSelect: () => this.root().find('#addExpenseCar'),
    reportDateInput: () => this.root().find('#addExpenseDate'),
    mileageInput: () => this.root().find('#addExpenseMileage'),
    numberOfLitersInput: () => this.root().find('#addExpenseLiters'),
    totalCostInput: () => this.root().find('#addExpenseTotalCost'),
    addButton: () => this.root().find('.btn').contains('Add'),
    validationMessage: () => this.root().find('.invalid-feedback')
  }

  fillExpense({ vehicle, reportDate, mileage, numberOfLiters, totalCost }) {
    if (vehicle) this.elements.vehicleSelect().select(vehicle);
    if (reportDate) this.elements.reportDateInput().clear().type(reportDate);
    if (mileage) this.elements.mileageInput().clear().type(mileage);
    if (numberOfLiters) this.elements.numberOfLitersInput().clear().type(numberOfLiters);
    if (totalCost) this.elements.totalCostInput().clear().type(totalCost);
    return this;
  }
  
  clickAddButton() {
    this.elements.addButton().click();
    return this;
  }
}

export default new AddExpenseModal();
