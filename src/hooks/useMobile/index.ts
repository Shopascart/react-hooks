/*
 * Created on Thu May 11 2023
 *
 * Copyright (c) 2023 Shopascart
 */
import { useState, useEffect } from "react";
/**
 * Detect if the device is in mobile view
 */
export default function useMobile( { widthToDetect }: { widthToDetect?: number; }) {
    const [isMobile, setIsMobile] = useState(false);
    const [width, setWidth] = useState(0);

    const onResize = () => {
        const width = document.body.clientWidth;
        setWidth(width);
    };

    useEffect(() => {
        const width = document.body.clientWidth;
        setWidth(width);
    }, []);

    useEffect(() => {
        if (width <= (widthToDetect || 800)) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, [width]);

    useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return { isMobile, width }
}
