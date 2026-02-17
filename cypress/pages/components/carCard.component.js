import EditCarModal from '../modals/editCar.modal';

class CarCard {
  constructor(index) {
    this.index = index;
  }

  get root() {
    return cy.get('.panel-page .car-item').eq(this.index);
  }

  locators = {
    name: '.car_name',
    mileageInput: 'input[name="miles"]',
    mileageUpdateDate: '.car_update-mileage',
    updateMileageButton: '.update-mileage-form_submit',
    editCarButton: '.btn.car_edit',
    addExpenseButton: '.btn.car_add-expense'
  }

 
  clickAddExpense() {
    this.root.find(this.locators.addExpenseButton).click();
  }

  clickEdit() {
    this.root.find(this.locators.editCarButton).click();
  }

  shouldHaveBrandAndModel({ brand, model }) {
      this.root.find(this.locators.name).should('have.text', `${brand} ${model}`);
  }

  shouldHaveMileage(value) {
      this.root.find(this.locators.mileageInput).should('have.value', value);
  }

  shouldHaveMileageUpdateDate(date) {
    this.root.find(this.locators.mileageUpdateDate).should('include.text', date).and('include.text', 'Update mileage');
  }


  shouldBeDisabledUpdateMileageButton() {
    this.root.find(this.locators.updateMileageButton).should('be.disabled');
  }

  shouldBeEnabledUpdateMileageButton() {
    this.root.find(this.locators.updateMileageButton).should('be.enabled');
  }

   updateMileage(mileage) {
     this.root.find(this.locators.mileageInput).clear().type(mileage);
     this.root.find(this.locators.updateMileageButton).click();
   }

   remove() {
     this.clickEdit();
     const confirmDeleteModal = EditCarModal.clickRemove();
     confirmDeleteModal.confirmRemove();
     confirmDeleteModal.shouldNotExist();
   }
}

export default CarCard;
