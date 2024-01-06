export interface TokenDataType {
  expiresIn: string;
  refreshToken: string;
  accessToken: string;
}
export interface Treatment {
  name: string;
  value: string;
}
export interface dataTypes {
  [key: string]: {
    [key: string]: Treatment[];
  };
}

export interface formDataType {
  slot?: { room: string | null; time: string } | null;
  timezone?: string | null;
  category: string | null | "";
  treatment: string | null | "" | number;
  location: string | null | "" | number;
  doubleBookable?: boolean | null | "";
  calendarId?: string | null | "";
  doneBy?: string | null | "";
  room?: number | string | null | "";
  optimize?: number | null | "";
  anrede?: string | null | "";
  geschelcht?: string | null | "";
  vorname?: string | null | "";
  nachname?: string | null | "";
  email?: string | null | "";
  mobiltelefon?: string | null | "";
  adresse?: string | null | "";
  plz?: string | null | "";
  stadt?: string | null | "";
  besondereWunsche?: string | null | "";
  patiententyp: any;
  tos: boolean;
}

interface treatmentLocation {
  name: string;
  doneBy: string;
  room: number | string | null;
  optimize: number | null;
}
interface treatment {
  name: string;
  value: string;
  doubleBookable: boolean;
  duration?: number;
  locations: treatmentLocation[];
}

interface infoObjectType {
  [key: string]: treatment[];
}

export const calanderIds = {
  rooms: {
    2: "YjECxlqSDzDm15REjmzS",
    3: "7wqxjJ3mNRl3YeAGORVI",
    4: "4zrmGrYER5ForVL8HDkM",
  },
  doctor: "8qmSRb2mA4ElDQZaCt1P",
  beck: "8Iq0Q946TSkqNWSM9dTj",
  frankenthal: "WZBDAlexfiylsya2cd9j",
};
export const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Ikk5TzltcmEzNWkxc1FmRXRTdXNoIiwiY29tcGFueV9pZCI6ImlFN3U0Yk1yaENwbjFVaXVjSWpYIiwidmVyc2lvbiI6MSwiaWF0IjoxNjg0OTMxMjIxMTEyLCJzdWIiOiJ1c2VyX2lkIn0.BwZobR_9SJ-XxG2QVogsoGnSjdgoLoFQQ9jP9pP2VS0";

export const roomsName = {
  1: "Cosmetic room",
  2: "Consultation Room",
  3: "Operation Room",
  4: "Medical Laser",
};

export const infoObject: infoObjectType = {
  Beratung: [
    {
      name: "Beratung Ästhetik (Botox, Hyaluron, Laser)",
      value: "Beratung Ästhetik (Botox, Hyaluron, Laser)",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Beratung Haartransplantion",
      value: "Beratung Haartransplantion",
      doubleBookable: false,
      duration: 60,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "beck",
          room: 2,
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "beck",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Beratung Augenlidstraffung",
      value: "Beratung Augenlidstraffung",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: 2,
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Beratung Allurion",
      value: "Beratung Allurion",
      doubleBookable: false,
      locations: [
        {
          name: "heidelberg",
          doneBy: "doctor",
          room: 2,
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
  ],
  "Ästhetische Behandlungen (Gesicht und Körper)": [
    {
      name: "Botox/Hyaluronbehandlung",
      value: "Botox/Hyaluronbehandlung",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Lippenaufbau / Lippenunterspritzung",
      value: "Lippenaufbau / Lippenunterspritzung",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Fadenlifting",
      value: "Fadenlifting",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Skinbooster",
      value: "Skinbooster",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Sculptra® Behandlung",
      value: "Sculptra® Behandlung",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "PRP Behandlung",
      value: "PRP Behandlung",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Fett-weg Spritze / Lipolyse",
      value: "Fett-weg Spritze / Lipolyse",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "PRP bei Haarausfall",
      value: "PRP bei Haarausfall",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "PRP Vampir Lifting",
      value: "PRP Vampir Lifting",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Medical Microneedling",
      value: "Medical Microneedling",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
  ],
  Laserbehandlung: [
    {
      name: "Feuermale entfernen",
      value: "Feuermale entfernen",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: 4,
          optimize: 4,
        },
      ],
    },
    {
      name: "Photorejuvenation (Pigmentflecken, Rötungen, feine Falten)",
      value: "Photorejuvenation (Pigmentflecken, Rötungen, feine Falten)",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: 4,
          optimize: 4,
        },
      ],
    },
    {
      name: "Narbenbehandlung / Aknenarben",
      value: "Narbenbehandlung / Aknenarben",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: 4,
          optimize: 4,
        },
      ],
    },
    {
      name: "Laser-Tattooentfernung",
      value: "Laser-Tattooentfernung",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "3,4",
          optimize: null,
        },
      ],
    },
    {
      name: "Dauerhafte Haarentfernung",
      value: "Dauerhafte Haarentfernung",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "3,4",
          optimize: null,
        },
      ],
    },
    {
      name: "FRAXEL Behandlung",
      value: "FRAXEL Behandlung",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: 4,
          optimize: 4,
        },
      ],
    },
    {
      name: "Aknenarben",
      value: "Aknenarben",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: 4,
          optimize: 4,
        },
      ],
    },
    {
      name: "Rosacea / Couperose Behandlung",
      value: "Rosacea / Couperose Behandlung",
      doubleBookable: false,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: 4,
          optimize: 4,
        },
      ],
    },
  ],
  Haare: [
    {
      name: "PRP Haare",
      value: "PRP Haare",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
  ],
  "Medizinische Behandlungen": [
    {
      name: "Botox® bei Zähneknirschen",
      value: "Botox® bei Zähneknirschen",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Botox® bei übermäßigem Schwitzen",
      value: "Botox® bei übermäßigem Schwitzen",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Botox® bei Migräne",
      value: "Botox® bei Migräne",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
    {
      name: "Sklerotherapie / Besenreisser",
      value: "Sklerotherapie / Besenreisser",
      doubleBookable: true,
      locations: [
        {
          name: "Heidelberg",
          doneBy: "doctor",
          room: "2,3,4",
          optimize: 2,
        },
        {
          name: "Frankenthal",
          doneBy: "doctor",
          room: null,
          optimize: null,
        },
      ],
    },
  ],
};
