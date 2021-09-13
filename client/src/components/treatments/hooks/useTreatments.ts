import { useToast } from '@chakra-ui/react';
import { useQuery } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const fallback = [];
  const toast = useCustomToast();
  // TODO: get data from server via useQuery
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments, {
    onError: (error) => {
      const title =
        // is javascript Error
        error instanceof Error
          ? // Regex remove
            error.toString().replace(/^Error:\s*/, '')
          : //
            'error connecting to the server';
      toast({ title, status: 'error' });
    },
  });
  return data;
}
