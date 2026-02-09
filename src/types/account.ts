export interface LabelItem {
  text: string
}

export type AccountType = 'LDAP' | 'LOCAL'

export interface Account {
  id: string
  labels: LabelItem[]
  type: AccountType
  login: string
  password: string | null
}

export interface AccountForm {
  labelsText: string
  type: AccountType
  login: string
  password: string
}

export interface AccountErrors {
  login: boolean
  password: boolean
}
