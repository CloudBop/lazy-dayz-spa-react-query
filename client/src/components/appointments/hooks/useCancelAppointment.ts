import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useCancelAppointment(): UseMutateFunction<
  void, // returns void
  unknown, // erro
  Appointment, // argument
  unknown // onMutate?
> {
  const queryClient = useQueryClient();
  const toast = useCustomToast();
  const { mutate } = useMutation(removeAppointmentUser, {
    onSuccess: () => {
      //  this route note protected via jwt auth
      queryClient.invalidateQueries([
        // apointments for user + month
        queryKeys.appointments,
      ]);
      //
      toast({
        title: 'You have cancelled the appointment',
        status: 'warning',
      });
    },
  });
  return mutate;
}
