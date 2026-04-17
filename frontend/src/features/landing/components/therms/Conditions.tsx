import { Text } from '@shared/components/ui/Text';

const Conditions = () => {
  return (
    <section className="relative border-b border-(--color-grey-border) py-4 lg:py-8">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
        {/* Contenido */}
        <div className="space-y-12 text-left">
          {/* Derechos de autor */}
          <div>
            <Text variant="h3" weight="medium">
              Derechos de autor
            </Text>
            <Text variant="body" className="mt-4">
              Todo el contenido incluido o disponible a través de cualquier
              servicio de SOS Encontrando Mascotas, como texto, gráficos,
              logotipos, iconos, imágenes, descargas digitales y compilaciones
              de datos, es propiedad de SOS Encontrando Mascotas y está
              protegido por las leyes internacionales de derechos de autor.
            </Text>
          </div>

          {/* Responsabilidad */}
          <div>
            <Text variant="h3" weight="medium">
              Descargo de responsabilidad y limitación de responsabilidad
            </Text>
            <Text variant="body" className="mt-4">
              SOS Encontrando Mascotas proporciona sus servicios e información
              tal como están disponibles. No ofrece garantías de ningún tipo,
              explícitas o implícitas. Usted acepta que el uso del servicio es
              bajo su propio riesgo y que no somos responsables de problemas
              causados por usted o terceros.
            </Text>
            <Text variant="body">
              Tampoco somos responsables por mensajes no recibidos, fallas o
              demoras en contactarlo o reenviar información sobre su mascota. Es
              su responsabilidad mantenerse disponible mediante múltiples
              canales de comunicación.
            </Text>
          </div>

          {/* Ley aplicable */}
          <div>
            <Text variant="h3" weight="medium">
              Ley aplicable
            </Text>
            <Text variant="body" className="mt-4">
              Al utilizar nuestros servicios, usted acepta que las leyes
              aplicables regirán estos términos y cualquier disputa que pudiera
              surgir entre usted y SOS Encontrando Mascotas.
            </Text>
          </div>

          {/* Políticas */}
          <div>
            <Text variant="h3" weight="medium">
              Políticas del sitio, modificación y separabilidad
            </Text>
            <Text variant="body" className="mt-4">
              Nos reservamos el derecho de modificar nuestro sitio, políticas y
              estos términos en cualquier momento. Si alguna condición se
              considera inválida, no afectará la validez de las demás.
            </Text>
          </div>

          {/* Divisibilidad */}
          <div>
            <Text variant="h3" weight="medium">
              Divisibilidad
            </Text>
            <Text variant="body" className="mt-4">
              Si alguna disposición se considera inválida o inaplicable, las
              restantes continuarán en vigor. En caso necesario, dicha
              disposición se interpretará de forma limitada para que sea válida.
            </Text>
          </div>

          {/* Importante */}
          <div>
            <Text variant="h3" weight="medium">
              Importante
            </Text>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                <Text variant="body">
                  Los servicios pagos no son reembolsables bajo ninguna
                  circunstancia.
                </Text>
              </li>
              <li>
                <Text variant="body">
                  No se garantiza que todas las personas reciban una alerta.
                </Text>
              </li>
              <li>
                <Text variant="body">
                  El servicio no reemplaza la búsqueda activa de su mascota.
                </Text>
              </li>
              <li>
                <Text variant="body">
                  Los casos se atienden en aproximadamente 20 minutos antes de
                  las 10:30 pm (UTC -06); después de ese horario, al día
                  siguiente a las 8:00 am.
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Conditions;
