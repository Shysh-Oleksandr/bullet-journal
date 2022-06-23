import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { formatTime } from "../../utils/functions";

export enum NoteTypes {
  NOTE = "Note",
  EVENT = "Event",
  GOAL = "Goal",
  DIARY = "Diary",
}

export interface INote {
  title: string;
  startDate: Date;
  endDate: Date; // | undefined or ?
  description?: string;
  color: string;
  image?: string;
  type: NoteTypes;
  category?: string;
  // milestones: IMilestone[];
  id: string;
}

export interface journalState {
  notes: INote[];
}

const initialState: journalState = {
  notes: [
    {
      title: "Wood work",
      startDate: new Date("June 21, 2022"),
      endDate: new Date("June 21, 2022"),
      image:
        "https://media.istockphoto.com/photos/bed-construction-picture-id1225367171?k=20&m=1225367171&s=612x612&w=0&h=yAa57KszobVOqspjRQcyGoxiWvTXgfNCnul5S8UnYbc=",
      description:
        "Half a day I polish the wooden bed of my parents with my mom. I still didn't get it - why should I have done it?",
      color: "#ef6ecd",
      type: NoteTypes.EVENT,
      id: uuidv4(),
    },
    {
      title: "Ran 10 km",
      startDate: new Date("May 14, 2022"),
      endDate: new Date("May 14, 2022"),
      description:
        "Was going to run 8 km, but since I got strengh, ran 10 instead. Felt very bad after the running. But accomplished my goal",
      color: "#ccaacb",
      category: "Sport",
      type: NoteTypes.EVENT,
      id: uuidv4(),
    },
    {
      title: "Wood work",
      startDate: new Date("June 21, 2022"),
      endDate: new Date("June 21, 2022"),
      description:
        "Half a day I polish the wooden bed of my parents with my mom. I still didn't get it - why should I have done it?",
      color: "#ef6ecd",
      type: NoteTypes.EVENT,
      id: uuidv4(),
    },
    {
      title: "Ran 10 km",
      startDate: new Date("May 14, 2022"),
      endDate: new Date("May 14, 2022"),
      description:
        "Was going to run 8 km, but since I got strengh, ran 10 instead. Felt very bad after the running. But accomplished my goal",
      color: "#ccaacb",
      category: "Sport",
      type: NoteTypes.EVENT,
      id: uuidv4(),
    },
  ],
};

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state, { payload }: PayloadAction<number>) => {},
  },
});

export const { increment } = journalSlice.actions;

export default journalSlice.reducer;
