import { emptyAxiosApi } from '../../store/api/emptyAxiosApi';
import { Method } from '../../store/models';
import {
    CreateLabelRequest,
    CreateLabelResponse,
    CreateNoteRequest,
    CreateNoteResponse,
    FetchLabelsRequestPayload,
    FetchLabelsResponse,
    FetchNoteByIdResponse,
    FetchNotesResponse,
    UpdateLabelRequest,
    UpdateNoteRequest
} from './types';

const USER_ID = 123;

export const notesApi = emptyAxiosApi.injectEndpoints({
    endpoints(build) {
        return {
            uploadImages: build.query<{urls: string[]}, FormData>({
                query(data) {
                    return {
                        url: `/images/uploadMany`,
                        method: Method.POST,
                        body: data,
                        headers: { 'x-user-id': USER_ID.toString() }
                    };
                }
            }),
            fetchNotes: build.query<FetchNotesResponse, string>({
                query(userId) {
                    return {
                        url: `/notes/${userId}`,
                        method: Method.GET
                    };
                },
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
            }),
            createNote: build.mutation<CreateNoteResponse, CreateNoteRequest>({
                query(payload) {
                    return {
                        url: `/notes/create`,
                        method: Method.POST,
                        body: payload
                    };
                },
            }),
            deleteNote: build.mutation<void, string>({
                query(noteId) {
                    return {
                        url: `/notes/${noteId}`,
                        method: Method.DELETE
                    };
                },
            }),
            fetchLabels: build.query<FetchLabelsResponse, FetchLabelsRequestPayload>({
                query({userId, labelFor}) {
                    return {
                        url: `/customlabels/${userId}?labelFor=${labelFor}`,
                        method: Method.GET
                    };
                },
            }),
            updateLabel: build.mutation<void, UpdateLabelRequest>({
                query(payload) {
                    return {
                        url: `/customlabels/update/${payload._id}`,
                        method: Method.PATCH,
                        body: payload
                    };
                },
            }),
            createLabel: build.mutation<CreateLabelResponse, CreateLabelRequest>({
                query(payload) {
                    return {
                        url: `/customlabels/create`,
                        method: Method.POST,
                        body: payload
                    };
                },
            }),
            deleteLabel: build.mutation<void, string>({
                query(labelId) {
                    return {
                        url: `/customlabels/${labelId}`,
                        method: Method.DELETE
                    };
                },
            })
        };
    },
    overrideExisting: false
});
