export interface TreatmentLocationType {
  id: string;
  name: string;
  roomId?: null | string;
  rooms?: null | string[];
}
export interface TreatmentType {
  name: string;
  duration?: number;
  locations: TreatmentLocationType[];
}

export interface CalendarDataType {
  [key: string]: TreatmentType[];
}

const roomsId = {
  1: "In8FfEkWJ3NR2OkSUDcf",
  2: "NTTP57ZxkMgc2SLI9PyN",
  3: "7fZvuBgFRoIZfyNUaUO9",
  4: "kI5lz8hUqPBsS5CwHOdW",
};

const CalendarData: CalendarDataType = {
  Beratung: [
    {
      name: "Beratung Ästhetik / Laser / Medizinisch",
      locations: [
        {
          name: "Heidelberg",
          id: "JGZla16qoDrYq8vusrF3",
          roomId: roomsId[2],
        },
        {
          name: "Frankenthal",
          id: "EJRszftA0EWD07qmO3x0",
        },
      ],
    },
    {
      name: "Beratung Haartransplantation",
      duration: 60,
      locations: [
        {
          name: "Heidelberg",
          id: "iklikA9oToso0mTqfIaW",
          roomId: roomsId[2],
        },
        {
          name: "Frankenthal",
          id: "auX4IMW4M2eDGM64ag82",
        },
      ],
    },
    {
      name: "Beratung Augenlidstraffung",
      locations: [
        {
          name: "Heidelberg",
          id: "R10xmECFUkf9SZQ4uaoE",
          roomId: roomsId[2],
        },
        {
          name: "Frankenthal",
          id: "REzoahITnDyF60M7cFut",
        },
      ],
    },
    {
      name: "Beratung Allurion Magenballon",
      locations: [
        {
          name: "Heidelberg",
          id: "6XwWeXxBAoikCw91HZ4x",
          roomId: roomsId[2],
        },
        {
          name: "Frankenthal",
          id: "d5Vs7lYYmrPdYlkNJGRM",
        },
      ],
    },
  ],
  "Ästhetische Behandlungen (Gesicht und Körper)": [
    {
      name: "Botox®- und Hyaluronbehandlung",
      locations: [
        {
          name: "Heidelberg",
          id: "GikOEcV6q79ewGz0Mtqi",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "MhrpI8waCY6eWUO84UCI",
        },
      ],
    },
    {
      name: "Nasenkorrektur ohne OP",
      locations: [
        {
          name: "Heidelberg",
          id: "SUHTHogyXDXy6YGzKDZv",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "Sn1QO0xWYkZLmQ3UvXzD",
        },
      ],
    },
    {
      name: "Lippenaufbau / Lippenunterspritzung",
      locations: [
        {
          name: "Heidelberg",
          id: "6QrudgtwAhxlY8keGOCz",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "g8rplVTe1hCDTevZg4v7",
        },
      ],
    },
    {
      name: "Fadenlifting",
      locations: [
        {
          name: "Heidelberg",
          id: "DEUMYIRfhBit6NtFt7in",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "jkhCKip2geI17dgy6P9W",
        },
      ],
    },
    {
      name: "Skinbooster",
      locations: [
        {
          name: "Heidelberg",
          id: "tjITtUfEJS7Inacr20I5",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "hTyrRLoo1r20bgkUrqSd",
        },
      ],
    },
    {
      name: "Sculptra® - Behandlung",
      locations: [
        {
          name: "Heidelberg",
          id: "Fe0IWWiTG9x6TH3eb9Un",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "H0KSocsfbLW9mJUIG1iK",
        },
      ],
    },
    {
      name: "Besenreiser entfernen",
      locations: [
        {
          name: "Heidelberg",
          id: "NjT9vjR9hoY5yiJO4iqd",
          roomId: roomsId[3],
          rooms: null,
        },
        {
          name: "Frankenthal",
          id: "vtu0eeWiksbiGo09JtiP",
        },
      ],
    },
    {
      name: "Fett-weg-Spritze / Lipolyse",
      locations: [
        {
          name: "Heidelberg",
          id: "Q6BfxbmEOqQj8XtZPD31",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "Dlh3pKfl2YcBv3sp382G",
        },
      ],
    },
    {
      name: "PRP bei Haarausfall",
      locations: [
        {
          name: "Heidelberg",
          id: "WmKNxihApw9gLPGZkE8o",
          roomId: roomsId[3],
          rooms: [roomsId[4], roomsId[1], roomsId[2]],
        },
        {
          name: "Frankenthal",
          id: "gDvLlKHqlyZyh23m6bE1",
        },
      ],
    },
    {
      name: "PRP /  Vampir Lifting",
      locations: [
        {
          name: "Heidelberg",
          id: "zR8tfjPld5EJ6Pi1y49Q",
          roomId: roomsId[3],
          rooms: [roomsId[4], roomsId[1], roomsId[2]],
        },
        {
          name: "Frankenthal",
          id: "OjKsvfKwqggWxMhu5woq",
        },
      ],
    },
    {
      name: "Medical Microneedling",
      locations: [
        {
          name: "Heidelberg",
          id: "FEcB6IO5wmJGWiREzudJ",
          roomId: roomsId[1],
          rooms: [roomsId[3], roomsId[4], roomsId[2]],
        },
        {
          name: "Frankenthal",
          id: "0TKZaKvmuawcRATKjLdC",
        },
      ],
    },
    {
      name: "Thermage®",
      locations: [
        {
          name: "Heidelberg",
          id: "XGIIRZgLv1qIh9P4yIKV",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "tP7nswgRW5lxIeuLmZDW",
        },
      ],
    },
    {
      name: "Microdermabrasion",
      duration: 60,
      locations: [
        {
          name: "Heidelberg",
          id: "vNzHJ4o6W2ZFvjRA4WNe",
          roomId: roomsId[1],
        },
      ],
    },
    {
      name: "Infusionstherapie",
      locations: [
        {
          name: "Heidelberg",
          id: "WEQwXKarb87GZZbpzPiV",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "RJ15UBfJwgJfgISJoPZ4",
        },
      ],
    },
  ],
  Laserbehandlung: [
    {
      name: "Feuermale entfernen",
      locations: [
        {
          name: "Heidelberg",
          id: "jdykD0p4KVeZPyA8AoYo",
          roomId: roomsId[4],
        },
      ],
    },
    {
      name: "Altersflecken entfernen",
      locations: [
        {
          name: "Heidelberg",
          id: "xMLUVT8lfsKnLoLmmaXr",
          roomId: roomsId[4],
        },
        {
          name: "Frankenthal",
          id: "WMfqvetEkD9H7g06gSyt",
        },
      ],
    },
    {
      name: "Aknebehandlung",
      locations: [
        {
          name: "Heidelberg",
          id: "iZqQSnSzkpibyODeX5rD",
          roomId: roomsId[4],
        },
        {
          name: "Frankenthal",
          id: "9Yhf5jqfRcOOJgEsq4Ab",
        },
      ],
    },
    {
      name: "Tattooentfernung",
      locations: [
        {
          name: "Heidelberg",
          id: "fD5Tvt5H3x13GDbv7dIr",
          roomId: roomsId[4],
          rooms: [roomsId[4]],
        },
      ],
    },
    {
      name: "Dauerhafte Haarentfernung",
      locations: [
        {
          name: "Heidelberg",
          id: "kFj4vXswzLbqUDwZvRKF",
          roomId: roomsId[1],
        },
      ],
    },
    {
      name: "Faltenbehandlung mit Laser",
      locations: [
        {
          name: "Heidelberg",
          id: "D7nQSG8fIeBflLhjXCCE",
          roomId: roomsId[4],
        },
        {
          name: "Frankenthal",
          id: "0bL5F8f0sPkJz3aEdR0d",
        },
      ],
    },
    {
      name: "Narbenbehandlung",
      locations: [
        {
          name: "Heidelberg",
          id: "bMcTzxVBqkLuPHRxFHlX",
          roomId: roomsId[3],
          rooms: [roomsId[4], roomsId[1], roomsId[2]],
        },
      ],
    },
    {
      name: "Rosacea / Couperose Behandlung",
      locations: [
        {
          name: "Heidelberg",
          id: "565peDl09MImSEpk8kcV",
          roomId: roomsId[4],
        },
      ],
    },
    {
      name: "Dehnungsstreifen entfernen",
      locations: [
        {
          name: "Heidelberg",
          id: "xrBhRLlPHzH0hdcYnY9j",
          roomId: roomsId[4],
        },
        {
          name: "Frankenthal",
          id: "ovcZhV0Qad1hNGRtOcdi",
        },
      ],
    },
    {
      name: "Laser Peeling",
      locations: [
        {
          name: "Heidelberg",
          id: "vqMLWmwGk21lujtmc87c",
          roomId: roomsId[4],
        },
        {
          name: "Frankenthal",
          id: "OnhdpRAKBKEKDF82VUYH",
        },
      ],
    },
  ],
  Haare: [
    {
      name: "PRP bei Haarausfall",
      locations: [
        {
          name: "Heidelberg",
          id: "WmKNxihApw9gLPGZkE8o",
          roomId: roomsId[3],
          rooms: [roomsId[4], roomsId[1], roomsId[2]],
        },
        {
          name: "Frankenthal",
          id: "gDvLlKHqlyZyh23m6bE1",
        },
      ],
    },
    {
      name: "Beratung Haartransplantation",
      locations: [
        {
          name: "Heidelberg",
          id: "iklikA9oToso0mTqfIaW",
          roomId: roomsId[2],
        },
        {
          name: "Frankenthal",
          id: "auX4IMW4M2eDGM64ag82",
        },
      ],
    },
  ],
  "Medizinische Behandlung": [
    {
      name: "Botox® bei Zähneknirschen",
      locations: [
        {
          name: "Heidelberg",
          id: "EB9vRVMbVoLoztuxK9SW",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "PdWvTcrJ4QB17jSTUHMS",
        },
      ],
    },
    {
      name: "Botox® bei übermäßigem Schwitzen",
      locations: [
        {
          name: "Heidelberg",
          id: "FQP9f6E8VznpFEQTg5OC",
          roomId: roomsId[2],
          rooms: [roomsId[3], roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "bd00EuBZGB9ZGLNFO4Er",
        },
      ],
    },
    {
      name: "Botox® bei Migräne",
      locations: [
        {
          name: "Heidelberg",
          id: "pks57Yfk5qwe0PAauPzi",
          roomId: roomsId[3],
          rooms: [roomsId[4], roomsId[1]],
        },
        {
          name: "Frankenthal",
          id: "bPxuGTDCXh8MPqwZGOb3",
        },
      ],
    },
  ],
};

export default CalendarData;
