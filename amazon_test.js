function calcTotal(a, b) {
  return a + b
}


describe('amazon snickers skittles', () => {
  it('verify cart calculation & checkout step', () => {

    //open page
    cy.visit('https://www.amazon.de/')
    //clear cookies
    cy.clearCookies()
    //verify page title, to ensure that correct page is displayed
    cy.title().should('include', 'Amazon.de')

    //accept all cookies
    cy.get('#a-autoid-0 > span')
      .click()


    /**
     * search for 1st product
    */

    //enter 'snickers in search input field
    cy.get('#twotabsearchtextbox')
      .clear()
      .type('snickers')
    //execute search query
    cy.get('.nav-searchbar')
      .submit()
    //verify if search results appears
    cy.get('#search')
      .find('div.s-main-slot > div')
      .should('be.visible')

    //select snickers as brand
    cy.get('#brandsRefinements > ul > li.a-spacing-micro > span > a')
      .contains('span', /Snickers/)
      .click()

    //set sorting to price ascending 
    cy.get("select[id='s-result-sort-select']")
      .select('price-asc-rank', { force: true })

    //get first product which is not amazon fresh and has stock
    cy.get('div.s-main-slot.s-result-list.s-search-results.sg-row > div')
      .find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-base.a-color-secondary.s-align-children-center > div.a-row > span > span')
      .parents('.a-section.a-spacing-medium')
      .find('div.a-row.a-size-base.a-color-base > div.a-row > a > span.a-price > span > span')
      .filter('.a-price-whole')
      .first()
      .click()

    //get price for product 1 and store to variable p1
    cy.get('#cerberus_feature_div > div#cerberus-data-metrics')
      .invoke('attr', 'data-asin-price')
      .then($p1 => {
        const p1 = parseFloat($p1)
        cy.wrap(p1).as('p1')
        cy.log("Text value is :", $p1);
      })
    
    //add product to cart      
    cy.get('#add-to-cart-button')
      .click()


    /**
     * search for 2nd product
    */
        
    //search for skittles
    cy.get('#twotabsearchtextbox')
      .clear()
      .type('skittles')           //enter search query

    cy.get('.nav-searchbar')      //execute search query
      .submit()

    //select snickers as brand
    cy.get('#brandsRefinements > ul > li.a-spacing-micro > span > a')
      .contains('span', /Skittles/)
      .click()

    //set sorting to price ascending 
    cy.get("select[id='s-result-sort-select']")
      .select('price-asc-rank', { force: true })

    //get first product which is not amazon fresh and has stock
    cy.get('div.s-main-slot.s-result-list.s-search-results.sg-row > div')
      .find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-base.a-color-secondary.s-align-children-center > div.a-row > span > span')
      .parents('.a-section.a-spacing-medium')
      .find('div.a-row.a-size-base.a-color-base > div.a-row > a > span.a-price > span > span')
      .filter('.a-price-whole')
      .first()
      .click()

    //get price for product 2 and store to variable p2
    cy.get('#cerberus_feature_div > div#cerberus-data-metrics')
      .invoke('attr', 'data-asin-price')
      .then($p2 => {
        const p2 = parseFloat($p2)
        cy.wrap(p2).as('p2')
        cy.log("Text value is :", $p2);
      })

    //add product t cart
    cy.get('#add-to-cart-button')
      .click()

    //visit cart page while click on btn to basket
    cy.get('#hlb-view-cart-announce')
      .click()
    //verify that cart page appears
    cy.get('div#a-page')
      .find('.a-container >  div')
      .should('have.id', 'content')    


    //get current cart total + verify if calucation is corect
    cy.get('#sc-subtotal-amount-buybox')
      .find('.a-size-medium')
      .then(($span) => {
        var currentCartTotal = parseFloat(($span.text()).replace(/[\s€]/g, '').replace(/,/g, '.'))
        //cy.log("Currect cart total is: ", currentCartTotal)
        
        //load value from product1
        cy.get('@p1').then(p1 => {
           //load value from product2
          cy.get('@p2').then(p2 => {
            //calculate expected cart total
            const isTotal = parseFloat(calcTotal(p1, p2))
            //cy.log("Calculated cart total is: ", isTotal);
            //compare current with expected cart total
            expect(currentCartTotal).to.equal(isTotal)
          })
        })
      })
    
    //enter checkout
    cy.get('#sc-buy-box-ptc-button')
      .click()
    
    //verify if customer has to create an account bevore enter checkout
    cy.get('#a-page')
      .find('span#auth-create-account-link > span > a')
      .should('have.id', 'createAccountSubmit')    

  })
})
