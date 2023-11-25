"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByCreatedDate = void 0;
const sortByCreatedDate = (entries) => {
    const sortedEntries = entries.slice().sort((a, b) => {
        if (!('createdAt' in a && 'createdAt' in b))
            return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return sortedEntries;
};
exports.sortByCreatedDate = sortByCreatedDate;
