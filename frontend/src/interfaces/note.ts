import IUser from './user';

export default interface INote {
    title: string;
    author: string | IUser;
    startDate: number;
    endDate: number;
    content?: string;
    color: string;
    image?: string;
    type: string;
    category?: string;
    rating: number;
    isEndNote?: boolean;
    isLocked?: boolean;
    isStarred?: boolean;
    _id: string;
    // milestones: IMilestone[];
}
