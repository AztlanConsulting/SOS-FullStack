import { Input } from '@shared/components/ui/Input';
import { TextArea } from '@shared/components/ui/TextArea';
import type { SearchFormData } from '../../types/searchForm.types';

export interface PreferencesMotivatorsSectionProps {
  formData: Partial<SearchFormData>;
  updateForm: (newData: Partial<SearchFormData>) => void;
  errors: Record<string, string>;
}

export const PreferencesMotivatorsSection = ({
  formData,
  updateForm,
  errors,
}: PreferencesMotivatorsSectionProps) => {
  return (
    <section
      id="preferences-motivators-section"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5 py-4"
    >
      <div id="attached-to">
        <Input
          id="attached-to"
          label="¿A quién está más apegado?"
          value={formData.attachedTo || ''}
          maxLength={100}
          onChange={(e) => updateForm({ attachedTo: e.target.value })}
          hasLength={false}
          error={errors.attachedTo}
        />
      </div>

      <div id="toy-blanket">
        <Input
          id="toy-blanket"
          label="¿Tiene juguete/manta especial?"
          value={formData.toyBlanket || ''}
          maxLength={100}
          onChange={(e) => updateForm({ toyBlanket: e.target.value })}
          hasLength={false}
          error={errors.toyBlanket}
        />
      </div>

      <div id="favorite-food">
        <Input
          id="favorite-food"
          label="Comida o snack favorito"
          value={formData.favoriteFood || ''}
          maxLength={100}
          onChange={(e) => updateForm({ favoriteFood: e.target.value })}
          hasLength={false}
          error={errors.favoriteFood}
        />
      </div>

      <div id="what-brings-back">
        <TextArea
          id="what-brings-back"
          label="¿Qué lo hace volver?"
          placeholder="Sonidos, personas, rutinas, olores..."
          value={formData.whatBringsBack || ''}
          maxLength={200}
          onChange={(e) => updateForm({ whatBringsBack: e.target.value })}
          error={errors.whatBringsBack}
        />
      </div>

      <div id="favorite-place">
        <Input
          id="favorite-place"
          label="¿Lugar favorito?"
          value={formData.favoritePlace || ''}
          maxLength={100}
          onChange={(e) => updateForm({ favoritePlace: e.target.value })}
          hasLength={false}
          error={errors.favoritePlace}
        />
      </div>
    </section>
  );
};
