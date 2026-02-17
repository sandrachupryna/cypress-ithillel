import BasePage from './base/BasePage';

class ExpensesPage extends BasePage {

  selectors = {
    expensesPanel: '.panel-page_content',
    carSelectDropdown: '#carSelectDropdown',
    addExpenseBtn: '.panel-page .btn',
    expenseTable: '.expenses_table'
  } 

  elements = {
    addExpenseButton: () => cy.get(this.selectors.addExpenseBtn).contains('Add an expense'),
    carSelectDropdown: () => cy.get(this.selectors.carSelectDropdown),
    expenseTable: () => cy.get(this.selectors.expenseTable)
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

  shouldHaveEmptyState() {
    cy.get(this.selectors.expensesPanel).should('contain.text', "You don’t have any cars in your garage");
    this.elements.expenseTable().should('not.exist');
  }
}

export default new ExpensesPage()