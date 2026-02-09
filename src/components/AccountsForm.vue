<script setup lang="ts">
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { useAccountsStore } from '@/stores/accounts'
import AccountItem from './AccountItem.vue'

const store = useAccountsStore()

const addAccount = () => {
  store.addAccount()
}

const removeAccount = (id: string) => {
  store.removeAccount(id)
}
</script>

<template>
  <div class="accounts-form">
    <div class="form-header">
      <h2 class="form-title">Учетные записи</h2>
      <el-button
        type="primary"
        :icon="Plus"
        circle
        @click="addAccount"
      />
    </div>

    <el-alert
      type="info"
      :closable="false"
      class="form-hint"
    >
      <template #title>
        <div class="hint-content">
          <el-icon><QuestionFilled /></el-icon>
          <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
        </div>
      </template>
    </el-alert>

    <div class="table-header" v-if="store.accounts.length > 0">
      <span class="col-label">Метки</span>
      <span class="col-type">Тип записи</span>
      <span class="col-login">Логин</span>
      <span class="col-password">Пароль</span>
      <span class="col-actions"></span>
    </div>

    <div class="accounts-list">
      <AccountItem
        v-for="account in store.accounts"
        :key="account.id"
        :account-id="account.id"
        @remove="removeAccount"
      />
    </div>

    <div v-if="store.accounts.length === 0" class="empty-state">
      <p>Учетных записей пока нет. Нажмите + чтобы добавить.</p>
    </div>
  </div>
</template>

<style scoped>
.accounts-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.form-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.form-hint {
  margin-bottom: 20px;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: #909399;
  font-size: 14px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 8px;
}

.col-label {
  width: 180px;
}

.col-type {
  width: 140px;
}

.col-login {
  width: 140px;
}

.col-password {
  width: 160px;
}

.col-actions {
  width: 32px;
}

.accounts-list {
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}
</style>
