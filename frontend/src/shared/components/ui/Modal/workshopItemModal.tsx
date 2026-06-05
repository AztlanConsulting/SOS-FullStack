import { useRef, useState, useEffect } from 'react';
import { HiTrash, HiPhotograph, HiLink, HiDocumentText } from 'react-icons/hi';
import { Modal } from '@shared/components/ui/Modal/Modal';
import { Button } from '@shared/components/ui/Button/Button';
import { Text } from '@shared/components/ui/Text/Text';
import {
  MAX_FILE_SIZE_MB,
  useCreateWorkshopItem,
} from '@/features/workshop/hooks/useCreateWorkshopItem';
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
    coverImage,
    coverPreview,
    setCoverImage,
    setSecretUrl,
    coverDisplayHeight,
    setCoverDisplayHeight,
    emailContent,
    setEmailContent,
    MAX_EMAIL_CONTENT_LENGTH,
    errorTimeoutRef,
    fieldErrors,
    setFieldError,
    setFieldErrors,
  } = useCreateWorkshopItem(() => {
    onSuccess();
    onClose();
    window.location.reload();
  });

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  // Wire hook error to field error
  useEffect(() => {
    if (error) {
      setFieldError('submit', error);
    }
  }, [error]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(errorTimeoutRef.current).forEach((timeout) =>
        clearTimeout(timeout),
      );
    };
  }, []);

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

  const handleSubmitWithFieldErrors = async () => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors['name'] = 'El título es requerido';
    }
    const priceNum = parseInt(price, 10);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      errors['price'] = 'El precio es requerido y debe ser mayor a 0';
    }
    if (!secretUrl.trim()) {
      errors['secretUrl'] = 'La URL es requerida';
    }
    const urlRegex =
      /(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
    if (!urlRegex.test(secretUrl)) {
      errors['secretUrl'] = 'URL inválido';
    }
    if (!coverPreview) {
      errors['cover'] = 'La imagen de portada es requerida';
    }
    if (type === 'taller' && !emailContent.trim()) {
      errors['emailContent'] =
        'El contenido del email es requerido para talleres';
    }

    blocks.forEach((block, i) => {
      if (block.kind === 'texto' && !block.value?.trim()) {
        errors[`text-${i}`] = 'El bloque de texto no puede estar vacío';
      }

      if (block.kind === 'imagen' && !block.previewUrl) {
        errors[`image-${i}`] = 'Debes seleccionar una imagen';
      }
    });

    if (Object.keys(errors).length > 0) {
      // Set all errors at once with auto-dismiss
      Object.entries(errors).forEach(([field, message]) => {
        setFieldError(field, message);
      });
      return;
    }

    await handleSubmit();
  };

  return (
    <Modal
      title="Registrando un recurso"
      onClose={onClose}
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
                if (file) {
                  setCoverImage(file);
                  if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
                    setFieldError(
                      `cover`,
                      `La imagen no puede superar ${MAX_FILE_SIZE_MB} MB`,
                      2000,
                    );
                  } else {
                    // Clean up the error if they upload a valid, smaller image later
                    clearFieldError(`cover`);
                  }
                }
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
                  onClick={() => {
                    clearFieldError('cover');
                    coverInputRef.current?.click();
                  }}
                  icon={HiPhotograph}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  clearFieldError('cover');
                  coverInputRef.current?.click();
                }}
                className="w-full border-2 border-dashed border-gray-300 rounded-md py-6 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors flex flex-col items-center gap-1"
              >
                <HiPhotograph size={22} />
                <Text variant="small" color="text-inherit">
                  Seleccionar imagen de portada (máx 5 MB)
                </Text>
              </button>
            )}
            {fieldErrors['cover'] && (
              <Text variant="small" color="text-red-500">
                {fieldErrors['cover']}
              </Text>
            )}
          </div>

          <Text variant="small" weight="medium" color="text-gray-500">
            Título
          </Text>
          <input
            type="text"
            value={name}
            onFocus={() => clearFieldError('name')}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del recurso"
            className={
              FIELD_CLASS + (fieldErrors['name'] ? ' border-red-500' : '')
            }
          />
          {fieldErrors['name'] && (
            <Text variant="small" color="text-red-500">
              {fieldErrors['name']}
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
        <div className="flex flex-col gap-1 mt-4">
          <Text variant="small" weight="medium" color="text-gray-500">
            Precio
          </Text>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input
              type="text"
              inputMode="numeric"
              onFocus={() => clearFieldError('price')}
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
          {fieldErrors['price'] && (
            <Text variant="small" color="text-red-500">
              {fieldErrors['price']}
            </Text>
          )}
          <Text variant="small" as="span" color="text-gray-400 text-right">
            Máximo {MAX_PRICE.toLocaleString('en-US')} USD
          </Text>
        </div>

        {/* ── PDF / Video URL ── */}
        <div className="flex flex-col gap-1 ">
          <Text variant="small" weight="medium" color="text-gray-500">
            {type === 'manual' ? 'PDF URL' : 'Video URL'}
          </Text>
          <input
            type="text"
            value={secretUrl}
            maxLength={100}
            onFocus={() => clearFieldError('secretUrl')}
            onChange={(e) => {
              const url = e.target.value;
              setSecretUrl(url);
              const urlRegex =
                /(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
              if (url && !urlRegex.test(url)) {
                setFieldError(
                  'secretUrl',
                  'Debe ser una URL válida (https://...)',
                );
              } else if (url.length > 100)
                setFieldError(
                  'secretUrl',
                  'El url no puede ser mayor a 100 carácteres',
                );
              else {
                setFieldErrors((prev) => {
                  const u = { ...prev };
                  delete u.secretUrl;
                  return u;
                });
              }
            }}
            placeholder={
              type === 'manual' ? 'https://...pdf' : 'https://...video'
            }
            className={
              FIELD_CLASS + (fieldErrors['secretUrl'] ? ' border-red-500' : '')
            }
          />
          {fieldErrors['secretUrl'] && (
            <Text variant="small" color="text-red-500">
              {fieldErrors['secretUrl']}
            </Text>
          )}
          <Text variant="small" color="text-gray-400" className="text-right">
            {type === 'manual'
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
              onChange={(e) => setEmailContent(e.target.value)}
              rows={4}
              onFocus={() => clearFieldError('emailContent')}
              placeholder="Mensaje que recibirá el cliente al comprar el taller..."
              className={
                'w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none' +
                (fieldErrors['emailContent'] ? ' border-red-500' : '')
              }
            />
            {fieldErrors['emailContent'] && (
              <Text variant="small" color="text-red-500">
                {fieldErrors['emailContent']}
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
                        Texto
                      </Text>
                    </div>
                    <textarea
                      value={block.value}
                      maxLength={MAX_TEXT_LENGTH}
                      onChange={(e) => updateTextBlock(i, e.target.value)}
                      onFocus={() => {
                        clearFieldError(`text-${i}`);
                      }}
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
                    {fieldErrors[`text-${i}`] && (
                      <Text variant="small" color="text-red-500">
                        {fieldErrors[`text-${i}`]}
                      </Text>
                    )}
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
                        if (file) {
                          updateImageBlock(i, file);
                          if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
                            setFieldError(
                              `image-${i}`,
                              `La imagen no puede superar ${MAX_FILE_SIZE_MB} MB`,
                              2000,
                            );
                          } else {
                            // Clean up the error if they upload a valid, smaller image later
                            clearFieldError(`image-${i}`);
                          }
                        }
                      }}
                      onFocus={() => clearFieldError(`image-${i}`)}
                    />
                    {block.previewUrl ? (
                      <div className="flex flex-col gap-2">
                        <img
                          src={block.previewUrl}
                          alt="preview"
                          className="w-full rounded-md"
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
                        onClick={() => {
                          clearFieldError(`image-${i}`);
                          fileInputRefs.current[i]?.click();
                        }}
                        className="w-full border-2 border-dashed border-gray-300 rounded-md py-6 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors flex flex-col items-center gap-1"
                      >
                        <HiPhotograph size={22} />
                        <Text variant="small" color="text-inherit">
                          Seleccionar archivo (máx 5 MB)
                        </Text>
                      </button>
                    )}
                    {fieldErrors[`image-${i}`] && (
                      <Text variant="small" color="text-red-500">
                        {fieldErrors[`image-${i}`]}
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
      </div>
      {/* ── Actions ── */}
      <div className=" flex flex-col lg:flex-row-reverse color-grey-border-top gap-4 px-5 py-4">
        <Button
          variant="primary"
          label="Guardar"
          isLoading={loading}
          disabled={loading}
          onClick={handleSubmitWithFieldErrors}
        />
        <Button
          variant="secondary"
          label="Cancelar"
          disabled={loading}
          onClick={onClose}
        />
      </div>
    </Modal>
  );
};
