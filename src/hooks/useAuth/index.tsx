import { useRouter } from "next/router";
import { useState } from "react";
import { ISCLIENT, STRICTEMPTY } from "../../utils";

/**
 * A React hook that checks if the user is authenticated or not
 * @param {boolean} isAuthenticated - The value of the isAuthenticated state
 * @param {objec} cb - An object containing the callback functions
 * @param {function} cb.success - The success callback function
 * @param {function} cb.failure - The failure callback function
 * @param {string} nextUrl - The url to redirect to after authentication
 */
export default function UseAuth({ isAuthenticated, cb, nextUrl = encodeURIComponent("/store") }: {
    isAuthenticated: boolean | null;
    nextUrl?: string;
    cb: {
        onSuccess: () => React.ReactNode;
        onFailure?: () => React.ReactNode;
    }
}): React.ReactNode | any {
    const [path, setPath] = useState<string>(!STRICTEMPTY(nextUrl) ? nextUrl : encodeURIComponent("/"));
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