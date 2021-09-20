import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { createQueryClientWrapper } from 'test-utils';

import { useStaff } from '../hooks/useStaff';

test('filter staff', async () => {
  const { result, waitFor } = renderHook(useStaff, {
    wrapper: createQueryClientWrapper(),
  });

  // wait for staff to populate
  await waitFor(() => result.current.staff.length === 4);

  // set to filter only staff who give scrub
  act(() => result.current.setFilter('scrub'));

  // wait for staff list state to update, should be 3
  await waitFor(() => result.current.staff.length === 2);
});
