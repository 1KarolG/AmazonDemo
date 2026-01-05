import { Configuration } from "../configuration";

export class AmazonPage {
    static readonly navigationMenu = '#nav-hamburger-menu';
    static readonly warningDismiss = '[data-action-type="DISMISS"]';
    static readonly cookiesAccept = '[data-action="banner-accept-all"]';
    static readonly customerBanner = '#hmenu-customer-name';
    static readonly filtersSection = '[aria-label="Filters"]';
    static readonly filteredItemsList = '[data-cy="asin-faceout-container"]';
    static readonly minPrice = '[aria-label="Minimum price"]';
    static readonly maxPrice = '[aria-label="Maximum price"]';

    static closePopups() {
        cy.get(this.navigationMenu).should('be.visible');
        cy.get('body').then(($body) => {
            if ($body.find(this.cookiesAccept).length > 0) {
                cy.get(this.cookiesAccept).click();
                cy.reload({ timeout: Configuration.longTimeout });
            } else {
                cy.log('Cannot find Cookie accept button');
            }
            if ($body.find(this.warningDismiss).length > 0) {
                cy.get(this.warningDismiss).click();
            } else {
                cy.log('Cannot find Dismiss button');
            }
        });
    }

    static navigateAmazonMenu(pathKey: string): void {
        cy.get(this.navigationMenu, { timeout: Configuration.longTimeout }).should('be.visible').click();
        cy.wait(Configuration.shortTimeout);
        cy.get(this.customerBanner, { timeout: Configuration.shortTimeout }).should('be.visible');
        cy.fixture<dataFormat>('menuPaths').then((paths) => {
            const menuPath = paths[pathKey];
            if (!menuPath) {
                cy.log(`Menu path "${pathKey}" not found in menuPaths.json`);
            }
            menuPath.forEach((menuText: string) => {
                cy.contains('a', menuText, { timeout: Configuration.shortTimeout })
                    .then(($el) => {
                        if (!$el.length) {
                            cy.log(`Menu item not found: ${menuText}`)
                            throw new Error(`Menu item not found: ${menuText}`)
                        }
                    })
                    .click({ force: true })
                    .then(() => {
                        cy.log(`Clicked menu: ${menuText}`)
                    })
            })
        });
    }

    static applyFilters(filterKey: string): void {
        cy.fixture<dataFormat>('itemsFilters').then((filters) => {
            const filterList = filters[filterKey];
            if (!filterList) {
                throw new Error(`Filter key "${filterKey}" not found in itemsFilters.json`);
            }
            filterList.forEach((filterName: string) => {
                cy.log(`Checking filter: ${filterName}`);
                cy.get(this.filtersSection, { timeout: Configuration.shortTimeout })
                    .contains('li', filterName, { timeout: Configuration.shortTimeout })
                    .then(($el) => {
                        if (!$el.length) {
                            cy.log(`Filter not found: ${filterName}`)
                            throw new Error(`Filter not found: ${filterName}`)
                        }
                    })
                    .find('input[type="checkbox"]')
                    .check({ force: true })
            })
        });
    }

    static setPriceRange(min: number, max: number): void {
        cy.contains('span', 'Price').scrollIntoView();
        cy.get(this.minPrice).then(($min) => {
            const input = $min[0] as HTMLInputElement;
            this.setPrice(min, input);
        })
        cy.get(this.maxPrice).then(($max) => {
            const input = $max[0] as HTMLInputElement;
            this.setPrice(max, input);
        })
        cy.wait(Configuration.shortTimeout);
    }

    private static setPrice(value: number, input: HTMLInputElement): void {
        input.value = value.toString();
        input.setAttribute('aria-valuenow', value.toString());
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();
    }
}

interface dataFormat {
    [key: string]: string[]
}