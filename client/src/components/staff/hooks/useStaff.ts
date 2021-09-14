import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import type { Staff } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { filterByTreatment } from '../utils';

// for when we need a query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState('all');
  // cache the functionn
  const selectFn = useCallback(
    // ... also utilised within react-query
    (unfilteredStaff) => filterByTreatment(unfilteredStaff, filter),
    // only requery if filter changes
    [filter],
  );

  const fallback = [];
  const { data: staff = fallback } = useQuery(queryKeys.staff, getStaff, {
    select: filter === 'all' ? undefined : selectFn, // select !option for prefetch queries
    //   keepPreviousData: true, // not a good option here, uncomment to see why
  });

  return { staff, filter, setFilter };
}
