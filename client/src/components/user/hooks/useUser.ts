import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

interface AxiosResponseWithCancel extends AxiosResponse {
  cancel: () => void;
}

// now returning axiosResponsetype
async function getUser(user: User | null): Promise<AxiosResponseWithCancel> {
  const source = axios.CancelToken.source();

  if (!user) return null;
  // store axios
  const axiosResponse: AxiosResponseWithCancel = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
      cancelToken: source.token,
    },
  );

  axiosResponse.cancel = () => {
    // cancel request
    source.cancel();
  };

  return axiosResponse;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const queryClient = useQueryClient();

  // TODO: call useQuery to update user data from server
  useQuery(queryKeys.user, () => getUser(user), {
    enabled: !!user,
    // updating onSuccess based on changes in React Query
    // see https://www.udemy.com/course/learn-react-query/learn/#questions/15581842/ for more details
    // onSuccess: (axiosResponse) => setUser(axiosResponse?.data?.user)
    onSuccess: (data: User) => setUser(data),
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // set user in state
    setUser(newUser);

    // update user in localstorage
    setStoredUser(newUser);

    // TODO: pre-populate user profile in React Query client;
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // update state
    setUser(null);

    // remove from localstorage
    clearStoredUser();

    // reset user to null in query client
    queryClient.setQueryData(queryKeys.user, null);
    // remove
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
