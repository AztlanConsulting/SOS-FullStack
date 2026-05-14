import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useSearchForm } from '@features/members-only/hooks/useSearchForm';
import type { SearchFormData } from '@features/members-only/types/searchForm.types';

const { mockCreateSearchForm } = vi.hoisted(() => ({
  mockCreateSearchForm: vi.fn(),
}));

vi.mock('@features/members-only/services/searchForm.service', () => ({
  createSearchForm: mockCreateSearchForm,
}));

const VALID_FORM_DATA: SearchFormData = {
  species: 'Dog',
  size: 'Medium',
  approximateAge: 3,
  sex: 'Male',
  sterilized: 'Yes',
  collarTag: 'Yes',
  physicalCondition: 'Good',
  visualReferences: 'Spot on eye',
  zoneType: 'Residential',
  additionalCircumstances: 'Ran away',
  personality: 'Playful',
  canBeCaught: 'Yes',
  noiseReaction: 'Scared',
  noiseReactionOther: '',
  respondsToName: 'Yes',
  usedToGoingOut: 'Yes',
  hasEscapedBefore: 'No',
  whatHappenedWhenEscaped: '',
  fears: 'Cars',
  easilySocializes: 'Yes',
  helpCount: 'Several people',
  nearbyFeatures: 'Park',
  streetAnimals: 'Few',
  trafficLevel: 'Low',
  zoneFamiliarity: 'Very familiar',
  attachedTo: 'Owner',
  toyBlanket: 'Ball',
  favoriteFood: 'Kibble',
  whatBringsBack: 'Whistle',
  favoritePlace: 'Couch',
  vaccinationCard: null,
};

describe('useSearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSearchForm.mockResolvedValue({ message: 'ok', data: {} });
  });

  test('initializes with default SearchFormData', () => {
    const { result } = renderHook(() => useSearchForm());

    expect(result.current.formData.species).toBe('');
    expect(result.current.formData.size).toBe('');
    expect(result.current.formData.vaccinationCard).toBeNull();
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBeNull();
    expect(result.current.submitSuccess).toBe(false);
  });

  test('merges initialData with defaults', () => {
    const { result } = renderHook(() => useSearchForm({ species: 'Dog' }));

    expect(result.current.formData.species).toBe('Dog');
    expect(result.current.formData.size).toBe('');
  });

  test('updateFormData merges partial data', () => {
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.updateFormData({ species: 'Cat', size: 'Large' });
    });

    expect(result.current.formData.species).toBe('Cat');
    expect(result.current.formData.size).toBe('Large');
  });

  test('updateFormData clears errors for the updated field', async () => {
    const { result } = renderHook(() => useSearchForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.species).toBe('Selecciona una especie');

    act(() => {
      result.current.updateFormData({ species: 'Dog' });
    });

    expect(result.current.errors.species).toBeUndefined();
  });

  test('returns validation errors for all empty required fields on submit', async () => {
    const { result } = renderHook(() => useSearchForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.species).toBe('Selecciona una especie');
    expect(result.current.errors.size).toBe('Selecciona un tamaño');
    expect(result.current.errors.approximateAge).toBe(
      'Ingresa una edad aproximada',
    );
    expect(result.current.errors.sex).toBe('Selecciona el sexo');
    expect(result.current.errors.zoneType).toBe('Selecciona un tipo de zona');
    expect(result.current.errors.canBeCaught).toBe('Selecciona una opción');
    expect(result.current.errors.noiseReaction).toBe('Selecciona una reacción');
    expect(result.current.errors.respondsToName).toBe('Selecciona una opción');
    expect(result.current.errors.easilySocializes).toBe(
      'Selecciona una opción',
    );
    expect(result.current.errors.helpCount).toBe('Selecciona una opción');
    expect(result.current.errors.streetAnimals).toBe('Selecciona una opción');
    expect(result.current.errors.trafficLevel).toBe('Selecciona un nivel');
    expect(result.current.errors.zoneFamiliarity).toBe('Selecciona una opción');
  });

  test('sets error when noiseReaction=Other and noiseReactionOther is empty', async () => {
    const { result } = renderHook(() =>
      useSearchForm({
        ...VALID_FORM_DATA,
        noiseReaction: 'Other',
        noiseReactionOther: '',
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.noiseReactionOther).toBe(
      'Describe la reacción',
    );
  });

  test('no error for noiseReactionOther when noiseReaction is not Other', async () => {
    const { result } = renderHook(() =>
      useSearchForm({ ...VALID_FORM_DATA, noiseReaction: 'Flees' }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.noiseReactionOther).toBeUndefined();
  });

  test('sets error when hasEscapedBefore=Yes and whatHappenedWhenEscaped is empty', async () => {
    const { result } = renderHook(() =>
      useSearchForm({
        ...VALID_FORM_DATA,
        hasEscapedBefore: 'Yes',
        whatHappenedWhenEscaped: '',
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.whatHappenedWhenEscaped).toBe(
      'Describe qué pasó',
    );
  });

  test('no error for whatHappenedWhenEscaped when hasEscapedBefore is No', async () => {
    const { result } = renderHook(() => useSearchForm(VALID_FORM_DATA));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.whatHappenedWhenEscaped).toBeUndefined();
  });

  test('returns error when file exceeds 15MB', async () => {
    const largeFile = new File(['x'.repeat(16 * 1024 * 1024)], 'test.pdf', {
      type: 'application/pdf',
    });
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.updateFormData({ vaccinationCard: largeFile });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.vaccinationCard).toBe(
      'El archivo no debe superar los 15MB',
    );
  });

  test('returns error when file type is not allowed', async () => {
    const wrongTypeFile = new File(['content'], 'file.txt', {
      type: 'text/plain',
    });
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.updateFormData({ vaccinationCard: wrongTypeFile });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.vaccinationCard).toBe(
      'Solo se aceptan PDF o imágenes',
    );
  });

  test('no file validation error when no file is provided', async () => {
    const { result } = renderHook(() => useSearchForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.vaccinationCard).toBeUndefined();
  });

  test('calls createSearchForm on valid form and sets submitSuccess', async () => {
    mockCreateSearchForm.mockResolvedValue({ message: 'ok', data: {} });
    const { result } = renderHook(() => useSearchForm(VALID_FORM_DATA));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockCreateSearchForm).toHaveBeenCalledTimes(1);
    expect(result.current.submitSuccess).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
  });

  test('converts approximateAge from string to number on submit', async () => {
    mockCreateSearchForm.mockResolvedValue({ message: 'ok', data: {} });
    const { result } = renderHook(() =>
      useSearchForm({ ...VALID_FORM_DATA, approximateAge: '' }),
    );

    act(() => {
      result.current.updateFormData({ approximateAge: '5' });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockCreateSearchForm).toHaveBeenCalledWith(
      expect.objectContaining({ approximateAge: 5 }),
    );
  });

  test('sets submitError when createSearchForm fails', async () => {
    mockCreateSearchForm.mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => useSearchForm(VALID_FORM_DATA));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.submitError).toBe('Server error');
    expect(result.current.submitSuccess).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  test('resetForm restores initial state', () => {
    const { result } = renderHook(() => useSearchForm({ species: 'Dog' }));

    act(() => {
      result.current.updateFormData({ species: 'Cat' });
    });

    expect(result.current.formData.species).toBe('Cat');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.species).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.submitSuccess).toBe(false);
    expect(result.current.submitError).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });
});
