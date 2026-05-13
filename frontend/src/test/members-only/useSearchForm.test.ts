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
  especie: 'Perro',
  tamano: 'Mediano',
  edadAproximada: 3,
  sexo: 'Macho',
  esterilizado: 'Si',
  collarPlaca: 'Si',
  condicionFisica: 'Buena',
  referenciasVisuales: 'Mancha en ojo',
  tipoZona: 'Residencial',
  circunstanciasAdicionales: 'Salió corriendo',
  personalidad: 'Juguetón',
  seDejaAgarrar: 'Si',
  reaccionRuidos: 'Se asusta',
  reaccionRuidosOtro: '',
  respondeNombre: 'Si',
  acostumbradoSalir: 'Si',
  haEscapadoAntes: 'No',
  quePasoEscapado: '',
  tieneMiedo: 'A los coches',
  leFacilSocializar: 'Si',
  cuentaAyuda: 'Varias personas',
  queHayCerca: 'Parque',
  animalesCallejeros: 'Pocos',
  nivelTrafico: 'Bajo',
  familiaridadZona: 'Muy familiar',
  apedidoA: 'Dueño',
  jugueteManta: 'Pelota',
  comidaFavorita: 'Croquetas',
  queHaceVolver: 'Silbido',
  lugarFavorito: 'Sillón',
  cartillaVacunacion: null,
};

describe('useSearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSearchForm.mockResolvedValue({ message: 'ok', data: {} });
  });

  test('initializes with default SearchFormData', () => {
    const { result } = renderHook(() => useSearchForm());

    expect(result.current.formData.especie).toBe('');
    expect(result.current.formData.tamano).toBe('');
    expect(result.current.formData.cartillaVacunacion).toBeNull();
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBeNull();
    expect(result.current.submitSuccess).toBe(false);
  });

  test('merges initialData with defaults', () => {
    const { result } = renderHook(() => useSearchForm({ especie: 'Perro' }));

    expect(result.current.formData.especie).toBe('Perro');
    expect(result.current.formData.tamano).toBe('');
  });

  test('updateFormData merges partial data', () => {
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.updateFormData({ especie: 'Gato', tamano: 'Grande' });
    });

    expect(result.current.formData.especie).toBe('Gato');
    expect(result.current.formData.tamano).toBe('Grande');
  });

  test('updateFormData clears errors for the updated field', async () => {
    const { result } = renderHook(() => useSearchForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.especie).toBe('Selecciona una especie');

    act(() => {
      result.current.updateFormData({ especie: 'Perro' });
    });

    expect(result.current.errors.especie).toBeUndefined();
  });

  test('returns validation errors for all empty required fields on submit', async () => {
    const { result } = renderHook(() => useSearchForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.especie).toBe('Selecciona una especie');
    expect(result.current.errors.tamano).toBe('Selecciona un tamaño');
    expect(result.current.errors.edadAproximada).toBe(
      'Ingresa una edad aproximada',
    );
    expect(result.current.errors.sexo).toBe('Selecciona el sexo');
    expect(result.current.errors.tipoZona).toBe('Selecciona un tipo de zona');
    expect(result.current.errors.seDejaAgarrar).toBe('Selecciona una opción');
    expect(result.current.errors.reaccionRuidos).toBe(
      'Selecciona una reacción',
    );
    expect(result.current.errors.respondeNombre).toBe('Selecciona una opción');
    expect(result.current.errors.leFacilSocializar).toBe(
      'Selecciona una opción',
    );
    expect(result.current.errors.cuentaAyuda).toBe('Selecciona una opción');
    expect(result.current.errors.animalesCallejeros).toBe(
      'Selecciona una opción',
    );
    expect(result.current.errors.nivelTrafico).toBe('Selecciona un nivel');
    expect(result.current.errors.familiaridadZona).toBe(
      'Selecciona una opción',
    );
  });

  test('sets error when reaccionRuidos=Otro and reaccionRuidosOtro is empty', async () => {
    const { result } = renderHook(() =>
      useSearchForm({
        ...VALID_FORM_DATA,
        reaccionRuidos: 'Otro',
        reaccionRuidosOtro: '',
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.reaccionRuidosOtro).toBe(
      'Describe la reacción',
    );
  });

  test('no error for reaccionRuidosOtro when reaccionRuidos is not Otro', async () => {
    const { result } = renderHook(() =>
      useSearchForm({ ...VALID_FORM_DATA, reaccionRuidos: 'Huye' }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.reaccionRuidosOtro).toBeUndefined();
  });

  test('sets error when haEscapadoAntes=Si and quePasoEscapado is empty', async () => {
    const { result } = renderHook(() =>
      useSearchForm({
        ...VALID_FORM_DATA,
        haEscapadoAntes: 'Si',
        quePasoEscapado: '',
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.quePasoEscapado).toBe('Describe qué pasó');
  });

  test('no error for quePasoEscapado when haEscapadoAntes is No', async () => {
    const { result } = renderHook(() => useSearchForm(VALID_FORM_DATA));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.quePasoEscapado).toBeUndefined();
  });

  test('returns error when file exceeds 15MB', async () => {
    const largeFile = new File(['x'.repeat(16 * 1024 * 1024)], 'test.pdf', {
      type: 'application/pdf',
    });
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.updateFormData({ cartillaVacunacion: largeFile });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.cartillaVacunacion).toBe(
      'El archivo no debe superar los 15MB',
    );
  });

  test('returns error when file type is not allowed', async () => {
    const wrongTypeFile = new File(['content'], 'file.txt', {
      type: 'text/plain',
    });
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.updateFormData({ cartillaVacunacion: wrongTypeFile });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.cartillaVacunacion).toBe(
      'Solo se aceptan PDF o imágenes',
    );
  });

  test('no file validation error when no file is provided', async () => {
    const { result } = renderHook(() => useSearchForm());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.cartillaVacunacion).toBeUndefined();
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

  test('converts edadAproximada from string to number on submit', async () => {
    mockCreateSearchForm.mockResolvedValue({ message: 'ok', data: {} });
    const { result } = renderHook(() =>
      useSearchForm({ ...VALID_FORM_DATA, edadAproximada: '' }),
    );

    act(() => {
      result.current.updateFormData({ edadAproximada: '5' });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockCreateSearchForm).toHaveBeenCalledWith(
      expect.objectContaining({ edadAproximada: 5 }),
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
    const { result } = renderHook(() => useSearchForm({ especie: 'Perro' }));

    act(() => {
      result.current.updateFormData({ especie: 'Gato' });
    });

    expect(result.current.formData.especie).toBe('Gato');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.especie).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.submitSuccess).toBe(false);
    expect(result.current.submitError).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });
});
