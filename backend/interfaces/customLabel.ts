import IUser from './user';

export default interface ICustomLabel extends Document {
    labelName: string;
    color: string;
    isCategoryLabel: boolean;
    user: IUser;
}
