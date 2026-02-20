import GaragePage from '../../pages/garage.page'; 
import { apiHelper } from '../../support/apiHelpers';


describe('Garage - Add Car', () => {
  let carsFixture;
  const currentDate = new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '.');


  before(() => {
    cy.fixture('cars').then((data) => {
      carsFixture = data;
    });
  });
  
  beforeEach(() => {
    GaragePage.open();
    // deleting cars via UI to ensure that the test starts with a clean state 
    // in case there are any cars that were not deleted via API (e.g. if the test failed before reaching the cleanup step)
    GaragePage.deleteAllCars();
  });

  afterEach(() => {
    apiHelper.deleteAllCreatedCars();
  });

  it('Add car successfully', () => {
    GaragePage.shouldHaveEmptyState();
    const [key, randomCar] = Cypress._.sample(Object.entries(carsFixture));
    cy.log(`Adding car: ${key}`);

    apiHelper.interceptCreateCar();
    const addCarModal = GaragePage.openAddCarModal();
    addCarModal.shouldBeVisible();
    addCarModal.fillCar(randomCar);
    addCarModal.clickAddButton();
    addCarModal.shouldNotExist();
    apiHelper.waitForCarCreationAndReturnId()
      .then((carId) => {
        cy.log(`Car created with ID: ${carId}`);
        cy.saveCarId(carId);
        apiHelper.validateCarsListContains([{ id: carId, ...randomCar }]);
      });
            
    // Check added car in the garage list
    GaragePage.shouldHaveCars(1);
    const carCard = GaragePage.getCarCardByIndex(0);
    carCard.shouldHaveBrandAndModel({ brand: randomCar.brand, model: randomCar.model })
    carCard.shouldHaveMileage(randomCar.mileage.toString());
    carCard.shouldHaveMileageUpdateDate(currentDate);
    carCard.shouldBeDisabledUpdateMileageButton();
  });

  it('Add several cars', () => {
    GaragePage.shouldHaveEmptyState();
    let createdCars = [];

    apiHelper.interceptCreateCar();
    let carNumber = 0;
    cy.wrap(Object.values(carsFixture)).each((car) => {
      GaragePage.createCar(car);
      apiHelper.waitForCarCreationAndReturnId()
        .then((carId) => {
          cy.log(`Car created with ID: ${carId}`);
          carNumber += 1;
          cy.saveCarId(carId);
          createdCars.push({ id: carId, ...car });
          cy.log(`Current list of created cars: ${JSON.stringify(createdCars)}`);
          
          // Check added car in the garage list
          GaragePage.shouldHaveCars(carNumber);
          let carCard = GaragePage.getCarCardByIndex(0);
          carCard.shouldHaveBrandAndModel({ brand: car.brand, model: car.model })
          carCard.shouldHaveMileage(car.mileage.toString());
          carCard.shouldHaveMileageUpdateDate(currentDate);
          carCard.shouldBeDisabledUpdateMileageButton();
        });
    })
    .then(() => {
      apiHelper.validateCarsListContains(createdCars);
    });
  });
});