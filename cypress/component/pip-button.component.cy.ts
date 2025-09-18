import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

describe('PipButtonComponent', () => {
  it('renders projected content', () => {
    cy.mount('<pip-button>Click me</pip-button>', {
      imports: [PipButtonComponent],
    });
    cy.get('pip-button button').should('contain.text', 'Click me');
  });

  it('emits click when enabled', () => {
    const onClick = cy.stub().as('onClick');

    cy.mount('<pip-button (click)="onClick($event)">Tap</pip-button>', {
      imports: [PipButtonComponent],
      componentProperties: { onClick },
    });

    cy.contains('button', 'Tap').click();
    cy.get('@onClick').should('have.been.calledOnce');
  });

  it('does NOT emit when disabled', () => {
    const onClick = cy.stub().as('onClick');

    cy.mount(
      '<pip-button [disabled]="true" (click)="onClick($event)">Nope</pip-button>',
      {
        imports: [PipButtonComponent],
        componentProperties: { onClick },
      },
    );

    cy.get('pip-button button').should(($btn) => {
      const el = $btn[0] as HTMLButtonElement;
      expect(el.disabled, 'native disabled prop').to.equal(true);
    });
    cy.get('pip-button button').should('have.class', 'disabled');

    cy.get('pip-button button').then(($btn) => {
      ($btn[0] as HTMLButtonElement).click();
    });
    cy.get('@onClick').should('not.have.been.called');
  });
});
