import GaragePage from '../../pages/garage.page'; 
import AddExpenseModal from '../../pages/modals/addExpense.modal';
import ExpensesPage from '../../pages/fuelExpenses.page';
import { apiHelper } from '../../support/apiHelpers';

describe('Adding cars and expenses lifecycle', () => {
  let carsFixture;
  let expensesFixture;

  before(() => {
    cy.fixture('cars').then((data) => {
      carsFixture = data;
    });
    cy.fixture('expenses').then((data) => {
      expensesFixture = data;
    });
  });
  
  beforeEach(() => {
    GaragePage.open();
    GaragePage.deleteAllCars();
  });


  it('User can add cars and expense, then delete them', () => {
    // Add car
    GaragePage.shouldHaveEmptyState();
    GaragePage.createCar(carsFixture.bmw);

    const currentDate = new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '.');

    // Check added car in the garage list
    GaragePage.shouldHaveCars(1);

    // Add second car
    GaragePage.createCar(carsFixture.audi);

    // Check the second car in the garage list
    GaragePage.shouldHaveCars(2);

    // Add expense for the second car
    const carCard2 = GaragePage.getCarCardByIndex(0);
    const expensesForAudi = expensesFixture.audi[0];
    carCard2.clickAddExpense();
    const addExpenseModal = AddExpenseModal;
    addExpenseModal.shouldBeVisible();
    addExpenseModal.fillExpense({ 
      vehicle: `${carsFixture.audi.brand} ${carsFixture.audi.model}`, 
      reportDate: currentDate, 
      mileage: expensesForAudi.mileage, 
      numberOfLiters: expensesForAudi.liters, 
      totalCost: expensesForAudi.totalCost 
    });
    addExpenseModal.clickAddButton();
    addExpenseModal.shouldNotExist();

    // Check the redirected URL and the added expense in the expenses list
    cy.url().should('include', '/panel/expenses');
    ExpensesPage.verifySelectedCarInDropdown(`${carsFixture.audi.brand} ${carsFixture.audi.model}`);
    ExpensesPage.verifyLastAddedExpense({ date: currentDate, mileage: expensesForAudi.mileage, liters: expensesForAudi.liters, totalCost: expensesForAudi.totalCost });

    // Chech that expeses are applied
    GaragePage.open();
    GaragePage.shouldHaveCars(2);
    const updatedCarCard2 = GaragePage.getCarCardByIndex(0);
    updatedCarCard2.shouldHaveBrandAndModel({ brand: carsFixture.audi.brand, model: carsFixture.audi.model });
    updatedCarCard2.shouldHaveMileage(expensesForAudi.mileage);
    updatedCarCard2.shouldHaveMileageUpdateDate(currentDate);

    //Remove cars
    GaragePage.getCarCardByIndex(0).remove();
    GaragePage.shouldHaveCars(1);
    GaragePage.getCarCardByIndex(0).shouldHaveBrandAndModel({ brand: carsFixture.bmw.brand, model: carsFixture.bmw.model });

    GaragePage.getCarCardByIndex(0).remove();
    GaragePage.shouldHaveEmptyState();

    // Check that expenses are removed with the car
    ExpensesPage.open();
    ExpensesPage.shouldHaveEmptyGarageState();
  });
});