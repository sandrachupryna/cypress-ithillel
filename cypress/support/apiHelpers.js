export const interceptCreateCar = () => {
  cy.intercept('POST', '**/api/cars').as('createCar');
};

export const waitForCarCreationAndReturnId = () => {
  return cy.wait('@createCar').then(({ response }) => {
    expect(response.statusCode).to.eq(201);
    expect(response.body).to.have.property('data');
    expect(response.body.data).to.have.property('id');
    return response.body.data.id;
  });
};

export const getCars = () => {
  return cy.request('GET', '/api/cars');
};

export const validateCarsListContains = (expectedCars) => {
  return getCars().then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.status).to.eq('ok');
    expect(response.body.data).to.be.an('array');

    expectedCars.forEach((expectedCar) => {
      const createdCar = response.body.data.find(car => car.id === expectedCar.id);
      expect(createdCar, `Finding car with ID ${expectedCar.id} in the API response`).to.exist;
      expect(createdCar).to.include({
        brand: expectedCar.brand,
        model: expectedCar.model,
        initialMileage: expectedCar.mileage
        });
    });
  });
};

export const deleteCarById = (carId) => {
  return cy.request('DELETE', `/api/cars/${carId}`).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.status).to.eq('ok');
  });
};

export const deleteAllCreatedCars = () => {
    const createdCarIds = Cypress.env('createdCarIds') || [];
    if (createdCarIds.length > 0) {
      createdCarIds.forEach((carId) => {
        deleteCarById(carId);
        cy.log(`Deleted car with ID: ${carId}`);
      });
      cy.clearSavedCarIds();
    } else {
      cy.log('No cars to delete');
    }
};



export const createExpenseByCarId = (carId, expenseData) => {
  const today = new Date().toISOString().split('T')[0];

  const requestBody = {
    carId: carId,
    mileage: expenseData.mileage,
    liters: expenseData.liters,
    totalCost: expenseData.totalCost,
    reportedAt: expenseData.reportedAt || today
  };

  return cy.request('POST', '/api/expenses', requestBody)
    .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status).to.eq('ok');
        expect(response.body.data).to.have.property('id');
        expect(response.body.data).to.include({
          carId: carId,
          mileage: expenseData.mileage,
          liters: expenseData.liters,
          totalCost: expenseData.totalCost,
          reportedAt: requestBody.reportedAt
        });
        return response.body.data.id;
  });
};

export const isoToUiFormat = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
};

export const apiHelper = {
  interceptCreateCar,
  waitForCarCreationAndReturnId,
  validateCarsListContains,
  deleteAllCreatedCars,
  createExpenseByCarId,
  isoToUiFormat
};