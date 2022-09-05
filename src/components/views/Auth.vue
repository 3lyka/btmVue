<template>
  <el-form v-if="!tokenLocal" ref="form" :model="form" label-width="120px" class="css-auth-form">
    <el-form-item label="Логин">
      <el-input v-model="form.username" autocomplete></el-input>
    </el-form-item>
    <el-form-item label="Пароль">
      <el-input v-model="form.password" show-password></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Войти</el-button>
    </el-form-item>
  </el-form>
  <div v-else>Загрузка..</div>
</template>

<script>
export default {
  name: 'Auth',
  props: { tokenLocal: String },
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch('User/login', this.form)
        .then(() => this.$router.push({ name: 'Calendar' }))
        .catch((err) => console.error(err));
    },
  },
};
</script>

<style scoped>
.css-auth-form {
  margin: auto;
  margin-top: 200px;
}
</style>
