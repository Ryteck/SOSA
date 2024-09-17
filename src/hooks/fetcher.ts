import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";

const fetcher = <T>(url: string): Promise<T> =>
	fetch(url).then(async (res) => await res.json());

export const useFetcher = <T>(
	url: string,
	configuration?: SWRConfiguration,
): SWRResponse<T> => useSWR<T>(url, fetcher, configuration);
