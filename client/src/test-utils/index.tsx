// eslint-disable no-console
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { generateQueryClient } from 'react-query/queryClient';

// import { defaultQueryClientOptions } from '../react-query/queryClient';
setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {
    // swallow react-query erros without printing out
  },
});
// fn to generate unique query client for each test
const generateTestQueryClient = () => {
  const client = generateQueryClient();
  // stop default retries
  const opts = client.getDefaultOptions();
  opts.queries = { ...opts.queries, retry: false };
  return client;
};

export function renderWithQueryClient(
  ui: ReactElement,
  client?: QueryClient,
): RenderResult {
  const queryClient = client ?? generateTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}> {ui}</QueryClientProvider>,
  );
}

// FOR TESTING CUSTOM HOOKS
// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  const queryClient = generateQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
