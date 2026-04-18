/**
 * useAutoTranslate
 * ─────────────────────────────────────────────────────────────
 * Traduce automáticamente texto de la BD (en español) al inglés
 * cuando el usuario tiene ese idioma seleccionado.
 *
 * Uso en cualquier componente:
 *   const { tr } = useAutoTranslate()
 *   <p>{{ tr(servicio.nombre) }}</p>
 *
 * - Si el idioma activo es 'es' → devuelve el texto sin cambios
 * - Si el idioma activo es 'en' → traduce con MyMemory API (gratis)
 * - Cachea todas las traducciones en localStorage para no repetir
 *   llamadas a la API en la misma sesión / visitas futuras
 * ─────────────────────────────────────────────────────────────
 */

import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const CACHE_KEY = 'prohogar_translations_cache'
const API_URL = 'https://api.mymemory.translated.net/get'

const MANUAL_MAP = {
  'Viaje Privado': 'Private Trip',
  'Barbería': 'Barbershop'
}


// Cache compartida entre todos los componentes (singleton)
let cache = null

function loadCache() {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    cache = raw ? JSON.parse(raw) : {}
  } catch {
    cache = {}
  }
  return cache
}

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage lleno — continuar sin guardar
  }
}

async function translateText(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') return text

  const store = loadCache()
  const cacheKey = text.trim()

  // 1. Manual map override (highest priority)
  if (MANUAL_MAP[cacheKey]) return MANUAL_MAP[cacheKey]

  // 2. Retornar desde caché si ya existe
  if (store[cacheKey]) return store[cacheKey]


  try {
    const params = new URLSearchParams({
      q: cacheKey,
      langpair: 'es|en'
    })

    const res = await fetch(`${API_URL}?${params}`)
    if (!res.ok) throw new Error('API error')

    const data = await res.json()

    // MyMemory devuelve responseStatus 200 cuando ok
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText
      store[cacheKey] = translated
      saveCache()
      return translated
    }
  } catch {
    // Silentemente fallback al texto original
  }

  return text
}

export function useAutoTranslate() {
  const { locale } = useI18n()

  /**
   * Traduce un texto de español a inglés de forma reactiva.
   * Devuelve un ref que se actualiza cuando la traducción llega.
   *
   * @param {string | Ref<string>} textOrRef - Texto o ref a traducir
   * @returns {Ref<string>} ref con el texto (traducido o no)
   */
  function tr(textOrRef) {
    const result = ref(
      typeof textOrRef === 'object' && textOrRef?.value !== undefined
        ? textOrRef.value
        : textOrRef ?? ''
    )

    const currentText = () =>
      typeof textOrRef === 'object' && textOrRef?.value !== undefined
        ? textOrRef.value
        : textOrRef ?? ''

    async function applyTranslation() {
      const text = currentText()
      if (!text) return

      if (locale.value === 'es') {
        result.value = text
        return
      }

      // Inglés: traducir (o desde caché)
      result.value = await translateText(text)
    }

    // Traducir al montar
    applyTranslation()

    // Retraducir si cambia el idioma
    watch(
      () => locale.value,
      () => applyTranslation(),
      { immediate: false }
    )

    return result
  }

  /**
   * Traduce un array de objetos, especificando qué campos traducir.
   * Útil para listas de servicios, notificaciones, etc.
   *
   * @param {Ref<Array>} listRef - Ref con el array de objetos
   * @param {string[]} fields - Nombres de los campos a traducir
   * @returns {Ref<Array>} Ref con el array traducido
   */
  function trList(listRef, fields = []) {
    const result = ref([])

    async function applyListTranslation() {
      const list = listRef?.value ?? listRef ?? []
      if (!list.length) {
        result.value = []
        return
      }

      if (locale.value === 'es') {
        result.value = list
        return
      }

      // Traducir cada objeto en paralelo
      result.value = await Promise.all(
        list.map(async (item) => {
          const translated = { ...item }
          await Promise.all(
            fields.map(async (field) => {
              if (item[field]) {
                translated[field] = await translateText(item[field])
              }
            })
          )
          return translated
        })
      )
    }

    applyListTranslation()

    // Re-aplicar cuando cambia la lista o el idioma
    watch(
      [() => locale.value, () => listRef?.value ?? listRef],
      () => applyListTranslation(),
      { deep: true }
    )

    return result
  }

  /**
   * Limpia el caché de traducciones almacenado.
   * Útil si el contenido de la BD cambia frecuentemente.
   */
  function clearTranslationCache() {
    cache = {}
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch {}
  }

  return { tr, trList, clearTranslationCache }
}
