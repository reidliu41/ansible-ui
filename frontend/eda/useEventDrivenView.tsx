import { HTTPError } from 'ky'
import { useCallback, useMemo, useRef } from 'react'
import useSWR from 'swr'
import { ISelected, ITableColumn, IToolbarFilter, useSelected } from '../../framework'
import { IView, useView } from '../../framework/useView'
import { getItemKey, useFetcher } from '../Data'

export type IEdaView<T extends { id: number }> = IView &
  ISelected<T> & {
    itemCount: number | undefined
    pageItems: T[] | undefined
    refresh: () => Promise<T[] | undefined>
    selectItemsAndRefresh: (items: T[]) => void
    unselectItemsAndRefresh: (items: T[]) => void
  }

export function useEdaView<T extends { id: number }>(options: {
  url: string
  toolbarFilters?: IToolbarFilter[]
  tableColumns?: ITableColumn<T>[]
  disableQueryString?: boolean
}): IEdaView<T> {
  const { url } = options
  const { toolbarFilters, tableColumns, disableQueryString } = options
  const view = useView(
    { sort: tableColumns && tableColumns.length ? tableColumns[0].sort : undefined },
    disableQueryString
  )
  const itemCountRef = useRef<{ itemCount: number | undefined }>({ itemCount: undefined })

  const { page, perPage, sort, sortDirection, filters } = view

  let queryString = ''

  if (filters) {
    for (const key in filters) {
      const toolbarFilter = toolbarFilters?.find((filter) => filter.key === key)
      if (toolbarFilter) {
        const values = filters[key]
        if (values.length > 0) {
          queryString ? (queryString += '&') : (queryString += '?')
          if (values.length > 1) {
            queryString += values.map((value) => `or__${toolbarFilter.query}=${value}`).join('&')
          } else {
            queryString += `${toolbarFilter.query}=${values.join(',')}`
          }
        }
      }
    }
  }

  if (sort) {
    queryString ? (queryString += '&') : (queryString += '?')
    if (sortDirection === 'desc') {
      queryString += `order_by=-${sort}`
    } else {
      queryString += `order_by=${sort}`
    }
  }

  queryString ? (queryString += '&') : (queryString += '?')
  queryString += `page=${page}`

  queryString ? (queryString += '&') : (queryString += '?')
  queryString += `page_size=${perPage}`

  // url += queryString
  const fetcher = useFetcher()
  const response = useSWR<T[]>(url, fetcher)
  const { data, mutate } = response
  const refresh = useCallback(() => mutate(), [mutate])

  // useSWR<T[]>(data?.next, fetcher, swrOptions)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let error: Error | undefined = response.error
  if (error instanceof HTTPError) {
    if (error.response.status === 404 && view.page > 1) {
      view.setPage(1)
      error = undefined
    }
  }

  const selection = useSelected(data ?? [], getItemKey)

  if (data !== undefined) {
    itemCountRef.current.itemCount = data.length
  }

  const selectItemsAndRefresh = useCallback(
    (items: T[]) => {
      selection.selectItems(items)
      void refresh()
    },
    [refresh, selection]
  )

  const unselectItemsAndRefresh = useCallback(
    (items: T[]) => {
      selection.unselectItems(items)
      void refresh()
    },
    [refresh, selection]
  )

  return useMemo(() => {
    return {
      refresh,
      itemCount: itemCountRef.current.itemCount,
      pageItems: data,
      error,
      ...view,
      ...selection,
      selectItemsAndRefresh,
      unselectItemsAndRefresh,
    }
  }, [data, error, refresh, selectItemsAndRefresh, selection, unselectItemsAndRefresh, view])
}

export async function getEdaError(err: unknown) {
  if (err instanceof HTTPError) {
    try {
      const response = (await err.response.json()) as { __all__?: string[] }
      if ('__all__' in response && Array.isArray(response.__all__)) {
        return JSON.stringify(response.__all__[0])
      } else {
        return JSON.stringify(response)
      }
    } catch {
      return err.message
    }
  } else if (err instanceof Error) {
    return err.message
  } else {
    return 'unknown error'
  }
}