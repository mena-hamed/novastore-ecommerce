import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const profile = ref<any | null>(null)
const loading = ref(true)

const initialized = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  const isAdmin = computed(() => {
    return profile.value?.role === 'admin'
  })

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
      profile.value = null
      return
    }

    profile.value = data
  }

  const initialize = async () => {
    if (initialized.value) return

    initialized.value = true

    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession()

    session.value = currentSession
    user.value = currentSession?.user ?? null

    if (user.value) {
      await loadProfile(user.value.id)
    }

    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null

      if (user.value) {
        await loadProfile(user.value.id)
      } else {
        profile.value = null
      }
    })

    loading.value = false
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    user.value = null
    session.value = null
    profile.value = null
  }

  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated,
    isAdmin,
    initialize,
    logout,
  }
}