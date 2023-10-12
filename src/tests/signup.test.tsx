import React from 'react';
import { render } from '@testing-library/react';
import Signup from '../pages/signup';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';


test('user can sign up successfully', async () => {
    const { findByTitle, findByText, getByTitle, findByPlaceholderText } = render(<Signup />);

    const Title = await findByText('Enter email and password to get started');

    const userInput = await findByPlaceholderText('Username')
    const emailInput = await getByTitle('email text');
    const passwordInput = await findByTitle('password text');
    const confirmedPasswordInput = await findByTitle('confirmed password text');

    fireEvent.ionChange(userInput, 'test');
    fireEvent.ionChange(emailInput, 'm@test.com');
    fireEvent.ionChange(passwordInput, "123456");
    fireEvent.ionChange(confirmedPasswordInput, "123456");

    // const addButton = await findByText('Signup');
    // fireEvent.click(addButton);
});

