import { screen } from '@testing-library/react';
import { renderWithQueryClient } from 'test-utils';

// import { rest } from 'msw';
// import { defaultQueryClientOptions } from '../../../react-query/queryClient';
// import { server } from '../../../mocks/server';
import { AllStaff } from '../AllStaff';

test('renders response from query', async () => {
  // wrap component with React-Query Provider
  renderWithQueryClient(<AllStaff />);

  const treatmentTitle = await screen.findAllByRole('heading', {
    // look for strings !case-sensitive
    name: /divya|sandra|michael|mateo/i,
  });
  expect(treatmentTitle).toHaveLength(4);
});

test('handles query error', async () => {
  // (re)set handler to return a 500 error for staff
  // server.resetHandlers(
  //   rest.get('http://localhost:3030/staff', (req, res, ctx) => {
  //     return res(ctx.status(500));
  //   }),
  // );
});
