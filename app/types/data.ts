interface Treatment {
  name: string;
  value: string;
  doubleBookable: boolean;
  calanderId: string;
}
interface dataTypes {
  [key: string]: {
    [key: string]: Treatment[];
  };
}
export const data: dataTypes = {
  heidelberg: {
    Hautverjüngungsverfahren: [
      {
        name: 'abrahydri',
        value: 'abrahydri',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Laser Peeling',
        value: 'Laser Peeling',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Faltenunterspritzung',
        value: 'Faltenunterspritzung',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Skin Resurfacing',
        value: 'Skin Resurfacing',
        doubleBookable: false,
        calanderId: '',
      },
    ],
    'Nichtinvasive Laserverfahren': [
      {
        name: 'Altersflecken/Lentigo',
        value: 'Altersflecken/Lentigo',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Couperose',
        value: 'Couperose',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Besenreiser',
        value: 'Besenreiser',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Tätowierungen',
        value: 'Tätowierungen',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Laserhaarentfernung',
        value: 'Laserhaarentfernung',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Narben, Falten, Poren, Dehnungsstreifen',
        value: 'Narben, Falten, Poren, Dehnungsstreifen',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Thermage-Therapie',
        value: 'Thermage-Therapie',
        doubleBookable: false,
        calanderId: '',
      },
    ],
    'Medikamentöse Verfahren': [
      {
        name: '… gegen Schwitzen',
        value: '… gegen Schwitzen',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: '… gegen Migräne',
        value: '… gegen Migräne',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Wirkungsweise',
        value: 'Wirkungsweise',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Risiken & Nebenwirkungen',
        value: 'Risiken & Nebenwirkungen',
        doubleBookable: false,
        calanderId: '',
      },
    ],
    'Weitere Verfahren': [
      {
        name: 'Anti-Aging',
        value: 'Risiken & Nebenwirkungen',
        doubleBookable: false,
        calanderId: '',
      },
      {
        name: 'Haartransplantation',
        value: 'Haartransplantation',
        doubleBookable: false,
        calanderId: '',
      },
    ],
  },
};
