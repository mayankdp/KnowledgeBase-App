describe('mobile-tests', () => {
  beforeEach(() => {
    cy.viewport('iphone-8')
  })

  // Tests here
  it('Testing login', () => {
    var email = "p@p.com";
    var password = "password";

    cy.visitMobile('/login')

    cy.get('ion-button').then(($ele) => {
      if ($ele.hasClass('homeButtons')) {
        cy.contains('Profile').click();
        cy.get('#settings').click();
        cy.wait(1000)
        cy.get('#logout').click();
        cy.visit('/login')
        cy.get('#email').type(email);
        cy.get('#password').type(password);
        cy.contains('Sign in').click()
      } else {
        cy.get('#email').type(email);
        cy.get('#password').type(password);
        cy.contains('Sign in').click()
      }
    })
  })

  it('Testing answering questions', () => {
    cy.get("#answer").click()
    cy.contains('History').click()
    cy.contains('Fish blood').click()
    cy.get("#back").click()
    cy.wait(500)
    cy.get("#back").click()
  })

  it('Testing packs', () => {
    cy.get('#packs').click()
    cy.contains('Anime').click()
    cy.contains('Demon Slayer').click()
    cy.contains('Back to Packs').click()

    cy.contains('Create a new pack').click()
    cy.get('#input').type("Test Pack")
    cy.contains('Add Question').click()

    cy.get("#question").type("Lorem ipsum")
    cy.get("#option1").type("Lorem ipsum")
    cy.get("#option2").type("Lorem ipsum")
    cy.get("#option3").type("Lorem ipsum")
    cy.get("#option4").type("Lorem ipsum")
    cy.get("#select").click()
    cy.contains('.alert-radio-label', 'Option A').click()
    cy.contains('OK').click()
    cy.contains("Show Preview").click()
    cy.contains("Submit Question").click()

    cy.contains('Add Question').click()
    cy.get("#question").type("Another Question")
    cy.get("#option1").type("Another Answer")
    cy.get("#option2").type("Another Answer")
    cy.get("#option3").type("Another Answer")
    cy.get("#option4").type("Another Answer")
    cy.get("#select").click()
    cy.contains('.alert-radio-label', 'Option A').click()
    cy.contains('OK').click()
    cy.contains("Show Preview").click()
    cy.contains("Submit Question").click()

    cy.contains("Lorem ipsum").parent()
      .swipe('right',"left")
    cy.contains("Remove").click()

    cy.contains('Add Question').click()
    cy.get("#question").type("Editing test")
    cy.get("#option1").type("A")
    cy.get("#option2").type("B")
    cy.get("#option3").type("C")
    cy.get("#option4").type("D")
    cy.get("#select").click()
    cy.contains('.alert-radio-label', 'Option A').click()
    cy.contains('OK').click()
    cy.contains("Submit Question").click()
    
    cy.wait(500)
    cy.get("#create").click()
    cy.contains('Yes').click()

    cy.wait(1000)
    cy.get('#packs').click()
    cy.contains("Your Packs").click()
    cy.contains("Test Pack").click()

    cy.wait(500)
    cy.contains("Editing test").parent()
      .swipe('right',"left")
    
    cy.wait(500)
    cy.get("#1").click()

    cy.get("#question").type(" Edited Quesiton")
    cy.get("#option1").type("B")
    cy.get("#option2").type("D")
    cy.get("#option3").type("A")
    cy.get("#option4").type("C")

    cy.get("#select").click()
    cy.contains('.alert-radio-label', 'Option C').click()
    cy.contains('OK').click()
    cy.contains("Submit Question").click()

    cy.wait(1000)
    cy.contains("Submit").click()

    cy.wait(1000)
    cy.get('#packs').click()
    cy.contains("Your Packs").click()

    cy.contains("Test Pack").parent()
      .swipe('right',"left")

    cy.get("#3").click()
    cy.contains("Yes").click()
  })

  it("Running through other parts of the app", () => {
    cy.get("#back").click()

    cy.contains('Leaderboard').click();
    cy.wait(500)
    cy.contains("deedee").click();
    cy.wait(500)
    cy.get("#back").click()
    cy.wait(500)
    cy.contains('Profile').click();
    cy.wait(500)
    cy.get('#settings').click();
    cy.wait(1000)
    cy.get('#logout').click();
  })
})