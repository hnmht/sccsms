import { useState, useEffect } from 'react';
const adjustHeight = 205;
function useContentHeight() {
    const [contentHeight, setContentHeight] = useState(window.innerHeight - adjustHeight);

    useEffect(() => {
        function debounce(fn, interval) {
            let timer;
            return () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    timer = null;
                    fn.apply(this);
                }, interval);
            };
        }

        const debouncedHandleResize = debounce(() => {
            setContentHeight(window.innerHeight - adjustHeight);
        }, 1000);

        window.addEventListener('resize', debouncedHandleResize);

        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        };
    }, [contentHeight]);

    return contentHeight;
}

export default useContentHeight;
