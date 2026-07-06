import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { useSearchForms } from '@/features/members-only/hooks/useSearchForms';
import type { SearchFormWithUser } from '@/features/members-only/services/searchForm.service';
import { Modal } from '@/shared/components/ui/Modal/Modal';

const LABELS: Record<string, string> = {
  species: 'Especie',
  size: 'Tamaño',
  approximateAge: 'Edad aproximada',
  sex: 'Sexo',
  sterilized: '¿Está esterilizado?',
  collarTag: '¿Tiene collar o placa identificadora?',
  physicalCondition: 'Condición física visible',
  visualReferences: 'Referencias visuales del lugar',
  zoneType: 'Tipo de zona',
  additionalCircumstances: 'Circunstancias adicionales',
  personality: 'Personalidad',
  canBeCaught: '¿Se deja agarrar por desconocidos?',
  noiseReaction: 'Reacción ante ruidos fuertes',
  noiseReactionOther: 'Describe la reacción',
  respondsToName: '¿Responde a su nombre?',
  usedToGoingOut: '¿Está acostumbrado a salir?',
  hasEscapedBefore: '¿Ha escapado antes?',
  whatHappenedWhenEscaped: 'Si sí, ¿qué pasó?',
  fears: '¿Tiene miedo a algo?',
  easilySocializes: '¿Le es fácil socializar?',
  helpCount: '¿Cuentas con ayuda?',
  nearbyFeatures: '¿Qué hay cerca del lugar?',
  streetAnimals: '¿Hay animales callejeros?',
  trafficLevel: 'Nivel de tráfico vehicular',
  zoneFamiliarity: '¿Qué tan familiar es la zona?',
  attachedTo: '¿A quién está más apegado?',
  toyBlanket: '¿Tiene juguete/manta especial?',
  favoriteFood: 'Comida o snack favorito',
  whatBringsBack: '¿Qué lo hace volver?',
  favoritePlace: '¿Lugar favorito?',
  vaccinationCard: 'Tarjeta de vacunación',
};

const VALUE_LABELS: Record<string, Record<string, string>> = {
  species: { Dog: 'Perro', Cat: 'Gato', Other: 'Otro' },
  size: {
    Mini: 'Mini: 1 a 4 kg',
    Small: 'Pequeño: 5 a 10 kg',
    Medium: 'Mediano: 11 a 25 kg',
    Large: 'Grande: 25 a 45 kg',
    Giant: 'Gigante: más de 45 kg',
  },
  sex: { Male: 'Macho', Female: 'Hembra' },
  sterilized: { Yes: 'Sí', No: 'No' },
  collarTag: { Yes: 'Sí', No: 'No' },
  zoneType: {
    Residential: 'Residencial',
    Rural: 'Rural',
    City: 'Ciudad',
    Highway: 'Carretera',
  },
  canBeCaught: { Yes: 'Sí', No: 'No', Depends: 'Depende' },
  noiseReaction: {
    Scared: 'Se asusta',
    Flees: 'Huye',
    Ignores: 'Ignora',
    Other: 'Otro',
  },
  respondsToName: { Yes: 'Sí', No: 'No', Sometimes: 'A veces' },
  usedToGoingOut: { Yes: 'Sí', No: 'No' },
  hasEscapedBefore: { Yes: 'Sí', No: 'No' },
  easilySocializes: { Yes: 'Sí', No: 'No' },
  helpCount: {
    'Several people': 'Varias personas',
    '1-2 people': '1-2 personas',
    Alone: 'Solo',
  },
  streetAnimals: {
    Many: 'Muchos',
    Few: 'Pocos',
    None: 'Ninguno',
    Unknown: 'No sé',
  },
  trafficLevel: { High: 'Alto', Medium: 'Medio', Low: 'Bajo' },
  zoneFamiliarity: {
    'Very familiar': 'Muy familiar',
    Somewhat: 'Poco',
    'Not at all': 'Nada',
  },
};

function formatValue(key: string, value: unknown): string {
  if (value === '' || value === null || value === undefined) return '—';
  const strValue = String(value);
  const valueMap = VALUE_LABELS[key];
  if (valueMap && valueMap[strValue]) return valueMap[strValue];
  return strValue;
}

const VaccinationCardRenderer = ({ value }: { value: string }) => {
  if (value.startsWith('data:image/')) {
    return (
      <img
        src={value}
        alt="Tarjeta de vacunación"
        className="max-w-full h-auto rounded border"
      />
    );
  }

  if (value.startsWith('data:application/pdf')) {
    return (
      <a
        href={value}
        download="tarjeta-vacunacion.pdf"
        className="text-primary underline hover:text-yellow-600"
      >
        Descargar PDF
      </a>
    );
  }

  return (
    <Text variant="body" color="text-gray-800">
      {value}
    </Text>
  );
};

const QaMModal = ({
  form,
  onClose,
}: {
  form: SearchFormWithUser;
  onClose: () => void;
}) => {
  const keys = Object.keys(LABELS) as (keyof typeof LABELS)[];

  return (
    <Modal
      title={`Respuestas de ${form.createdBy?.username ?? 'Usuario'}`}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {keys.map((key) => {
          const label = LABELS[key];
          const value = form[key as keyof typeof form];
          return (
            <div key={key} className="flex flex-col gap-0.5">
              <Text variant="small" weight="medium" color="text-gray-500">
                {label}
              </Text>
              {key === 'vaccinationCard' &&
              typeof value === 'string' &&
              value.startsWith('data:') ? (
                <VaccinationCardRenderer value={value} />
              ) : (
                <Text variant="body" color="text-gray-800">
                  {formatValue(key, value)}
                </Text>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export const SearchProfilePage = () => {
  const { forms, loading } = useSearchForms();
  const [selectedForm, setSelectedForm] = useState<SearchFormWithUser | null>(
    null,
  );

  return (
    <div className="flex min-h-screen bg-[#F6F6F6] overflow-x-hidden w-full">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 flex flex-col gap-6 min-w-0 overflow-x-hidden lg:ml-64">
        <Text variant="h1" weight="bold" color="text-black">
          Perfil de Búsqueda
        </Text>

        <div className="hidden md:block overflow-x-auto rounded-lg border border-[#AFB1B6]">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-primary">
                {['Usuario', 'Email', 'Fecha', 'Acción'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left border-b border-[#AFB1B6]"
                  >
                    <div className="flex items-center gap-1">
                      <Text
                        variant="caption"
                        weight="medium"
                        color="text-white"
                      >
                        {h}
                      </Text>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading && (
                <tr>
                  <td colSpan={4} className="py-16">
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              )}
              {!loading && forms.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <Text variant="caption" color="text-gray-400">
                      No se encontraron formularios de búsqueda.
                    </Text>
                  </td>
                </tr>
              )}
              {!loading &&
                forms.map((form) => (
                  <tr
                    key={form._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Text variant="caption">
                        {form.createdBy?.username ?? '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text variant="caption">
                        {form.createdBy?.email ?? '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text variant="caption">
                        {new Date(form.createdAt).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedForm(form)}
                        className="bg-primary text-white text-xs px-3 py-1.5 rounded-full hover:bg-yellow-600 transition-colors font-medium"
                      >
                        Ver respuestas
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col gap-3">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          {!loading && forms.length === 0 && (
            <Text
              variant="caption"
              color="text-gray-400"
              className="text-center py-6"
            >
              No se encontraron formularios de búsqueda.
            </Text>
          )}
          {!loading &&
            forms.map((form) => (
              <div
                key={form._id}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Text variant="caption" weight="semibold">
                    {form.createdBy?.username ?? '—'}
                  </Text>
                </div>
                <div className="flex flex-col gap-1 mb-3">
                  <Text variant="small" color="text-gray-500">
                    Email: {form.createdBy?.email ?? '—'}
                  </Text>
                  <Text variant="small" color="text-gray-500">
                    Fecha:{' '}
                    {new Date(form.createdAt).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Text>
                </div>
                <button
                  onClick={() => setSelectedForm(form)}
                  className="bg-primary text-white text-xs px-3 py-1.5 rounded-full hover:bg-yellow-600 transition-colors font-medium"
                >
                  Ver respuestas
                </button>
              </div>
            ))}
        </div>
      </div>

      {selectedForm && (
        <QaMModal form={selectedForm} onClose={() => setSelectedForm(null)} />
      )}
    </div>
  );
};
