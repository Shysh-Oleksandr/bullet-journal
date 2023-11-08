import { emptyAxiosApi } from '../../store/api/emptyAxiosApi';
import { Method, TAG } from '../../store/models';
import { CreateLabelRequest, CreateLabelResponse, CreateNoteRequest, CreateNoteResponse, FetchLabelsResponse, FetchNoteByIdResponse, FetchNotesResponse, UpdateLabelRequest, UpdateNoteRequest } from './types';

export const notesApi = emptyAxiosApi.injectEndpoints({
    endpoints(build) {
        return {
            fetchNotes: build.query<FetchNotesResponse, string>({
                query(userId) {
                    return {
                        url: `/notes/${userId}`,
                        method: Method.GET
                    };
                },
                providesTags: [TAG.NOTES]
            }),
            fetchNoteById: build.query<FetchNoteByIdResponse, string>({
                query(id) {
                    return {
                        url: `/notes/read/${id}`,
                        method: Method.GET
                    };
                },
            }),
            updateNote: build.mutation<void, UpdateNoteRequest>({
                query(payload) {
                    return {
                        url: `/notes/update/${payload._id}`,
                        method: Method.PATCH,
                        body: payload
                    };
                },
                invalidatesTags: [TAG.NOTES]
            }),
            createNote: build.mutation<CreateNoteResponse, CreateNoteRequest>({
                query(payload) {
                    return {
                        url: `/notes/create`,
                        method: Method.POST,
                        body: payload
                    };
                },
                invalidatesTags: [TAG.NOTES]
            }),
            deleteNote: build.mutation<void, string>({
                query(noteId) {
                    return {
                        url: `/notes/${noteId}`,
                        method: Method.DELETE
                    };
                },
                invalidatesTags: [TAG.NOTES]
            }),
            fetchLabels: build.query<FetchLabelsResponse, string>({
                query(userId) {
                    return {
                        url: `/customlabels/${userId}`,
                        method: Method.GET
                    };
                },
                providesTags: [TAG.LABEL]
            }),
            updateLabel: build.mutation<void, UpdateLabelRequest>({
                query(payload) {
                    return {
                        url: `/customlabels/update/${payload._id}`,
                        method: Method.PATCH,
                        body: payload
                    };
                },
                invalidatesTags: [TAG.LABEL]
            }),
            createLabel: build.mutation<CreateLabelResponse, CreateLabelRequest>({
                query(payload) {
                    return {
                        url: `/customlabels/create`,
                        method: Method.POST,
                        body: payload
                    };
                },
                invalidatesTags: [TAG.LABEL]
            }),
            deleteLabel: build.mutation<void, string>({
                query(labelId) {
                    return {
                        url: `/customlabels/${labelId}`,
                        method: Method.DELETE
                    };
                },
                invalidatesTags: [TAG.LABEL]
            })
        };
    },
    overrideExisting: false
});
