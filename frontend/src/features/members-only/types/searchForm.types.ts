export interface SearchFormData {
  species: '' | 'Dog' | 'Cat' | 'Other';
  size: '' | 'Small' | 'Medium' | 'Large';
  approximateAge: number | '';
  sex: '' | 'Male' | 'Female';
  sterilized: '' | 'Yes' | 'No';
  collarTag: '' | 'Yes' | 'No';
  physicalCondition: string;

  visualReferences: string;
  zoneType: '' | 'Residential' | 'Rural' | 'City' | 'Highway';
  additionalCircumstances: string;

  personality: string;
  canBeCaught: '' | 'Yes' | 'No' | 'Depends';
  noiseReaction: '' | 'Scared' | 'Flees' | 'Ignores' | 'Other';
  noiseReactionOther: string;
  respondsToName: '' | 'Yes' | 'No' | 'Sometimes';
  usedToGoingOut: '' | 'Yes' | 'No';
  hasEscapedBefore: '' | 'Yes' | 'No';
  whatHappenedWhenEscaped: string;
  fears: string;
  easilySocializes: '' | 'Yes' | 'No';

  helpCount: '' | 'Several people' | '1-2 people' | 'Alone';
  nearbyFeatures: string;
  streetAnimals: '' | 'Many' | 'Few' | 'None' | 'Unknown';
  trafficLevel: '' | 'High' | 'Medium' | 'Low';
  zoneFamiliarity: '' | 'Very familiar' | 'Somewhat' | 'Not at all';

  attachedTo: string;
  toyBlanket: string;
  favoriteFood: string;
  whatBringsBack: string;
  favoritePlace: string;

  vaccinationCard: string | File | null;
}

export const initialSearchFormData: SearchFormData = {
  species: '',
  size: '',
  approximateAge: '',
  sex: '',
  sterilized: '',
  collarTag: '',
  physicalCondition: '',

  visualReferences: '',
  zoneType: '',
  additionalCircumstances: '',

  personality: '',
  canBeCaught: '',
  noiseReaction: '',
  noiseReactionOther: '',
  respondsToName: '',
  usedToGoingOut: '',
  hasEscapedBefore: '',
  whatHappenedWhenEscaped: '',
  fears: '',
  easilySocializes: '',

  helpCount: '',
  nearbyFeatures: '',
  streetAnimals: '',
  trafficLevel: '',
  zoneFamiliarity: '',

  attachedTo: '',
  toyBlanket: '',
  favoriteFood: '',
  whatBringsBack: '',
  favoritePlace: '',

  vaccinationCard: null,
};
