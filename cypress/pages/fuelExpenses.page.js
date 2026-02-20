import BasePage from './base/BasePage';

class ExpensesPage extends BasePage {

  selectors = {
    expensesPanel: '.panel-page_content',
    carSelectDropdown: '#carSelectDropdown',
    addExpenseBtn: '.panel-page .btn',
    expenseTable: '.expenses_table',
    carSelectDropdownMenu: 'ul[aria-labelledby="carSelectDropdown"]'
  } 

  elements = {
    addExpenseButton: () => cy.get(this.selectors.addExpenseBtn).contains('Add an expense'),
    carSelectDropdown: () => cy.get(this.selectors.carSelectDropdown),
    expenseTable: () => cy.get(this.selectors.expenseTable),
    carSelectDropdownMenu: () => cy.get(this.selectors.carSelectDropdownMenu)
  };

  open() {
    super.visitLogined('/panel/expenses');
  }

  verifyLastAddedExpense({ date, mileage, liters, totalCost }) {
    this.elements.expenseTable()
      .find('tbody tr')
      .first()
      .within(() => {
        cy.get('td').eq(0).should('have.text', String(date))
        cy.get('td').eq(1).should('have.text', String(mileage))
        cy.get('td').eq(2).should('include.text', `${String(liters)}L`)
        cy.get('td').eq(3).should('include.text', String(totalCost))
      })
  }

  verifySelectedCarInDropdown(carName) {
    this.elements.carSelectDropdown().should('include.text', carName);
  } 

  shouldHaveEmptyGarageState() {
    cy.get(this.selectors.expensesPanel).should('contain.text', "You don’t have any cars in your garage");
    this.elements.carSelectDropdown().should('not.exist');
    this.elements.expenseTable().should('not.exist');
  }

  shouldHaveEmptyExpensesState() {
    cy.get(this.selectors.expensesPanel).should('contain.text', "You don’t have any fuel expenses filed in");
    this.elements.expenseTable().should('not.exist');
  }

  getSelectedCarFromDropdown() {
    return this.elements.carSelectDropdown().invoke('text').then(text => text.trim());
  }

  getTableHeaders() {
    return this.elements.expenseTable()
      .find('thead th')
      .then($headers => {
        return [...$headers]
          .map(header => header.innerText.trim())
          .filter(text => text !== '');
      });
  }

  verifyAvailableCarsInDropdown(expectedCarNames) {
    this.elements.carSelectDropdown().click();
    this.elements.carSelectDropdownMenu()
      .should('be.visible')
      .should('have.class', 'show')
      .within(() => {
        cy.get('li')
          .should('have.length', expectedCarNames.length)
          .then($options => {
            const actualCarNames = [...$options]
              .map(option => option.innerText.trim());
            cy.log(`Actual cars in dropdown: ${actualCarNames.join(', ')}`);
            expect(actualCarNames).to.have.deep.members(expectedCarNames);
          });
      });
  }

  selectCarInDropdownMenu(carName) {
    this.getSelectedCarFromDropdown().then(selected => {
      if (selected === carName) {
        cy.log(`Car "${carName}" is already selected in the dropdown.`);
        return;
      } 
      this.elements.carSelectDropdown().click();
      cy.log(`Selecting car "${carName}" from dropdown.`);
      this.elements.carSelectDropdownMenu()
          .find('li')
          .contains(carName)
          .click();
      
    }); 
  }

  verifyAllExpensesInTable(expectedExpensesArray) {
    this.elements.expenseTable()
      .find('tbody tr')
      .should('have.length', expectedExpensesArray.length)
      .then(($rows) => {
        const actualExpenses = [];
        $rows.each((index, row) => {
          const cells = Cypress.$(row).find('td');
          actualExpenses.push({
            date: cells.eq(0).text().trim(),
            mileage: cells.eq(1).text().trim(),
            liters: cells.eq(2).text().replace('L', '').trim(),
            totalCost: cells.eq(3).text().trim()
          });
        });

        cy.log('Actual expenses from table:', JSON.stringify(actualExpenses));

        expectedExpensesArray.forEach((expected) => {
          const match = actualExpenses.find(actual =>
            actual.date === String(expected.date) &&
            actual.mileage === String(expected.mileage) &&
            actual.liters === String(expected.liters) &&
            actual.totalCost.includes(String(expected.totalCost))
          );
          expect(
            match,
            `Expense found: ${JSON.stringify(expected)}`
          ).to.exist;
        });
      });
  }

}

export default new ExpensesPage()