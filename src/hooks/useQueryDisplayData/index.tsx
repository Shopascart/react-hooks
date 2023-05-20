interface IQueryObj {
    key: Array<string | boolean | number | any>;
    queryFn: ({ pageParam }: { pageParam?: number }) => Promise<any>;
    options?: {
        enabled: boolean;
        retry?: QueryOptions['retry'];
        retryDelay?: QueryOptions['retryDelay'];
        getNextPageParam?: QueryOptions['getNextPageParam'];
        onSuccess?: (data: any) => void;
        onError?: (error: any) => void;
        refetchOnWindowFocus?: boolean;
        refetchOnMount?: boolean;
        refetchOnReconnect?: boolean;
        staleTime?: number;
        cacheTime?: number;
    },
}
import { useEffect, useState } from "react";
import { QueryOptions, useQuery, UseQueryOptions } from "react-query";
import { GenerateRandomTimeOutNumber } from "../../utils";
import { useQueryDisplayDataContext } from "../../context";

export interface IAPIResponse<T> {
    data: T;
    status: {
        code: number;
        message: string;
        indication: "success" | "failure";
    }
}



/**
 * A React Component that displays data from useQuery hook
 */
export default function UseQueryDisplayData<IData>({ queryObj, condition, callback, timeout, setters, refetch, loader, useEmptyOnNull= true }: {
    queryObj: IQueryObj
    condition: (res: IAPIResponse<IData>) => boolean
    callback: {
        onLoading: () => JSX.Element | null,
        onData: (data: IData) => JSX.Element | null,
        onEmpty: () => JSX.Element | null,
        onError: (response: IAPIResponse<IData>) => JSX.Element | null
        onNull?: () => JSX.Element | null
    }
    timeout?: [min: number, max: number],
    setters?: {
        setData: (data: IData) => void,
    },
    loader?: JSX.Element | null,
    refetch?: boolean,
    useEmptyOnNull?: boolean,
}) {
    const { key, queryFn, options } = queryObj;
    const { onLoading, onData, onEmpty, onError, onNull } = callback;
    const { isLoading, isError, data } = useQuery(key, queryFn, options);
    const { isLoading: _refetchLoading, isError: _refetchError, data: _refetchData } = useQuery(key, queryFn, options);
    const [loading, setLoading] = useState<boolean>(true);
    const _data = data as IAPIResponse<IData>;
    const { loader: defaultLoader, timeout: defaultTimeout } = useQueryDisplayDataContext().useQueryDisplayData;
    const loaderState = loader || defaultLoader;
    const timeoutState = timeout || defaultTimeout;
    useEffect(() => {
        if (condition(_data)) {
            if (setters) {
                const { setData } = setters;
                setData(_data.data);
            }
        } else {
            if (setters) {
                const { setData } = setters;
                setData(null as unknown as IData);
            }
        }
    }, [data]);

   


    if (isLoading) {
        return (
            <div className="data-loader">
                {loaderState ? loaderState : <div className="loader">Loading ....</div>}
            </div>
        )
    }
    else if (isError || _data?.status?.code && _data?.status?.code !== 200) {
        if (_data) {
            return onError(_data);
        } else {
            return onError({
                status: {
                    code: 500,
                    message: "Internal Server Error",
                    indication: "failure"
                },
                data: null as IData
            });
        }
    } else if (data) {
        if (condition(_data)) {
            if (timeoutState) {
                const [min, max] = timeoutState;
                const time = GenerateRandomTimeOutNumber(min, max);
                setTimeout(() => {
                    setLoading(false);
                }, time);
                if (loading) {
                    return onLoading();
                } else {
                    return onData(_data.data);
                }
            } else {
                return onData(data);
            }
        } else {
            return onEmpty();
        }
    }
    return useEmptyOnNull ? onEmpty() : onNull ? onNull() : null;
}

export function UseDisplayData({ condition, callback }: {
    condition: boolean,
    callback: {
        onLoading: () => JSX.Element,
        onData: () => JSX.Element,
        onEmpty: () => JSX.Element | null,
        onError: () => JSX.Element | null
    }
}) {
    const { onLoading, onData, onEmpty, onError } = callback;
    switch (condition) {
        case true:
            return onData();
        case false:
            return onEmpty();
        case null:
            return onLoading();
        case undefined:
            return onError();
        default:
            return null;
    }
}