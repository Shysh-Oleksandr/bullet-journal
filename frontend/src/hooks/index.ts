import axios from 'axios';
import { useEffect, useState } from 'react';
import logging from '../config/logging';

export function useFetchData<T>(method: string = 'GET', url: string, name: string, dependencies: any = null): [T[], boolean] {
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
                logging.info("Can't get items");
            }
        } catch (error) {
            logging.info('Catch: ' + error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [dependencies]);

    return [items, loading];
}
