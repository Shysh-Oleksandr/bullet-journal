import axios from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';

export function useDebounce(value: any, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    return debouncedValue;
}

export function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

export function useOnClickOutside(ref, handler) {
    useEffect(
        () => {
            const listener = (event) => {
                // Do nothing if clicking ref's element or descendent elements
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener('mousedown', listener);
            document.addEventListener('touchstart', listener);
            return () => {
                document.removeEventListener('mousedown', listener);
                document.removeEventListener('touchstart', listener);
            };
        },
        // Add ref and handler to effect dependencies
        // It's worth noting that because the passed-in handler is a new ...
        // ... function on every render that will cause this effect ...
        // ... callback/cleanup to run every render. It's not a big deal ...
        // ... but to optimize you can wrap handler in useCallback before ...
        // ... passing it into this hook.
        [ref, handler]
    );
}

export function useFetchData<T>(method: string = 'GET', url: string, name: string): [T[], boolean] {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchData() {
        setLoading(true);
        try {
            const response = await axios({
                method: method,
                url: url
            });

            if (response.status === 200 || response.status === 304) {
                let data = response.data[name] as T[];

                setItems(data);
            } else {
                console.log("Can't get items");
            }
        } catch (error) {
            console.log('Catch: ' + error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return [items, loading];
}
