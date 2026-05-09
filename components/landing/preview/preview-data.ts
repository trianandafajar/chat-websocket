export type SessionItem = {
  id: string;
  name: string;
  message: string;
  time: string;
  active?: boolean;
  online?: boolean;
  typing?: string;
};

export type PreviewMessage = {
  id: string;
  text: string;
  time: string;
  self?: boolean;
  sender?: string;
};

export const SESSIONS: SessionItem[] = [
  {
    id: "trip",
    name: "Trip Group",
    message: "Sounds good. I'll bring snacks and water for the road.",
    time: "14:04",
    active: true,
    online: true,
    typing: "Lina is typing...",
  },
  {
    id: "lina",
    name: "Lina",
    message: "I sent you the photos",
    time: "13:58",
    online: true,
    typing: "Lina is typing...",
  },
  {
    id: "design",
    name: "Design Class",
    message: "the project is due tomorrow",
    time: "13:27",
    online: true,
    typing: "Rani is typing...",
  },
  {
    id: "fajar",
    name: "Fajar",
    message: "okay, see you later",
    time: "12:52",
    online: false,
  },
];

export const MESSAGES_BY_SESSION: Record<string, PreviewMessage[]> = {
  trip: [
    {
      id: "trip-1",
      text: "Hey, are we leaving Saturday morning or in the afternoon?",
      time: "14:02",
      sender: "TG",
    },
    {
      id: "trip-2",
      text: "Morning works better, less traffic. Let's meet at the station at 7.",
      time: "14:03",
      sender: "LN",
    },
    {
      id: "trip-3",
      text: "Sounds good. I'll bring snacks and water for the road.",
      time: "14:04",
      self: true,
    },
  ],
  lina: [
    {
      id: "lina-1",
      text: "I sent you the photos from yesterday.",
      time: "13:58",
      sender: "LN",
    },
    {
      id: "lina-2",
      text: "These are perfect. I'll pick three for the header.",
      time: "13:59",
      self: true,
    },
  ],
  design: [
    {
      id: "design-1",
      text: "Can everyone upload the final mockup tonight?",
      time: "13:24",
      sender: "DC",
    },
    {
      id: "design-2",
      text: "the project is due tomorrow",
      time: "13:27",
      sender: "RN",
    },
  ],
  fajar: [
    {
      id: "fajar-1",
      text: "okay, see you later",
      time: "12:52",
      sender: "FJ",
    },
  ],
};
