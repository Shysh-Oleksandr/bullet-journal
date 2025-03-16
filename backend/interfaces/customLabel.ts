import IUser from './user';

export default interface ICustomLabel extends Document {
    labelName: string;
    color: string;
    isCategoryLabel?: boolean;
    isDefault?: boolean;
    user: IUser;
    labelFor: 'Type' | 'Category' | 'Task';
    refId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateDefaultLabelPayload = Pick<ICustomLabel, 'labelName' | 'color' | 'isDefault' | 'labelFor'>;

export const DEFAULT_LABELS: CreateDefaultLabelPayload[] = [
    {
        labelName: 'Note',
        color: '#0891b2',
        isDefault: true,
        labelFor: 'Type'
    },
    {
        labelName: 'Event',
        color: '#FEC0CE',
        isDefault: true,
        labelFor: 'Type'
    },
    {
        labelName: 'Diary',
        color: '#4A2545',
        isDefault: true,
        labelFor: 'Type'
    },
    {
        labelName: 'Study',
        color: '#1B998B',
        isDefault: true,
        labelFor: 'Category'
    },
    {
        labelName: 'Travel',
        color: '#4F518C',
        isDefault: true,
        labelFor: 'Category'
    },
    {
        labelName: 'Work',
        color: '#FCDE9C',
        isDefault: true,
        labelFor: 'Category'
    },
    {
        labelName: 'To Do',
        color: '#0891b2',
        isDefault: true,
        labelFor: 'Task'
    },
    {
        labelName: 'In Progress',
        color: '#e3a605',
        isDefault: true,
        labelFor: 'Task'
    },
    {
        labelName: 'On Hold',
        color: '#4A2545',
        isDefault: true,
        labelFor: 'Task'
    },
    {
        labelName: 'Completed',
        color: '#12995c',
        isDefault: true,
        labelFor: 'Task'
    },
    {
        labelName: 'High Priority',
        color: '#c21111',
        isDefault: true,
        labelFor: 'Task'
    },
    {
        labelName: 'Medium Priority',
        color: '#c9939f',
        isDefault: true,
        labelFor: 'Task'
    },
    {
        labelName: 'Low Priority',
        color: '#4eabd4',
        isDefault: true,
        labelFor: 'Task'
    }
];
