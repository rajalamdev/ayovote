import useSWR from "swr"

export function useVotes () {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, error, isLoading } = useSWR(`/api/votes`, fetcher)
   
    return {
      data: data?.data,
      isLoading,
      isError: error
    }
}