<template>
  <div class="auth-container">
    <aside class="auth-image bg-purple-light">
      <header class="w-full">
        <img src="/images/logo.png" alt="Logo" />
      </header>

      <main class="auth-image-main">
        <img src="/images/joy-dance.png" alt="" />
        <footer class="auth-footer text-center">
          <p class="heading-bold-20 text-primary">Team Achieve</p>
          <p class="heading-bold-18 text-gray-8">
            Your perfect solution for funding your desires
          </p>
        </footer>
      </main>
    </aside>

    <section class="auth-main">
      <header class="text-center">
        <h1 class="form-title text-primary">Welcome Back</h1>
        <p class="form-desc text-gray-8">
          Enter your email address and password to access your account.
        </p>
      </header>

      <main class="form">
        <!-- ✅ Error message -->
        <transition name="fade" mode="out-in">
          <div v-if="errorMessage" class="error-alert" role="alert" @click="clearError">
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <div class="form-group">
          <label for="email" class="body-1">Email address</label>
          <div class="input-group">
            <input
              placeholder="Enter your email"
              id="email"
              class="body-2"
              v-model="auth.email"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="body-1">Password</label>
          <div class="input-group">
            <input
              placeholder="Enter your password"
              id="password"
              type="password"
              class="body-2"
              v-model="auth.password"
            />
            <button class="pwd-button">
              <AppIcon name="eye" />
            </button>
          </div>
          <div class="password-footer">
            <CheckBox
              label="Remember me"
              :checked="auth.rememberMe"
              @onCheck="onCheck"
            />

            <router-link to="/#" class="body-2 text-primary">
              Forgot Password?
            </router-link>
          </div>
        </div>
      </main>

      <footer>
        <button class="submit-btn button-text-large" :disabled="loading" @click="login">
          {{ loading ? 'Please wait...' : 'Login' }}
        </button>

        <p class="text-center body-1 text-gray-8">
          {{"Don't have an account? "}}
          <router-link to="/register" class="text-primary subtitle-1">
            Sign up
          </router-link>
        </p>
      </footer>
    </section>
  </div>
</template>


<script lang="ts">
import AppIcon from '@/components/app-icon';
import CheckBox from '@/components/check-box.vue';
import axios from 'axios'; // Make sure you installed axios: npm i axios

export default {
  name: 'Login',
  components: {
    CheckBox,
    AppIcon,
  },
  data: () => ({
    loading: false,
    auth: {
      email: '',
      password: '',
      rememberMe: false,
    },
    errorMessage: '',
  }),
  methods: {
    onCheck(checked: boolean) {
      this.auth.rememberMe = checked;
    },

    clearError() {
      this.errorMessage = '';
    },

    async login() {
      this.loading = true;
      this.errorMessage = '';

      try {
        // Make login request
        const response = await axios.post(
          `http://localhost:3000/auth/login`,
          {
            email: this.auth.email,
            password: this.auth.password,
            rememberMe: this.auth.rememberMe
          },
          {
            withCredentials: true, // ✅ critical for cookies
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Login successful:', response);

        this.$router.push("/");

      } catch (error: any) {
        console.error('Login error:', error.response);
        if (axios.isAxiosError(error)) {
          this.errorMessage =
            error.response?.data?.message || 'Invalid email or password';
        } else {
          this.errorMessage = 'Network error. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>
.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* Optional styling */
.auth-image {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4.5rem;
  gap: 10px;
}

.auth-image main > img {
    width: 100%;
    aspect-ratio: 3/2;
}

.auth-footer > p:last-child {
    margin-top: -12px;
}

.auth-image-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
}

@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-image {
    display: none;
  }
}

.form {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    color: var(--gray-9);

}
.form-group label::after {
    content: "*";
    color: #EE1A40;
    margin-left: 2px;
}

input {
    flex: 1;
    background: white;
    color: var(--gray-9);
    border: 1px solid var(--gray-3);
    border-radius: 8px;
    outline: none;
    height: 40px;
    padding: 2px 10px;
}

input::placeholder {
    color: var(--gray-5);
}

.input-group {
    display: flex;
    align-items: center;
    border: 1px solid var(--gray-5);
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    height: 40px;
}

.input-group input {
  flex: 1;
  border: none;
  outline: none;
  padding: 2px 10px;
  min-width: 0;
}

.pwd-button {
    background: var(--gray-2);
    width: 55px;
    height: 100%;
    display: grid;
    place-items: center;
    border: none;
    outline: none;
    border-left: 2px solid var(--gray-3);
}

.password-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.password-footer a {
    text-decoration: none;
}

footer {
    width: 100%;
    padding: 20px 0;
}

.submit-btn {
    width: 100%;
    height: 48px;
    background: var(--primary-color);
    color: var(--white);
    padding: 10px 2px;
    border: none;
    outline: none;
    border-radius: 8px;;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffeaea;
  color: #c62828;
  border: 1px solid #f44336;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>