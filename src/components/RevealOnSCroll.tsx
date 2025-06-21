"use client";
import { useEffect, useRef, useState } from "react";
import React from "react";

export default function RevealCascade({
    children,
    index,
}: {
    children: React.ReactElement<any>;
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [delay, setDelay] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !visible) {
                    setVisible(true);

                    const calculatedDelay = index >= 6 ? (index - 5) * 150 : index * 150;
                    setDelay(calculatedDelay);
                }
            },
            { threshold: 0.2 }
        );

        const current = ref.current;
        if (current) observer.observe(current);
        return () => {
            if (current) observer.unobserve(current);
            observer.disconnect();
        };
    }, [visible, index]);

    return (
        <div ref={ref}>
            {React.cloneElement(children, {
                className: `${children.props.className || ""} ${visible ? "is-visible" : ""}`,
                style: {
                    ...children.props.style,
                    transitionDelay: `${delay}ms`,
                },
            })}
        </div>
    );
}
