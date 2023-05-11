import { useQuery } from "react-query";
import { GenerateRandomTimeOutNumber } from "../../utils";
import { useEffect, useState } from "react";

export interface IUseLoaderProps {
    timeout?: number;
    loadOnRouteChange?: boolean;
    setLoading?: (val: boolean) => void;
}
/**
 * Use this hook to control the loading state of a component.
 * @param config - { timeout: number, loadOnRouteChange: boolean } 
 * @example
 * const { loading } = useLoader();
 * @example
 * const { loading } = useLoader({ timeout: 1000, loadOnRouteChange: true });
 * Note: This hook uses react-query to handle the loading state.
 */
function useLoader(id: string): { loading: boolean, setLoading: (val: boolean) => void };
function useLoader(id: string, { timeout, loadOnRouteChange, setLoading }: IUseLoaderProps): { loading: boolean, setLoading: (val: boolean) => void };
function useLoader(id: string, { timeout }: IUseLoaderProps): { loading: boolean, setLoading: (val: boolean) => void };
function useLoader(id: string, { loadOnRouteChange }: IUseLoaderProps): { loading: boolean, setLoading: (val: boolean) => void };


function useLoader(id: string, config: unknown = {}): { loading: boolean, setLoading: (val: boolean) => void } {

    const { timeout, loadOnRouteChange } = config as IUseLoaderProps;
    const time = timeout ? timeout : GenerateRandomTimeOutNumber(1000, 1500);
    const loadOnRoute = loadOnRouteChange ? loadOnRouteChange : false;
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (loadOnRoute) {
            setTimeout(() => {
                setIsLoading(false);
            }, time);
        }
    }, [loadOnRoute]);


    const LoadingQuery = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        })
    }

    const { isLoading: loading } = useQuery(id, LoadingQuery, {
        onSuccess: () => {
            setIsLoading(false);
        },
    });
    const setLoading = (val: boolean) => {
        setIsLoading(val);
    }
    if (typeof config === "object") {
        return {
            loading: loadOnRoute ? isLoading : loading,
            setLoading
        }
    } else {
        return {
            loading: loadOnRoute ? isLoading : loading,
            setLoading: () => { }
        }
    }
}

export default useLoader;