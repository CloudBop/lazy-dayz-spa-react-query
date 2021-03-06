import { act, renderHook } from '@testing-library/react-hooks';

import { createQueryClientWrapper } from '../../../test-utils';
import { useAppointments } from '../hooks/useAppointments';

test('filter appointments by availability', async () => {
  // test goes here
  const { result, waitFor } = renderHook(useAppointments, {
    wrapper: createQueryClientWrapper(),
  });

  await waitFor(() => result.current.appointments !== {});
  const filteredAppointmentsLength = Object.keys(result.current.appointments)
    .length;

  // set to show all appointments
  act(() => result.current.setShowAll(true));

  // wait for state to update
  await waitFor(
    () =>
      Object.keys(result.current.appointments).length >
      filteredAppointmentsLength,
  );
});
