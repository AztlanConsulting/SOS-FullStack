import { Input } from '@shared/components/ui/Input';
import { TextArea } from '@shared/components/ui/TextArea';
import { Select } from '@shared/components/ui/Select';
import { Text } from '@shared/components/ui/Text';
import type { SearchFormData } from '../types/searchForm.types';

export interface BehaviorPersonalitySectionProps {
  formData: Partial<SearchFormData>;
  updateForm: (newData: Partial<SearchFormData>) => void;
  errors: Record<string, string>;
}

const ToggleSwitch = ({
  label,
  checked,
  onChange,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  id: string;
}) => (
  <div className="flex flex-col w-full">
    <Text variant="caption" weight="medium" className="text-gray-700 mb-2">
      {label}
    </Text>
    <div className="flex items-center gap-3 p-3 border border-gray-400 rounded-lg">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-yellow-400' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <Text variant="caption" weight="regular" className="text-gray-700">
        {checked ? 'Sí' : 'No'}
      </Text>
    </div>
  </div>
);

export const BehaviorPersonalitySection = ({
  formData,
  updateForm,
  errors,
}: BehaviorPersonalitySectionProps) => {
  return (
    <section
      id="behavior-personality-section"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5 py-4"
    >
      <div id="personalidad">
        <TextArea
          id="personalidad"
          label="¿Cómo describirías su personalidad?"
          placeholder="Ej: Tímido, juguetón, independiente..."
          value={formData.personalidad || ''}
          maxLength={200}
          onChange={(e) => updateForm({ personalidad: e.target.value })}
          error={errors.personalidad}
        />
      </div>

      <div id="deja-agarrar">
        <Select
          id="deja-agarrar"
          label="¿Se deja agarrar por desconocidos?"
          value={formData.seDejaAgarrar || ''}
          onChange={(e) =>
            updateForm({
              seDejaAgarrar: e.target.value as SearchFormData['seDejaAgarrar'],
            })
          }
          options={[
            { value: 'Si', label: 'Sí' },
            { value: 'No', label: 'No' },
            { value: 'Depende', label: 'Depende' },
          ]}
          error={errors.seDejaAgarrar}
        />
      </div>

      <div id="reaccion-ruidos">
        <Select
          id="reaccion-ruidos"
          label="Reacción ante ruidos fuertes"
          value={formData.reaccionRuidos || ''}
          onChange={(e) =>
            updateForm({
              reaccionRuidos: e.target
                .value as SearchFormData['reaccionRuidos'],
            })
          }
          options={[
            { value: 'Se asusta', label: 'Se asusta' },
            { value: 'Huye', label: 'Huye' },
            { value: 'Ignora', label: 'Ignora' },
            { value: 'Otro', label: 'Otro' },
          ]}
          error={errors.reaccionRuidos}
        />
        {formData.reaccionRuidos === 'Otro' && (
          <div className="mt-2">
            <Input
              id="reaccion-ruidos-otro"
              label="Describe la reacción"
              value={formData.reaccionRuidosOtro || ''}
              maxLength={100}
              onChange={(e) =>
                updateForm({ reaccionRuidosOtro: e.target.value })
              }
              hasLength={false}
              error={errors.reaccionRuidosOtro}
            />
          </div>
        )}
      </div>

      <div id="responde-nombre">
        <Select
          id="responde-nombre"
          label="¿Responde a su nombre?"
          value={formData.respondeNombre || ''}
          onChange={(e) =>
            updateForm({
              respondeNombre: e.target
                .value as SearchFormData['respondeNombre'],
            })
          }
          options={[
            { value: 'Si', label: 'Sí' },
            { value: 'No', label: 'No' },
            { value: 'A veces', label: 'A veces' },
          ]}
          error={errors.respondeNombre}
        />
      </div>

      <div id="acostumbrado-salir">
        <ToggleSwitch
          id="acostumbrado-salir"
          label="¿Está acostumbrado a salir?"
          checked={formData.acostumbradoSalir || false}
          onChange={(val) => updateForm({ acostumbradoSalir: val })}
        />
      </div>

      <div id="ha-escapado">
        <ToggleSwitch
          id="ha-escapado"
          label="¿Ha escapado antes?"
          checked={formData.haEscapadoAntes || false}
          onChange={(val) => updateForm({ haEscapadoAntes: val })}
        />
      </div>

      {formData.haEscapadoAntes && (
        <div id="que-paso-escapado">
          <TextArea
            id="que-paso-escapado"
            label="Si sí, ¿qué pasó?"
            placeholder="Describe cómo escapó anteriormente y cómo lo encontraron..."
            value={formData.quePasoEscapado || ''}
            maxLength={300}
            onChange={(e) => updateForm({ quePasoEscapado: e.target.value })}
            error={errors.quePasoEscapado}
          />
        </div>
      )}

      <div id="tiene-miedo">
        <Input
          id="tiene-miedo"
          label="¿Tiene miedo a algo?"
          value={formData.tieneMiedo || ''}
          maxLength={100}
          onChange={(e) => updateForm({ tieneMiedo: e.target.value })}
          hasLength={false}
          error={errors.tieneMiedo}
        />
      </div>

      <div id="facil-socializar">
        <Select
          id="facil-socializar"
          label="¿Le es fácil socializar?"
          value={formData.leFacilSocializar || ''}
          onChange={(e) =>
            updateForm({
              leFacilSocializar: e.target
                .value as SearchFormData['leFacilSocializar'],
            })
          }
          options={[
            { value: 'Si', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
          error={errors.leFacilSocializar}
        />
      </div>
    </section>
  );
};
