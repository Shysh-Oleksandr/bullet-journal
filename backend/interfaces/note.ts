import { Document } from 'mongoose';
import IUser from './user';
import ICustomLabel from './customLabel';

export default interface INote extends Document {
    title: string;
    author: IUser;
    startDate: number;
    endDate: number;
    content?: string;
    color: string;
    images?: string[];
    type: ICustomLabel;
    category?: ICustomLabel[];
    rating: number;
    isEndNote?: boolean;
    isLocked?: boolean;
    isStarred?: boolean;
    isDefault?: boolean;
}

export type CreateDefaultNotePayload = Pick<INote, 'title' | 'startDate' | 'endDate' | 'content' | 'color' | 'rating' | 'isEndNote' | 'isLocked' | 'isStarred' | 'isDefault'>;

export const DEFAULT_NOTES: CreateDefaultNotePayload[] = [
    {
        title: 'Welcome to Your Bullet Journal!',
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        content: `<p>    Welcome aboard! This is your very first note in your brand-new journaling haven. 📖✨</p>
<p>        As you embark on this journaling journey, envision this note as your warm embrace to the world of self-expression and reflection. It's here to capture your innermost thoughts, dreams, and aspirations.</p>
        
<p>        Feel free to pour your heart out, recount your daily adventures, or simply muse about life's wonders. Your journal is a canvas for your emotions, a sanctuary for your ideas, and a mirror to your soul.</p>
        
<p>        Don't hold back! Use this note to set your intentions, outline your goals, or simply write down the things that make you smile. Whether it's a heartfelt letter to your future self, a poem that speaks your heart, or just a simple 'hello' to the universe, your words matter here.</p>
        
<p>        Remember, your journal is your trusted confidant, always ready to listen without judgment. It's a place to celebrate achievements, ponder challenges, and cherish the smallest joys in life.</p>
        
<p>        So, here's to new beginnings and endless possibilities. Welcome to your journal, where every page holds the promise of self-discovery, growth, and a deeper connection with yourself.</p>
        
<p>        Happy journaling! 🌟📝</p>`,
        color: '#0891b2',
        rating: 5,
        isEndNote: false,
        isLocked: true,
        isStarred: true,
        isDefault: true
    }
];
