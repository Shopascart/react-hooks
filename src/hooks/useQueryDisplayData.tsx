interface IQueryObj {
    key: Array<string | boolean>;
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
import { GenerateRandomTimeOutNumber } from "../utils";

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
export default function UseQueryDisplayData<IData>({ queryObj, condition, callback, timeout, setters, refetch, loader }: {
    queryObj: IQueryObj
    condition: (res: IAPIResponse<IData>) => boolean
    callback: {
        onLoading: () => JSX.Element | null,
        onData: (data: IData) => JSX.Element | null,
        onEmpty: () => JSX.Element | null,
        onError: (response: IAPIResponse<IData>) => JSX.Element | null
    }
    timeout?: [number, number],
    setters?: {
        setData: (data: IData) => void,
    },
    refetch?: boolean
    loader?: JSX.Element | null
}) {
    const { key, queryFn, options } = queryObj;
    const { onLoading, onData, onEmpty, onError } = callback;
    const { isLoading, isError, data } = useQuery(key, queryFn, options);
    const { isLoading: _refetchLoading, isError: _refetchError, data: _refetchData } = useQuery(key, queryFn, options);
    const [loading, setLoading] = useState<boolean>(true);
    const _data = data as IAPIResponse<IData>;
    
    useEffect(() => {
        if (condition(_data)) {
            if (setters) {
                const { setData } = setters;
                setData(_data.data);
            }
        }
    }, [data]);

   


    if (isLoading) {
        return (
            <div className="data-loader">
                {loader ? loader : <div className="loader">Loading ....</div>}
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
            if (timeout) {
                const [min, max] = timeout;
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
    return null;
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