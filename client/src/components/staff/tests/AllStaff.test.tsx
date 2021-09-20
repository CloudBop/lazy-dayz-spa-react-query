import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { QueryClientProvider, setLogger } from 'react-query';
import { generateQueryClient } from 'react-query/queryClient';

// import { defaultQueryClientOptions } from '../../../react-query/queryClient';
import { server } from '../../../mocks/server';
import { renderWithQueryClient } from '../../../test-utils/index';
import { AllStaff } from '../AllStaff';

/** - 
 console.warn
    [MSW] Warning: captured a request without a matching request handler:
 */

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
  server.resetHandlers(
    rest.get('http://localhost:3030/staff', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
    rest.get('http://localhost:3030/treatments', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  // supress react-query erros
  setLogger({
    log: console.log,
    warn: console.warn,
    error: () => {
      // swallow react-query erros without printing out
    },
  });

  //
  const queryClient = generateQueryClient();
  const options = queryClient.getDefaultOptions();
  // stop default retries
  options.queries = { ...options.queries, retry: false };
  queryClient.setDefaultOptions(options);

  render(
    <QueryClientProvider client={queryClient}>
      <AllStaff />
    </QueryClientProvider>,
  );

  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});
