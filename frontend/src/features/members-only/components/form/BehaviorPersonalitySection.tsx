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
      <div id="personality">
        <TextArea
          id="personality"
          label="¿Cómo describirías su personalidad?"
          placeholder="Ej: Tímido, juguetón, independiente..."
          value={formData.personality || ''}
          maxLength={200}
          onChange={(e) => updateForm({ personality: e.target.value })}
          error={errors.personality}
        />
      </div>

      <div id="can-be-caught">
        <Select
          id="can-be-caught"
          label="¿Se deja agarrar por desconocidos?"
          value={formData.canBeCaught || ''}
          onChange={(e) =>
            updateForm({
              canBeCaught: e.target.value as SearchFormData['canBeCaught'],
            })
          }
          options={[
            { value: 'Yes', label: 'Sí' },
            { value: 'No', label: 'No' },
            { value: 'Depends', label: 'Depende' },
          ]}
          error={errors.canBeCaught}
        />
      </div>

      <div id="noise-reaction">
        <Select
          id="noise-reaction"
          label="Reacción ante ruidos fuertes"
          value={formData.noiseReaction || ''}
          onChange={(e) =>
            updateForm({
              noiseReaction: e.target.value as SearchFormData['noiseReaction'],
            })
          }
          options={[
            { value: 'Scared', label: 'Se asusta' },
            { value: 'Flees', label: 'Huye' },
            { value: 'Ignores', label: 'Ignora' },
            { value: 'Other', label: 'Otro' },
          ]}
          error={errors.noiseReaction}
        />
        {formData.noiseReaction === 'Other' && (
          <div className="mt-2">
            <Input
              id="noise-reaction-other"
              label="Describe la reacción"
              value={formData.noiseReactionOther || ''}
              maxLength={100}
              onChange={(e) =>
                updateForm({ noiseReactionOther: e.target.value })
              }
              hasLength={false}
              error={errors.noiseReactionOther}
            />
          </div>
        )}
      </div>

      <div id="responds-to-name">
        <Select
          id="responds-to-name"
          label="¿Responde a su nombre?"
          value={formData.respondsToName || ''}
          onChange={(e) =>
            updateForm({
              respondsToName: e.target
                .value as SearchFormData['respondsToName'],
            })
          }
          options={[
            { value: 'Yes', label: 'Sí' },
            { value: 'No', label: 'No' },
            { value: 'Sometimes', label: 'A veces' },
          ]}
          error={errors.respondsToName}
        />
      </div>

      <div id="used-to-going-out">
        <Select
          id="used-to-going-out"
          label="¿Está acostumbrado a salir?"
          value={formData.usedToGoingOut}
          onChange={(e) =>
            updateForm({
              usedToGoingOut: e.target
                .value as SearchFormData['usedToGoingOut'],
            })
          }
          options={[
            { value: 'Yes', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
        />
      </div>

      <div id="has-escaped-before">
        <Select
          id="has-escaped-before"
          label="¿Ha escapado antes?"
          value={formData.hasEscapedBefore}
          onChange={(e) =>
            updateForm({
              hasEscapedBefore: e.target
                .value as SearchFormData['hasEscapedBefore'],
            })
          }
          options={[
            { value: 'Yes', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
        />
      </div>

      {formData.hasEscapedBefore && (
        <div id="what-happened-when-escaped">
          <TextArea
            id="what-happened-when-escaped"
            label="Si sí, ¿qué pasó?"
            placeholder="Describe cómo escapó anteriormente y cómo lo encontraron..."
            value={formData.whatHappenedWhenEscaped || ''}
            maxLength={300}
            onChange={(e) =>
              updateForm({ whatHappenedWhenEscaped: e.target.value })
            }
            error={errors.whatHappenedWhenEscaped}
          />
        </div>
      )}

      <div id="fears">
        <Input
          id="fears"
          label="¿Tiene miedo a algo?"
          value={formData.fears || ''}
          maxLength={100}
          onChange={(e) => updateForm({ fears: e.target.value })}
          hasLength={false}
          error={errors.fears}
        />
      </div>

      <div id="easily-socializes">
        <Select
          id="easily-socializes"
          label="¿Le es fácil socializar?"
          value={formData.easilySocializes || ''}
          onChange={(e) =>
            updateForm({
              easilySocializes: e.target
                .value as SearchFormData['easilySocializes'],
            })
          }
          options={[
            { value: 'Yes', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
          error={errors.easilySocializes}
        />
      </div>
    </section>
  );
};
