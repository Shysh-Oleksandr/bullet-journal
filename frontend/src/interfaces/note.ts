import { User } from '../features/user/types';
import ICustomLabel from './customLabel';

export default interface INote {
    title: string;
    author: string | User;
    startDate: number;
    endDate: number;
    content?: string;
    color: string;
    image?: string;
    type: ICustomLabel | null;
    category?: ICustomLabel[];
    rating: number;
    isEndNote?: boolean;
    isLocked?: boolean;
    isStarred?: boolean;
    _id: string;
}
