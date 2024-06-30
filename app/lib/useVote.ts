import useSWR from "swr"

export function useVote (code: string) {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, mutate, error, isLoading } = useSWR(`/api/votes/${code}`, fetcher)

    // console.log(data)
   
    return {
      data: data?.data,
      mutate,
      isLoading,
      isError: error
    }
}