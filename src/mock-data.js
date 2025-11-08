/**
 * Mock FHIR Patient Resources
 * Used for testing and development when no API is provided
 */

export const MOCK_PATIENTS = [
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440000',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT001' }],
    name: [{ use: 'official', family: 'Doe', given: ['John'] }],
    telecom: [
      { system: 'phone', value: '555-0123', use: 'home' },
      { system: 'email', value: 'john.doe@example.com' }
    ],
    gender: 'male',
    birthDate: '1980-05-15'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440001',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT002' }],
    name: [{ use: 'official', family: 'Smith', given: ['Jane'] }],
    telecom: [
      { system: 'phone', value: '555-0124', use: 'home' },
      { system: 'email', value: 'jane.smith@example.com' }
    ],
    gender: 'female',
    birthDate: '1985-08-22'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440002',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT003' }],
    name: [{ use: 'official', family: 'Johnson', given: ['Robert'] }],
    telecom: [
      { system: 'phone', value: '555-0125', use: 'home' },
      { system: 'email', value: 'robert.j@example.com' }
    ],
    gender: 'male',
    birthDate: '1975-03-10'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440003',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT004' }],
    name: [{ use: 'official', family: 'Williams', given: ['Emily'] }],
    telecom: [
      { system: 'phone', value: '555-0126', use: 'home' },
      { system: 'email', value: 'emily.w@example.com' }
    ],
    gender: 'female',
    birthDate: '1990-12-05'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440004',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT005' }],
    name: [{ use: 'official', family: 'Brown', given: ['Michael'] }],
    telecom: [
      { system: 'phone', value: '555-0127', use: 'home' },
      { system: 'email', value: 'michael.b@example.com' }
    ],
    gender: 'male',
    birthDate: '1982-07-18'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440005',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT006' }],
    name: [{ use: 'official', family: 'Davis', given: ['Sarah'] }],
    telecom: [
      { system: 'phone', value: '555-0128', use: 'home' },
      { system: 'email', value: 'sarah.d@example.com' }
    ],
    gender: 'female',
    birthDate: '1988-11-30'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440006',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT007' }],
    name: [{ use: 'official', family: 'Miller', given: ['David'] }],
    telecom: [
      { system: 'phone', value: '555-0129', use: 'home' },
      { system: 'email', value: 'david.m@example.com' }
    ],
    gender: 'male',
    birthDate: '1978-09-25'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440007',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT008' }],
    name: [{ use: 'official', family: 'Wilson', given: ['Jennifer'] }],
    telecom: [
      { system: 'phone', value: '555-0130', use: 'home' },
      { system: 'email', value: 'jennifer.w@example.com' }
    ],
    gender: 'female',
    birthDate: '1992-04-14'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440008',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT009' }],
    name: [{ use: 'official', family: 'Moore', given: ['James'] }],
    telecom: [
      { system: 'phone', value: '555-0131', use: 'home' },
      { system: 'email', value: 'james.m@example.com' }
    ],
    gender: 'male',
    birthDate: '1970-01-20'
  },
  {
    resourceType: 'Patient',
    id: '550e8400-e29b-41d4-a716-446655440009',
    identifier: [{ system: 'http://hospital.example.org/patients', value: 'PAT010' }],
    name: [{ use: 'official', family: 'Taylor', given: ['Lisa'] }],
    telecom: [
      { system: 'phone', value: '555-0132', use: 'home' },
      { system: 'email', value: 'lisa.t@example.com' }
    ],
    gender: 'female',
    birthDate: '1995-06-08'
  }
];

export const MOCK_PATIENTS_BUNDLE = {
	'resourceType': 'Bundle',
	'id': 'c28b4c5d-70cd-40f6-902f-e83d80b3713c',
	'meta': {
		'lastUpdated': '2025-11-08T18:04:45.204+00:00'
	},
	'type': 'searchset',
	'total': 10,
	'link': [
		{
			'relation': 'self',
			'url': 'http://fhir-server/Patient?name=Rutgar'
		}
	],
	'entry': [...MOCK_PATIENTS.map(patient => ({
    'fullUrl': `http://fhir-server/Patient/${patient.id}`,
    'resource': patient
  }))]
};
