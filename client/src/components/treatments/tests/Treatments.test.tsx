import { render, screen } from '@testing-library/react';
import { renderWithQueryClient } from 'test-utils';

import { Treatments } from '../Treatments';

test('renders response from query', async () => {
  // wrap component with React-Query Provider
  renderWithQueryClient(<Treatments />);

  const treatmentTitle = await screen.findAllByRole('heading', {
    // look for strings !case-sensitive
    name: /massage|facial|scrub/i,
  });
  expect(treatmentTitle).toHaveLength(3);
});
