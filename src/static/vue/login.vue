<template>
  <div class="login-form">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <button type="submit">Login</button>
      </div>
      <span v-if="errorMessage">{{ errorMessage }}</span>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    handleSubmit() {
      // Replace this with your logic to handle login submission
      // (e.g., call an API to authenticate the user)
      console.log('Submitting login form:', this.email, this.password);
      this.errorMessage = 'Login not implemented yet!';
    },
  },
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.error-message {
  color: red;
}
</style>
