import { Input } from '@shared/components/ui/Input';
import { TextArea } from '@shared/components/ui/TextArea';
import type { SearchFormData } from '../types/searchForm.types';

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
      <div id="apegado-a">
        <Input
          id="apegado-a"
          label="¿A quién está más apegado?"
          value={formData.apedidoA || ''}
          maxLength={100}
          onChange={(e) => updateForm({ apedidoA: e.target.value })}
          hasLength={false}
          error={errors.apedidoA}
        />
      </div>

      <div id="juguete-manta">
        <Input
          id="juguete-manta"
          label="¿Tiene juguete/manta especial?"
          value={formData.jugueteManta || ''}
          maxLength={100}
          onChange={(e) => updateForm({ jugueteManta: e.target.value })}
          hasLength={false}
          error={errors.jugueteManta}
        />
      </div>

      <div id="comida-favorita">
        <Input
          id="comida-favorita"
          label="Comida o snack favorito"
          value={formData.comidaFavorita || ''}
          maxLength={100}
          onChange={(e) => updateForm({ comidaFavorita: e.target.value })}
          hasLength={false}
          error={errors.comidaFavorita}
        />
      </div>

      <div id="que-hace-volver">
        <TextArea
          id="que-hace-volver"
          label="¿Qué lo hace volver?"
          placeholder="Sonidos, personas, rutinas, olores..."
          value={formData.queHaceVolver || ''}
          maxLength={200}
          onChange={(e) => updateForm({ queHaceVolver: e.target.value })}
          error={errors.queHaceVolver}
        />
      </div>

      <div id="lugar-favorito">
        <Input
          id="lugar-favorito"
          label="¿Lugar favorito?"
          value={formData.lugarFavorito || ''}
          maxLength={100}
          onChange={(e) => updateForm({ lugarFavorito: e.target.value })}
          hasLength={false}
          error={errors.lugarFavorito}
        />
      </div>
    </section>
  );
};
