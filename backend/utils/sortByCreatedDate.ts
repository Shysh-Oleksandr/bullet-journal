export const sortByCreatedDate = (entries: any[]): any[] => {
    const sortedEntries = entries.slice().sort((a, b) => {
        if (!('createdAt' in a && 'createdAt' in b)) return 1;

        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return sortedEntries;
};
