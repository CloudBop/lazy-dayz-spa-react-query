import { useQuery, useQueryClient } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const fallback = [];
  // TODO: get data from server via useQuery
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments, {
    staleTime: 600000, // 10m
    cacheTime: 900000, // 15m
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return data;
}

// populate cache on homepage
export function usePrefetchTreatments(): void {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments, {
    staleTime: 600000, // 10m
    cacheTime: 900000, // 15m
  });
}
