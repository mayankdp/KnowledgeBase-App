import React from 'react';
import { render } from '@testing-library/react';
import Login from '../pages/login';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';


test('user can successfully change login form', async () => {
  const { findByTitle } = render(<Login />);

  const emailInput = await findByTitle('email text');
  const passwordInput = await findByTitle('password text');
//   const text = "yep";
//   fireEvent(emailInput, new CustomEvent('ionChange', {
//     detail: {text}
//   }));
  fireEvent.ionChange(emailInput, 'email@test.com');
  fireEvent.ionChange(passwordInput, "password123");

  // const button = await findByTitle("login");
  // fireEvent.click(button);
});

