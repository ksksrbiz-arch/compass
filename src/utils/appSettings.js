const STORAGE_KEY = 'compass-app-settings'

export const DEFAULT_APP_SETTINGS = {
  workspaceName: 'My Legal Workspace',
  aiProvider: 'anthropic',
  anthropicModel: 'claude-sonnet-4-6',
  geminiModel: 'models/gemini-2-5-flash',
  maxTokens: '4096',
  analysisLanguage: 'English',
  anthropicApiKey: '',
  geminiApiKey: '',
  notifications: true,
  dealAlerts: true,
  autoAnalyze: false,
  teamDigest: false,
  riskFlags: true,
  accentColor: '#6366f1',
}

export function loadAppSettings() {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_APP_SETTINGS }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_APP_SETTINGS }

    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_APP_SETTINGS,
      ...parsed,
    }
  } catch {
    return { ...DEFAULT_APP_SETTINGS }
  }
}

export function saveAppSettings(settings) {
  if (typeof window === 'undefined') return

  const nextSettings = {
    ...DEFAULT_APP_SETTINGS,
    ...settings,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings))
  window.dispatchEvent(new CustomEvent('compass:settings-updated', {
    detail: nextSettings,
  }))
}

export function clearAppSettings() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('compass:settings-updated', {
    detail: { ...DEFAULT_APP_SETTINGS },
  }))
}

export function getActiveAiModel(settings) {
  return settings.aiProvider === 'gemini'
    ? settings.geminiModel
    : settings.anthropicModel
}

export function getAiProviderLabel(provider) {
  return provider === 'gemini' ? 'Gemini' : 'Claude'
}
