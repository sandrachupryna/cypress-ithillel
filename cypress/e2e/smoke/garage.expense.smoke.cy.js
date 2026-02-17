import GaragePage from '../../pages/garage.page'; 
import AddExpenseModal from '../../pages/modals/addExpense.modal';
import ExpensesPage from '../../pages/fuelExpenses.page';

describe('Adding cars and expenses lifecycle', () => {
  beforeEach(() => {
    GaragePage.open();
    GaragePage.deleteAllCars();
  });

  it('User can add cars and expense, then delete them', () => {
    // Add car
    GaragePage.shouldHaveEmptyState();
    const addCarModal = GaragePage.openAddCarModal();
    addCarModal.shouldBeVisible();
    addCarModal.fillCar({ brand: 'BMW', model: 'X5', mileage: 5000 });
    addCarModal.clickAddButton();
    addCarModal.shouldNotExist();

    const currentDate = new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '.');

    // Check added car in the garage list
    GaragePage.shouldHaveCars(1);
    const carCard = GaragePage.getCarCardByIndex(0);
    carCard.shouldHaveBrandAndModel({ brand: 'BMW', model: 'X5' })
    carCard.shouldHaveMileage('5000');
    carCard.shouldHaveMileageUpdateDate(currentDate);
    carCard.shouldBeDisabledUpdateMileageButton();
 
    // Add second car
    const addCarModal2 = GaragePage.openAddCarModal();
    addCarModal2.shouldBeVisible();
    addCarModal2.fillCar({ brand: 'Ford', model: 'Focus', mileage: 3000 });
    addCarModal2.clickAddButton();

    // Check the second car in the garage list
    GaragePage.shouldHaveCars(2);
    const carCard2 = GaragePage.getCarCardByIndex(0);
    carCard2.shouldHaveBrandAndModel({ brand: 'Ford', model: 'Focus' })
    carCard2.shouldHaveMileage('3000');
    carCard2.shouldHaveMileageUpdateDate(currentDate);
    carCard2.shouldBeDisabledUpdateMileageButton();

    // Add expense for the second car
    carCard2.clickAddExpense();
    const addExpenseModal = AddExpenseModal;
    addExpenseModal.shouldBeVisible();
    addExpenseModal.fillExpense({ vehicle: 'Ford Focus', reportDate: currentDate, mileage: 3100, numberOfLiters: 5, totalCost: 100 });
    addExpenseModal.clickAddButton();
    addExpenseModal.shouldNotExist();

    // Check the redirected URL and the added expense in the expenses list
    cy.url().should('include', '/panel/expenses');
    ExpensesPage.verifySelectedCarInDropdown('Ford Focus');
    ExpensesPage.verifyLastAddedExpense({ date: currentDate, mileage: 3100, liters: 5, totalCost: 100 });

    // Chech that expeses are applied
    GaragePage.open();
    GaragePage.shouldHaveCars(2);
    const updatedCarCard2 = GaragePage.getCarCardByIndex(0);
    updatedCarCard2.shouldHaveBrandAndModel({ brand: 'Ford', model: 'Focus' })
    updatedCarCard2.shouldHaveMileage('3100');
    updatedCarCard2.shouldHaveMileageUpdateDate(currentDate);

    //Remove cars
    GaragePage.getCarCardByIndex(1).remove();
    GaragePage.shouldHaveCars(1);
    GaragePage.getCarCardByIndex(0).shouldHaveBrandAndModel({ brand: 'Ford', model: 'Focus' });

    GaragePage.getCarCardByIndex(0).remove();
    GaragePage.shouldHaveEmptyState();

    // Check that expenses are removed with the car
    ExpensesPage.open();
    ExpensesPage.shouldHaveEmptyState();

  });
});