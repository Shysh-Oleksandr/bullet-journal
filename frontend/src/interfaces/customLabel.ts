import IUser from './user';

export default interface ICustomLabel {
    labelName: string;
    color: string;
    isCategoryLabel: boolean;
    user: IUser;
    _id: string;
}
