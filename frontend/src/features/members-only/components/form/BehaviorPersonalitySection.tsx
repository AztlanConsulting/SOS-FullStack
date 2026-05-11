import { Input } from '@shared/components/ui/Input';
import { TextArea } from '@shared/components/ui/TextArea';
import { Select } from '@shared/components/ui/Select';
import type { SearchFormData } from '../../types/searchForm.types';

export interface BehaviorPersonalitySectionProps {
  formData: Partial<SearchFormData>;
  updateForm: (newData: Partial<SearchFormData>) => void;
  errors: Record<string, string>;
}

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
        <Select
          id="acostumbrado-salir"
          label="¿Está acostumbrado a salir?"
          value={formData.acostumbradoSalir}
          onChange={(e) =>
            updateForm({
              acostumbradoSalir: e.target
                .value as SearchFormData['acostumbradoSalir'],
            })
          }
          options={[
            { value: 'Si', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
        />
      </div>

      <div id="ha-escapado">
        <Select
          id="ha-escapado"
          label="¿Ha escapado antes?"
          value={formData.haEscapadoAntes}
          onChange={(e) =>
            updateForm({
              haEscapadoAntes: e.target
                .value as SearchFormData['haEscapadoAntes'],
            })
          }
          options={[
            { value: 'Si', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
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
