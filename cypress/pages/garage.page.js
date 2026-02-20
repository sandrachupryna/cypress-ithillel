import BasePage from './base/BasePage';
import CarCard from './components/carCard.component';
import AddCarModal from './modals/addCar.modal';


class GaragePage extends BasePage {
  
  selectors = {
    carPanel: '.panel-page_content',
    carItems: '.panel-page .car-item',
    addCarBtn: '.panel-page .btn'
  } 

  elements = {
    addCarButton: () => cy.get(this.selectors.addCarBtn).contains('Add car'),
    carsItems: () => cy.get(this.selectors.carItems)
  };

  open() {
    super.visitLogined('/panel/garage');
  }

  openAddCarModal() {
    this.elements.addCarButton().click();
    return AddCarModal;
  }

  shouldHaveCars(count) {
    this.elements.carsItems().should('have.length', count);
  }

  shouldHaveEmptyState() {
    cy.get(this.selectors.carPanel).should('contain.text', "You don’t have any cars in your garage");
    this.elements.carsItems().should('not.exist');
  }

  getCarCardByIndex(index) {
    return new CarCard(index); 
  }

  deleteAllCars() {
    cy.get(this.selectors.carPanel).should('be.visible');
    cy.get('body').then(($body) => {
      if ($body.find(this.selectors.carItems).length > 0) {
        this.getCarCardByIndex(0).remove();
        this.deleteAllCars();
      }
    });
  }

  createCar(carData) {
    this.openAddCarModal()
      .fillCar(carData)
      .clickAddButton()
      .shouldNotExist();
  };
}

export default new GaragePage();