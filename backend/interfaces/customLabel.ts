import IUser from './user';

export default interface ICustomLabel extends Document {
    labelName: string;
    color: string;
    isCategoryLabel: boolean;
    isDefault?: boolean;
    user: IUser;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateDefaultLabelPayload = Pick<ICustomLabel, 'labelName' | 'color' | 'isCategoryLabel' | 'isDefault'>;

export const DEFAULT_LABELS: CreateDefaultLabelPayload[] = [
    {
        labelName: 'Note',
        color: '#0891b2',
        isCategoryLabel: false,
        isDefault: true
    },
    {
        labelName: 'Event',
        color: '#FEC0CE',
        isCategoryLabel: false,
        isDefault: true
    },
    {
        labelName: 'Diary',
        color: '#4A2545',
        isCategoryLabel: false,
        isDefault: true
    },
    {
        labelName: 'Study',
        color: '#1B998B',
        isCategoryLabel: true,
        isDefault: true
    },
    {
        labelName: 'Travel',
        color: '#4F518C',
        isCategoryLabel: true,
        isDefault: true
    },
    {
        labelName: 'Dream',
        color: '#FCDE9C',
        isCategoryLabel: true,
        isDefault: true
    }
];
