import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaperListScreen from './PaperListScreen';

test('PaperListScreen renders correctly', () => {
  render(<PaperListScreen />);
  
  // Check if the component's title is present
  const titleElement = screen.getByText('ArXiv Papers');
  expect(titleElement).toBeInTheDocument();
  
  // Check for other expected elements
  const paperListContainer = screen.getByRole('list');
  expect(paperListContainer).toBeInTheDocument();
});
