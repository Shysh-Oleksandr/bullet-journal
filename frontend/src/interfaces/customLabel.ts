import { User } from '../features/user/types';

export default interface ICustomLabel {
    labelName: string;
    color: string;
    isCategoryLabel: boolean;
    user: User;
    _id: string;
}
