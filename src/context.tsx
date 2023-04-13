import React, { createContext } from "react";
export interface IHooksContextProps {
    useQueryDisplayData: {
        timeout?: [min: number, max: number],
        loader?:  JSX.Element | null;
    }
}

const defaultQueryDisplayData: IHooksContextProps["useQueryDisplayData"] = {};

const HooksProviderContext = createContext<IHooksContextProps>({ useQueryDisplayData: defaultQueryDisplayData });


export default function HooksProvider({ children, useQueryDisplayData}: IHooksContextProps & { children: React.ReactNode}) {
    return (
        <HooksProviderContext.Provider value={{ useQueryDisplayData }}>
            {children}
        </HooksProviderContext.Provider>
    );
}

export const useQueryDisplayDataContext = () => React.useContext(HooksProviderContext);

export const withUseQueryDisplayDataContext = (Component: React.FunctionComponent) => (props: any) => {
    const { useQueryDisplayData } = useQueryDisplayDataContext();
    return <Component {...props} useQueryDisplayData={useQueryDisplayData} />;
};