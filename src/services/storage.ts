/**
 * LocalStorage service for persisting user data
 */

import type { UserProfile } from '@/types/models'

const STORAGE_KEY = 'financial-planner-data'

export const storageService = {
  /**
   * Save user profile to localStorage
   */
  saveProfile(profile: UserProfile): void {
    try {
      const serialized = JSON.stringify(profile)
      localStorage.setItem(STORAGE_KEY, serialized)
    } catch (error) {
      console.error('Failed to save profile to localStorage:', error)
      throw new Error('Failed to save data')
    }
  },

  /**
   * Load user profile from localStorage
   */
  loadProfile(): UserProfile | null {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY)
      if (!serialized) {
        return null
      }
      return JSON.parse(serialized) as UserProfile
    } catch (error) {
      console.error('Failed to load profile from localStorage:', error)
      return null
    }
  },

  /**
   * Clear all saved data
   */
  clearProfile(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear profile from localStorage:', error)
    }
  },

  /**
   * Check if saved data exists
   */
  hasProfile(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null
  },
}
