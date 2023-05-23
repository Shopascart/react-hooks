export const GenerateRandomTimeOutNumber = (from: number, to: number) => {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

export const ISFUNC = (value: any) => {
    return typeof value === "function"
}

export const ISOBJ = (value: any) => {
    return typeof value === "object" && !ISARRAY(value) && !ISFUNC(value) && value !== null
}



const ISARRAY = (value: any) => {
    return Array.isArray(value)
}

export const ISCLIENT = () => {
    return typeof window !== 'undefined';
}


export const ISEMPTY = (value: any) => {
    if (ISARRAY(value)) {
        return value.length === 0;
    } else if (ISOBJ(value)) {
        return Object.keys(value).length === 0;
    } else {
        return value === null || value === undefined || value === '' || value === 0 || value === false;
    }
}


export const ISSTRINGEMPTY = (value: string) => {
    return value === '';
}

export const STRICTEMPTY = (value: any) => {
    return ISEMPTY(value) || value === "null" || value === "undefined"
}