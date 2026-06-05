import { Button, Text } from '@/shared/components/ui';
import type { Resource } from '../types/resource';
import { Modal } from '@/shared/components/ui/Modal/Modal';
import { useEditResource } from '../hooks/useEditResource';
import { useRef, useState } from 'react';
import { HiDocumentText, HiLink, HiPhotograph, HiTrash } from 'react-icons/hi';
import formatPrice from '@/shared/utils/formatPrice';
import { ConfirmationModal } from '@/shared/components/ui/Modal/ConfirmationModal';

interface Props {
  resource: Resource | null;
  cancel: () => void;
  close: () => void;
  success: () => void;
}

export type WorkshopItemType = 'manual' | 'taller';

export type ContentBlockType = 'texto' | 'image' | 'link';

export interface TextContentBlock {
  kind: 'texto';
  value: string;
}

export interface ImageContentBlock {
  kind: 'imagen';
  file: File;
  previewUrl: string;
}

export interface LinkContentBlock {
  kind: 'link';
  value: string;
}

export type ContentBlock =
  | TextContentBlock
  | ImageContentBlock
  | LinkContentBlock;

const FIELD_CLASS =
  'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none  bg-white';

const EditResourceModal = ({ resource, cancel, success }: Props) => {
  const {
    nameHook: [name, setName],
    typeHook: [type, setType],
    priceHook: [price, setPrice],
    secretUrlHook: [secretUrl, setSecretUrl],
    coverImageHook: [, setCoverImage],
    coverDisplayHeightHook: [coverDisplayHeight, setCoverDisplayHeight],
    blocks,
    loading,
    errors,
    canAddBlock,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_PRICE,
    addBlock,
    updateBlocks,
    handleSubmit,
    coverPreview,
    clearError,
    emailHook: [emailContent, setEmailContent],
    MAX_EMAIL_CONTENT_LENGTH,
    validateData,
  } = useEditResource(resource, success);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleAddBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ContentBlock['kind'];
    if (!val) return;
    addBlock(val);
    e.target.value = '';
  };

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Modal
      title={`Editando un ${type}`}
      onClose={cancel}
      color="yellow"
      childrenClassName="px-0"
    >
      {/* select-none prevents text highlight when clicking around the modal */}
      <div className="flex flex-col modal-scrollbar max-h-[70vh] overflow-y-auto pl-6 pr-5 py-5 ">
        {/* ── Título ── */}
        <div className="flex flex-col gap-1">
          {/* ── Imagen de portada ── */}
          <div className="flex flex-col gap-2 mb-4">
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
                />
                <Button
                  variant="toolbar"
                  label="Cambiar portada"
                  icon={HiPhotograph}
                  onClick={() => coverInputRef.current?.click()}
                />
                {errors.coverImage && (
                  <Text variant="small" color="text-red-500">
                    {errors.coverImage}
                  </Text>
                )}
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
            onFocus={() => clearError('name')}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del recurso"
            className={FIELD_CLASS + (errors.name ? ' border-red-500' : '')}
          />
          {errors.name && (
            <Text variant="small" color="text-red-500">
              {errors.name}
            </Text>
          )}
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
              value={type.toLowerCase()}
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
        <div className="flex flex-col gap-1 mt-4">
          <Text variant="small" weight="medium" color="text-gray-500">
            Precio
          </Text>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input
              type="text"
              inputMode="numeric"
              value={formatPrice(price)}
              onChange={handlePriceChange}
              onFocus={() => clearError('price')}
              placeholder="0"
              className={`flex-1 px-3 py-2 text-sm focus:outline-none ${errors.price ? ' border-red-500 border-1 rounded-md' : ''}`}
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
          {errors.price && (
            <Text variant="small" color="text-red-500">
              {errors.price}
            </Text>
          )}
          <Text variant="small" as="span" color="text-gray-400 text-right">
            Máximo {MAX_PRICE.toLocaleString('en-US')} USD
          </Text>
        </div>

        {/* ── PDF / Video URL ── */}
        <div className="flex flex-col gap-1 ">
          <Text variant="small" weight="medium" color="text-gray-500">
            {type.toLowerCase() === 'manual' ? 'PDF URL' : 'Video URL'}
          </Text>
          <input
            type="text"
            value={secretUrl}
            maxLength={200}
            onFocus={() => clearError('secretUrl')}
            onChange={(e) => setSecretUrl(e.target.value)}
            placeholder={
              type.toLowerCase() === 'manual'
                ? 'https://...pdf'
                : 'https://...video'
            }
            className={
              FIELD_CLASS + (errors.secretUrl ? ' border-red-500' : '')
            }
          />
          {errors.secretUrl && (
            <Text variant="small" color="text-red-500">
              {errors.secretUrl}
            </Text>
          )}
          <Text variant="small" color="text-gray-400" className="text-right">
            {type.toLowerCase() === 'manual'
              ? 'El cliente recibirá este PDF por correo al adquirir el manual'
              : 'El cliente recibirá este video por correo al adquirir el taller'}
          </Text>
        </div>

        {type === 'taller' && (
          <div className="flex flex-col gap-1 mt-4">
            <Text variant="small" weight="medium" color="text-gray-500">
              Contenido del correo electrónico
            </Text>
            <textarea
              value={emailContent}
              maxLength={MAX_EMAIL_CONTENT_LENGTH}
              onFocus={() => clearError('emailContent')}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={4}
              placeholder="Mensaje que recibirá el cliente al comprar el taller..."
              className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none + ${errors.emailContent ? ' border-red-500 border-1 rounded-md' : ''}`}
            />
            {errors.emailContent && (
              <Text variant="small" color="text-red-500">
                {errors.emailContent}
              </Text>
            )}
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
                  onClick={() => updateBlocks.removeBlock(i)}
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
                        Texto
                      </Text>
                    </div>
                    <textarea
                      value={block.value}
                      maxLength={MAX_TEXT_LENGTH}
                      onChange={(e) =>
                        updateBlocks.updateTextBlock(i, e.target.value)
                      }
                      onFocus={() => clearError(`block_${i}`)}
                      rows={5}
                      placeholder="Escribe el contenido aquí..."
                      className={
                        'w-full border rounded-md px-3 py-2 text-sm resize-none ' +
                        (errors[`block_${i}`]
                          ? ' border-red-500'
                          : 'border-gray-200')
                      }
                    />
                    {errors[`block_${i}`] && (
                      <Text variant="small" color="text-red-500">
                        {errors[`block_${i}`]}
                      </Text>
                    )}
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
                      onFocus={() => clearError(`block_${i}`)}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateBlocks.updateImageBlock(i, file);
                      }}
                    />
                    {block.previewUrl ? (
                      <div className="flex flex-col gap-2">
                        <img
                          src={block.previewUrl}
                          alt="preview"
                          className="w-full rounded-md object-cover"
                        />
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
                    {errors[`block_${i}`] && (
                      <Text variant="small" color="text-red-500">
                        {errors[`block_${i}`]}
                      </Text>
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
                      onFocus={() => clearError(`block_${i}`)}
                      onChange={(e) =>
                        updateBlocks.updateLinkBlock(i, e.target.value)
                      }
                      placeholder="https://..."
                      className={
                        FIELD_CLASS +
                        (errors[`block_${i}`] ? ' border-red-500' : '')
                      }
                    />
                    {errors[`block_${i}`] && (
                      <Text variant="small" color="text-red-500">
                        {errors[`block_${i}`]}
                      </Text>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Add block dropdown ── */}
        {canAddBlock ? (
          <div className="relative mt-4">
            <select
              id="create-box"
              defaultValue=""
              onChange={handleAddBlock}
              className={
                FIELD_CLASS + ' appearance-none text-gray-500 !text-sm'
              }
            >
              <option value="" disabled>
                Selecciona el bloque de contenido que quisieras insertar
              </option>
              <option value="imagen">Imagen </option>
              <option value="texto">Texto</option>
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
        {errors.general && (
          <Text
            variant="small"
            weight="medium"
            color="text-red-500"
            className="text-center"
          >
            {errors.general}
          </Text>
        )}
      </div>
      {/* ── Actions ── */}
      <div className=" flex flex-col lg:flex-row-reverse color-grey-border-top gap-4 px-5 py-4">
        <Button
          variant="primary"
          label="Guardar"
          isLoading={loading}
          disabled={loading}
          onClick={() => {
            const newErrors = validateData();
            if (Object.keys(newErrors).length == 0) {
              setShowConfirmation(true);
            }
          }}
        />
        <Button
          variant="secondary"
          label="Cancelar"
          disabled={loading}
          onClick={cancel}
        />
      </div>
      {showConfirmation && (
        <ConfirmationModal
          title="Editar recurso"
          description={`¿Estas seguro de editar este el ${type}?`}
          confirmLabel="Sí, editar"
          cancelLabel="Cancelar"
          tone="warning"
          // isLoading={isDeleting}
          // errorMessage={deleteError}
          onConfirm={() => {
            setShowConfirmation(false);
            handleSubmit();
          }}
          onCancel={() => {
            setShowConfirmation(false);
          }}
        />
      )}
    </Modal>
  );
};

export default EditResourceModal;
