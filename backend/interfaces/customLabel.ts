import IUser from './user';

export default interface ICustomLabel extends Document {
    labelName: string;
    color: string;
    isCategoryLabel: boolean;
    user: IUser;
}

export type CreateDefaultLabelPayload = Pick<ICustomLabel, 'labelName' | 'color' | 'isCategoryLabel'>

export const DEFAULT_LABELS: CreateDefaultLabelPayload[] = [
    {
        labelName: 'Note',
        color: '#0891b2',
        isCategoryLabel: false,
    },
    {
        labelName: 'Event',
        color: '#FEC0CE',
        isCategoryLabel: false
    },
    {
        labelName: 'Diary',
        color: '#4A2545',
        isCategoryLabel: false
    },
    {
        labelName: 'Study',
        color: '#1B998B',
        isCategoryLabel: true
    },
    {
        labelName: 'Travel',
        color: '#4F518C',
        isCategoryLabel: true
    },
    {
        labelName: 'Dream',
        color: '#FCDE9C',
        isCategoryLabel: true
    }
];
