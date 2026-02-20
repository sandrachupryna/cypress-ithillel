import GaragePage from '../../pages/garage.page';
import ExpensesPage from '../../pages/fuelExpenses.page';
import { apiHelper } from '../../support/apiHelpers';

describe('Fuel Expenses - Table', () => {
  let carsFixture;
  let expensesFixture;

  const createCarWithExpenses = (carData, expensesArray = []) => {
    GaragePage.createCar(carData);
    return apiHelper.waitForCarCreationAndReturnId()
      .then((carId) => {
        cy.log(`Creating car ${carData.brand} ${carData.model} with ID: ${carId}`);
        cy.saveCarId(carId);
        return cy.wrap(expensesArray || []).each((expense) => {
          return apiHelper.createExpenseByCarId(carId, expense);
        });
      });
  };

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
    
    apiHelper.interceptCreateCar();

    cy.wrap(Object.keys(carsFixture)).each((carKey) => {
        return createCarWithExpenses(carsFixture[carKey], expensesFixture[carKey]);
    })
    .then(() => {
        ExpensesPage.open();
    });
});

  afterEach(() => {
    apiHelper.deleteAllCreatedCars();
  });

  it('Should show empty message when no cars exist in garage', () => {
    apiHelper.deleteAllCreatedCars();
    ExpensesPage.open();
    ExpensesPage.shouldHaveEmptyGarageState();
  });
    
  it('Should show empty message when no expenses exist for an existing car', () => {
    const carWithoutExpensesKey = Object.keys(carsFixture).find(carKey => !expensesFixture[carKey] || expensesFixture[carKey].length === 0);
    ExpensesPage.selectCarInDropdownMenu(`${carsFixture[carWithoutExpensesKey].brand} ${carsFixture[carWithoutExpensesKey].model}`);
    ExpensesPage.shouldHaveEmptyExpensesState();
  });

  it('Should display correct table columns', () => {
    ExpensesPage.getTableHeaders()
        .then(headers => {
            cy.log(`Actual table headers: ${headers.join(', ')}`);
            expect(headers).to.deep.equal([
            'Date',
            'Mileage',
            'Liters used',
            'Total cost'
            ]);
        });
  });

  it('Should have all cars from the garage available in the dropdown menu', () => {
    const expectedCars = Object.values(carsFixture)
      .map(car => `${car.brand} ${car.model}`);
    cy.log(`Expected cars in dropdown: ${expectedCars.join(', ')}`);
    ExpensesPage.verifyAvailableCarsInDropdown(expectedCars);
  })

  it('Should display expense data correctly in the table', () => {
    const currentDateUi = new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '.');
    const carKey = Object.keys(expensesFixture)[Math.floor(Math.random() * Object.keys(expensesFixture).length)];
    cy.log(`Testing expenses display for car: ${carsFixture[carKey].brand} ${carsFixture[carKey].model}`);
    ExpensesPage.selectCarInDropdownMenu(`${carsFixture[carKey].brand} ${carsFixture[carKey].model}`);
    ExpensesPage.verifyAllExpensesInTable(
      expensesFixture[carKey].map(exp => ({
          ...exp,
          date: currentDateUi
      }))
    );
  });
});