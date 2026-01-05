import { Configuration } from "../support/configuration";
import { AmazonPage } from "../support/page-object/amazon-page.po"

describe('Verify Amazon page using UI tools', () => {
    const menuPath = 'mobilePhones';
    const filtersSet = 'mobileFilters';
    const minPrice = 5;
    const maxPrice = 25;
    const minFilteredResults = 2;

    before(() => {
        cy.viewport(Configuration.browserWidth, Configuration.browserHeight);
        cy.visit(Configuration.baseURL);
        AmazonPage.closePopups();
    })

    after(() => {
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
    })

    it('Verify inventory items filtering', () => {
        AmazonPage.navigateAmazonMenu(menuPath);
        AmazonPage.applyFilters(filtersSet);
        AmazonPage.setPriceRange(minPrice, maxPrice);
        cy.get(AmazonPage.filteredItemsList, { timeout: Configuration.longTimeout }).should('have.length.at.least', minFilteredResults);
    })
})