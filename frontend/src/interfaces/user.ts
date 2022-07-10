export default interface IUser {
    _id: string;
    uid: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    customNoteTypes?: string;
    customNoteCategories?: string;
}

export const DEFAULT_USER: IUser = {
    _id: '',
    uid: '',
    name: '',
    createdAt: '',
    updatedAt: ''
};
export const DEFAULT_FIRE_TOKEN = '';
