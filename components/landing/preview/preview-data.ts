export type SessionItem = {
  id: string;
  name: string;
  message: string;
  time: string;
  active?: boolean;
};

export type PreviewMessage = {
  id: string;
  text: string;
  time: string;
  self?: boolean;
};

export const SESSIONS: SessionItem[] = [
  {
    id: "trip",
    name: "Trip Group",
    message: "Sounds good. I'll bring snacks and water for the road.",
    time: "14:04",
    active: true,
  },
  { id: "lina", name: "Lina", message: "I sent you the photos", time: "13:58" },
  {
    id: "design",
    name: "Design Class",
    message: "the project is due tomorrow",
    time: "13:27",
  },
  { id: "fajar", name: "Fajar", message: "okay, see you later", time: "12:52" },
];

export const MESSAGES: PreviewMessage[] = [
  {
    id: "m1",
    text: "Hey, are we leaving Saturday morning or in the afternoon?",
    time: "14:02",
  },
  {
    id: "m2",
    text: "Morning works better, less traffic. Let's meet at the station at 7.",
    time: "14:03",
  },
  {
    id: "m3",
    text: "Sounds good. I'll bring snacks and water for the road.",
    time: "14:04",
    self: true,
  },
];
