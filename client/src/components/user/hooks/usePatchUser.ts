import { useCustomToast } from 'components/app/hooks/useCustomToast';
import jsonpatch from 'fast-json-patch';
import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';
import { queryKeys } from 'react-query/constants';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // AUTH PROTECTED

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): UseMutateFunction<
  User,
  unknown,
  User,
  unknown
> {
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient();
  const toast = useCustomToast();
  const { mutate: patchUser } = useMutation(
    (newUserData: User) => patchUserOnServer(newUserData, user),
    {
      onMutate: async (newData: User | null) => {
        // cancel any outgoing queries for user data to old server data
        // will not overwrite our optimistic update
        queryClient.cancelQueries(queryKeys.user);
        // snapshot previous user valuue
        const previousUserData: User = queryClient.getQueryData(queryKeys.user);
        // optimistically update the cache with the new value
        updateUser(newData);
        // return ctx object with snapshotted value
        return { previousUserData };
      },
      onError: (error, newData, previousUserCtx) => {
        // rollback to saved value
        if (previousUserCtx.previousUserData)
          updateUser(previousUserCtx.previousUserData);
        toast({
          title: 'Failed to update!',
          status: 'warning',
        });
      },
      onSuccess: (userData: User | null) => {
        if (user) {
          // already done onMutate // updateUser(userData);
          toast({
            title: 'User updated!',
            status: 'success',
          });
        }
      },
      onSettled: () => {
        // invalidate user query to ensure server synchronicity
      },
    },
  );
  return patchUser || null;
}
