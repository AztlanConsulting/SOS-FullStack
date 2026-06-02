import { useRef } from 'react';
import { HiTrash, HiPhotograph, HiLink, HiDocumentText } from 'react-icons/hi';
import { Modal } from '@shared/components/ui/Modal/Modal';
import { Button } from '@shared/components/ui/Button/Button';
import { Text } from '@shared/components/ui/Text/Text';
import { useCreateWorkshopItem } from '@/features/workshop/hooks/useCreateWorkshopItem';
import type { ContentBlock } from '@/features/workshop/types/workshopItem';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const FIELD_CLASS =
  'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none  bg-white';

/** Format a raw digit string as comma-separated integer e.g. "1234567" → "1,234,567" */
const formatPrice = (raw: string) => {
  if (!raw) return '';
  return Number(raw).toLocaleString('en-US');
};

export const RegisterWorkshopItemModal = ({ onClose, onSuccess }: Props) => {
  const {
    name,
    setName,
    type,
    setType,
    price,
    setPrice,
    blocks,
    loading,
    error,
    canAddBlock,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_PRICE,
    addBlock,
    updateTextBlock,
    updateLinkBlock,
    updateImageBlock,
    removeBlock,
    handleSubmit,
    secretUrl,
    coverPreview,
    setCoverImage,
    setSecretUrl,
    coverDisplayHeight,
    setCoverDisplayHeight,
    emailContent,
    setEmailContent,
    MAX_EMAIL_CONTENT_LENGTH,
  } = useCreateWorkshopItem(() => {
    onSuccess();
    onClose();
  });

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ContentBlock['kind'];
    if (!val) return;
    addBlock(val);
    e.target.value = '';
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // strip everything except digits
    const digits = e.target.value.replace(/\D/g, '');
    if (digits === '') {
      setPrice('');
      return;
    }
    const num = Number(digits);
    if (num > MAX_PRICE) return;
    setPrice(digits);
  };

  return (
    <Modal title="Registrando un recurso" onClose={onClose} color="yellow">
      {/* select-none prevents text highlight when clicking around the modal */}
      <div className="flex flex-col gap-4 modal-scrollbar max-h-[70vh] overflow-y-auto pr-1 ">
        {/* ── Título ── */}
        <div className="flex flex-col gap-1">
          {/* ── Imagen de portada ── */}
          <div className="flex flex-col gap-2">
            <Text variant="small" weight="medium" color="text-gray-500">
              Imagen de portada
            </Text>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setCoverImage(file);
              }}
            />
            {coverPreview ? (
              <div className="flex flex-col gap-2">
                <img
                  src={coverPreview}
                  alt="portada"
                  className="w-full rounded-md object-cover"
                  style={{ maxHeight: `${coverDisplayHeight}px` }}
                />
                {/* height slider */}
                <div className="flex items-center gap-2">
                  <Text
                    variant="small"
                    color="text-gray-400"
                    className="shrink-0"
                  >
                    Tamaño
                  </Text>
                  <input
                    type="range"
                    min={80}
                    max={400}
                    step={8}
                    value={coverDisplayHeight}
                    onChange={(e) =>
                      setCoverDisplayHeight(Number(e.target.value))
                    }
                    className="flex-1 accent-yellow-400"
                  />
                  <Text
                    variant="small"
                    color="text-gray-400"
                    className="shrink-0 w-10 text-right"
                  >
                    {coverDisplayHeight}px
                  </Text>
                </div>
                <Button
                  variant="toolbar"
                  label="Cambiar portada"
                  icon={HiPhotograph}
                  onClick={() => coverInputRef.current?.click()}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-md py-6 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors flex flex-col items-center gap-1"
              >
                <HiPhotograph size={22} />
                <Text variant="small" color="text-inherit">
                  Seleccionar imagen de portada (máx 5 MB)
                </Text>
              </button>
            )}
          </div>

          <Text variant="small" weight="medium" color="text-gray-500">
            Título
          </Text>
          <input
            type="text"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del recurso"
            className={FIELD_CLASS}
          />
          <Text
            variant="small"
            as="span"
            weight="medium"
            color={
              MAX_NAME_LENGTH - name.length <= 10
                ? 'text-red-500'
                : 'text-emerald-700'
            }
            className="text-right"
          >
            Quedan {MAX_NAME_LENGTH - name.length} caracteres
          </Text>
        </div>

        {/* ── Tipo ── */}
        <div className="flex flex-col gap-1">
          <Text variant="small" weight="medium" color="text-gray-500">
            Tipo
          </Text>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'manual' | 'taller')}
              className={FIELD_CLASS + ' appearance-none'}
            >
              <option value="taller">Taller</option>
              <option value="manual">Manual</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* ── Precio ── */}
        <div className="flex flex-col gap-1">
          <Text variant="small" weight="medium" color="text-gray-500">
            Precio
          </Text>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input
              type="text"
              inputMode="numeric"
              value={formatPrice(price)}
              onChange={handlePriceChange}
              placeholder="0"
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
            />
            <Text
              variant="small"
              as="span"
              color="text-gray-400"
              className="px-3 bg-gray-50 border-l border-gray-300 h-full flex items-center py-2"
            >
              USD
            </Text>
          </div>
          <Text variant="small" as="span" color="text-gray-400">
            Máximo {MAX_PRICE.toLocaleString('en-US')} USD
          </Text>
        </div>

        {/* ── PDF / Video URL ── */}
        <div className="flex flex-col gap-1">
          <Text variant="small" weight="medium" color="text-gray-500">
            {type === 'manual' ? 'PDF URL' : 'Video URL'}
          </Text>
          <input
            type="text"
            value={secretUrl}
            maxLength={200}
            onChange={(e) => setSecretUrl(e.target.value)}
            placeholder={
              type === 'manual' ? 'https://...pdf' : 'https://...video'
            }
            className={FIELD_CLASS}
          />
          <Text variant="small" color="text-gray-400">
            {type === 'manual'
              ? 'El cliente recibirá este PDF por correo al adquirir el manual'
              : 'El cliente recibirá este video por correo al adquirir el taller'}
          </Text>
        </div>

        {type === 'taller' && (
          <div className="flex flex-col gap-1">
            <Text variant="small" weight="medium" color="text-gray-500">
              Contenido del correo
            </Text>
            <textarea
              value={emailContent}
              maxLength={MAX_EMAIL_CONTENT_LENGTH}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={4}
              placeholder="Mensaje que recibirá el cliente al comprar el taller..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none"
            />
            <Text
              variant="small"
              as="span"
              weight="medium"
              color={
                MAX_EMAIL_CONTENT_LENGTH - emailContent.length <= 100
                  ? 'text-red-500'
                  : 'text-emerald-700'
              }
              className="text-right"
            >
              Quedan {MAX_EMAIL_CONTENT_LENGTH - emailContent.length} caracteres
            </Text>
          </div>
        )}

        {/* ── Content blocks ── */}
        {blocks.length > 0 && (
          <div className="flex flex-col gap-3">
            {blocks.map((block, i) => (
              <div
                key={i}
                className="relative border border-gray-200 rounded-md p-3"
              >
                <button
                  type="button"
                  onClick={() => removeBlock(i)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <HiTrash size={15} />
                </button>

                {/* texto */}
                {block.kind === 'texto' && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 mb-1">
                      <HiDocumentText size={13} className="text-gray-400" />
                      <Text variant="small" color="text-gray-400">
                        Contenido
                      </Text>
                    </div>
                    <textarea
                      value={block.value}
                      maxLength={MAX_TEXT_LENGTH}
                      onChange={(e) => updateTextBlock(i, e.target.value)}
                      rows={5}
                      placeholder="Escribe el contenido aquí..."
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-none"
                    />
                    <Text
                      variant="small"
                      as="span"
                      weight="medium"
                      color={
                        MAX_TEXT_LENGTH - block.value.length <= 50
                          ? 'text-red-500'
                          : 'text-emerald-700'
                      }
                      className="text-right"
                    >
                      Quedan {MAX_TEXT_LENGTH - block.value.length} caracteres
                    </Text>
                  </div>
                )}

                {/* imagen */}
                {block.kind === 'imagen' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 mb-1">
                      <HiPhotograph size={13} className="text-gray-400" />
                      <Text variant="small" color="text-gray-400">
                        Imagen
                      </Text>
                    </div>
                    <input
                      ref={(el) => {
                        fileInputRefs.current[i] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateImageBlock(i, file);
                      }}
                    />
                    {block.previewUrl ? (
                      <div className="flex flex-col gap-2">
                        <img
                          src={block.previewUrl}
                          alt="preview"
                          className="w-full rounded-md object-cover"
                          style={{
                            maxHeight: `${block.displayHeight ?? 128}px`,
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <Text
                            variant="small"
                            color="text-gray-400"
                            className="shrink-0"
                          >
                            Tamaño
                          </Text>
                          <input
                            type="range"
                            min={80}
                            max={400}
                            step={8}
                            value={block.displayHeight ?? 128}
                            onChange={(e) =>
                              updateImageBlock(i, null, Number(e.target.value))
                            }
                            className="flex-1 accent-yellow-400"
                          />
                          <Text
                            variant="small"
                            color="text-gray-400"
                            className="shrink-0 w-10 text-right"
                          >
                            {block.displayHeight ?? 128}px
                          </Text>
                        </div>
                        <Button
                          variant="toolbar"
                          label="Cambiar imagen"
                          icon={HiPhotograph}
                          onClick={() => fileInputRefs.current[i]?.click()}
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[i]?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-md py-6 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors flex flex-col items-center gap-1"
                      >
                        <HiPhotograph size={22} />
                        <Text variant="small" color="text-inherit">
                          Seleccionar archivo (máx 5 MB)
                        </Text>
                      </button>
                    )}
                  </div>
                )}

                {/* link */}
                {block.kind === 'link' && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 mb-1">
                      <HiLink size={13} className="text-gray-400" />
                      <Text variant="small" color="text-gray-400">
                        Link
                      </Text>
                    </div>
                    <input
                      type="text"
                      value={block.value}
                      maxLength={500}
                      onChange={(e) => updateLinkBlock(i, e.target.value)}
                      placeholder="https://..."
                      className={FIELD_CLASS}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Add block dropdown ── */}
        {canAddBlock ? (
          <div className="relative">
            <select
              defaultValue=""
              onChange={handleAddBlock}
              className={FIELD_CLASS + ' appearance-none text-gray-500'}
            >
              <option value="" disabled>
                Selecciona el bloque de contenido que quisieras insertar
              </option>
              <option value="imagen">Imagen </option>
              <option value="texto">Contenido</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▼
            </span>
          </div>
        ) : (
          <Text variant="small" color="text-gray-400" className="text-center">
            Máximo de 10 bloques alcanzado
          </Text>
        )}

        {/* ── Error ── */}
        {error && (
          <Text
            variant="small"
            weight="medium"
            color="text-red-500"
            className="text-center"
          >
            {error}
          </Text>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-1">
          <Button
            variant="primary"
            label="Guardar"
            isLoading={loading}
            disabled={loading}
            onClick={handleSubmit}
          />
          <Button
            variant="secondary"
            label="Cancelar"
            disabled={loading}
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};
