import { useRouter } from "next/router";
import { useState } from "react";
import { ISCLIENT, ISEMPTY, STRICTEMPTY } from "../../utils";

/**
 * Get th redirect url from the query string
 * @param nextUrl  The url to redirect to after authentication
 * @param defaultUrl  The default url to redirect to if the nextUrl is empty
 * @param strictCheck  Strictly check if the nextUrl is empty or not e.g if nextUrl = null or undefined string
 * @returns 
 */
export function HandleRedirect(nextUrl: string, defaultUrl: string = "/", strictCheck: boolean = true): {
    url: string;
    encodedUrl: string;
} {
    const url_ = strictCheck ? STRICTEMPTY(nextUrl) ? defaultUrl : nextUrl : ISEMPTY(nextUrl) ? defaultUrl : nextUrl;
    const isEncoded = decodeURIComponent(url_) !== url_;
    if (isEncoded) {
        const next = decodeURIComponent(url_);
        const url = next.startsWith("/") ? next : "/" + next;
        return {
            url: url,
            encodedUrl: encodeURIComponent(url)
        }
    } else {
        const url = url_.startsWith("/") ? url_ : "/" + url_;
        return {
            url: url,
            encodedUrl: encodeURIComponent(url)
        }
    }
}

/**
 *  Return an encoded query url
 * @param nextUrl  The next url
 */
export function SetRedirectUrl(nextUrl: string): {
    url: string;
    encodedUrl: string;
} {
    const url = nextUrl.startsWith("/") ? nextUrl : "/" + nextUrl;
    return {
        url: url,
        encodedUrl: encodeURIComponent(url)
    }
}
export interface IUseAuth {
    isAuthenticated: boolean | null;
    cb: {
        onSuccess: () => React.ReactNode;
        onFailure?: () => React.ReactNode;
    }
    nextUrl?: string;
}
/**
 * A React hook that checks if the user is authenticated or not
 * @param {boolean} isAuthenticated - The value of the isAuthenticated state
 * @param {objec} cb - An object containing the callback functions
 * @param {function} cb.success - The success callback function
 * @param {function} cb.failure - The failure callback function
 * @param {string} nextUrl - The url to redirect to after authentication
 */


export default function UseAuth({ isAuthenticated, cb, nextUrl = SetRedirectUrl("/store").encodedUrl }: IUseAuth): React.ReactNode | any {
    const [path, setPath] = useState<string>(!STRICTEMPTY(nextUrl) ? nextUrl : SetRedirectUrl("/").encodedUrl);
    const router = useRouter();
    if (isAuthenticated !== null && isAuthenticated) {
        return cb.onSuccess();
    }
    else if (isAuthenticated !== null && !isAuthenticated) {
        if (cb.onFailure) {
            return cb.onFailure();
        } else {
            if (ISCLIENT()) {
                router.replace('/auth/signin?next=' + path);
            }
            return null;
        }
    }
    else {
        return null;
    }
}