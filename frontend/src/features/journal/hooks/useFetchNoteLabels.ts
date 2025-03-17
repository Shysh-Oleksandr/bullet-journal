import { notesApi } from '../journalApi';

export const useFetchNoteLabels = (userId: string) => {
    const [fetchLabels] = notesApi.useLazyFetchLabelsQuery();

    const fetchNoteLabels = () => {
        fetchLabels({ userId, labelFor: 'Type' });
        fetchLabels({ userId, labelFor: 'Category' });
    };

    return fetchNoteLabels;
};
