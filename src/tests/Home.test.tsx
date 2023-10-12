import React from 'react';
import { findByTitle, fireEvent, render } from '@testing-library/react';
import Home from '../pages/Home';

test('page should have a title of Welcome to Knowledgebase', async () => {
  const { findByText } = render(<Home />);
  await findByText('Welcome to Knowledgebase');
  // const button = await findByText("Login")
  // fireEvent.click(button)
});