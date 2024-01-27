import useSWR, { type SWRResponse, type SWRConfiguration } from 'swr'

async function fetcher<T>(url: string): Promise<T> {
  return await fetch(url).then(async res => await res.json())
}

export const useFetcher = <T>(
  url: string,
  configuration?: SWRConfiguration,
): SWRResponse<T> => {
  return useSWR<T>(url, fetcher, configuration)
}
