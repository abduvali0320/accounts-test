<script setup lang="ts">
import { ref, computed } from 'vue'
import { Delete, View, Hide } from '@element-plus/icons-vue'
import { useAccountsStore, labelsToText } from '@/stores/accounts'
import type { AccountType, AccountErrors } from '@/types/account'

const props = defineProps<{
  accountId: string
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const store = useAccountsStore()

const labelsText = ref('')
const type = ref<AccountType>('LOCAL')
const login = ref('')
const password = ref('')
const showPassword = ref(false)

const errors = ref<AccountErrors>({
  login: false,
  password: false
})

const loadFromStore = () => {
  const account = store.getAccount(props.accountId)
  if (account) {
    labelsText.value = labelsToText(account.labels)
    type.value = account.type
    login.value = account.login
    password.value = account.password || ''
  }
}

loadFromStore()

const isLocal = computed(() => type.value === 'LOCAL')

const validate = (): boolean => {
  errors.value.login = !login.value.trim()
  errors.value.password = type.value === 'LOCAL' && !password.value.trim()
  return !errors.value.login && !errors.value.password
}

const saveToStore = () => {
  if (validate()) {
    store.updateAccount(props.accountId, {
      labelsText: labelsText.value,
      type: type.value,
      login: login.value,
      password: password.value
    })
  }
}

const onLabelsBlur = () => {
  store.updateAccount(props.accountId, { labelsText: labelsText.value })
}

const onLoginBlur = () => {
  errors.value.login = !login.value.trim()
  if (!errors.value.login) {
    store.updateAccount(props.accountId, { login: login.value })
  }
  saveToStore()
}

const onPasswordBlur = () => {
  if (type.value === 'LOCAL') {
    errors.value.password = !password.value.trim()
    if (!errors.value.password) {
      store.updateAccount(props.accountId, { password: password.value })
    }
  }
  saveToStore()
}

const onTypeChange = (newType: AccountType) => {
  type.value = newType
  store.updateAccount(props.accountId, { type: newType })

  if (newType === 'LDAP') {
    errors.value.password = false
    password.value = ''
  }
  saveToStore()
}

const onRemove = () => {
  emit('remove', props.accountId)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="account-item">
    <el-input
      v-model="labelsText"
      placeholder="Значение"
      maxlength="50"
      @blur="onLabelsBlur"
      class="label-input"
    />

    <el-select
      :model-value="type"
      @change="onTypeChange"
      class="type-select"
    >
      <el-option label="Локальная" value="LOCAL" />
      <el-option label="LDAP" value="LDAP" />
    </el-select>

    <el-input
      v-model="login"
      placeholder="Значение"
      maxlength="100"
      :class="['login-input', { 'is-error': errors.login, 'login-expanded': !isLocal }]"
      @blur="onLoginBlur"
    />

    <el-input
      v-if="isLocal"
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      placeholder="Значение"
      maxlength="100"
      :class="['password-input', { 'is-error': errors.password }]"
      @blur="onPasswordBlur"
    >
      <template #suffix>
        <el-icon class="password-toggle" @click="togglePasswordVisibility">
          <View v-if="!showPassword" />
          <Hide v-else />
        </el-icon>
      </template>
    </el-input>

    <el-button
      type="danger"
      :icon="Delete"
      circle
      plain
      @click="onRemove"
      class="delete-btn"
    />
  </div>
</template>

<style scoped>
.account-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.label-input {
  width: 180px;
}

.type-select {
  width: 140px;
}

.login-input {
  width: 140px;
}

.login-expanded {
  width: 312px;
}

.password-input {
  width: 160px;
}

.password-toggle {
  cursor: pointer;
  color: #909399;
}

.password-toggle:hover {
  color: #409eff;
}

.delete-btn {
  flex-shrink: 0;
}

:deep(.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}
</style>
