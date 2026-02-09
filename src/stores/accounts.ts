import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account, LabelItem, AccountType } from '@/types/account'

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const parseLabels = (text: string): LabelItem[] => {
  if (!text.trim()) return []
  return text
    .split(';')
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => ({ text: item }))
}

export const labelsToText = (labels: LabelItem[]): string => {
  return labels.map(item => item.text).join('; ')
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const addAccount = (): string => {
    const newAccount: Account = {
      id: generateId(),
      labels: [],
      type: 'LOCAL',
      login: '',
      password: ''
    }
    accounts.value.push(newAccount)
    return newAccount.id
  }

  const removeAccount = (id: string): void => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
    }
  }

  const updateAccount = (
    id: string,
    data: {
      labelsText?: string
      type?: AccountType
      login?: string
      password?: string
    }
  ): void => {
    const account = accounts.value.find(acc => acc.id === id)
    if (!account) return

    if (data.labelsText !== undefined) {
      account.labels = parseLabels(data.labelsText)
    }
    if (data.type !== undefined) {
      account.type = data.type
      if (data.type === 'LDAP') {
        account.password = null
      }
    }
    if (data.login !== undefined) {
      account.login = data.login
    }
    if (data.password !== undefined && account.type === 'LOCAL') {
      account.password = data.password
    }
  }

  const getAccount = (id: string): Account | undefined => {
    return accounts.value.find(acc => acc.id === id)
  }

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    getAccount
  }
}, {
  persist: true
})
