<script setup>
import LoginButton from "@/components/LoginButton.vue";

function handleLogin() {
  window.location.href = "/api/login";
}
</script>

<template>
  <section class="hero is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title">🎶 Welcome To our Spotify Wrapper Project!</h1>
          <p class="subtitle mt-5">🎹 This is a simple test of the Spotify API</p>
          <p class="subtitle">Click the button below to log in with your Spotify account and start using the app.</p>
          <p class="title mt-5">👇</p>
            <LoginButton @click="handleLogin" />
        </div>
      </div>
    </div>
  </section>
  <div>
  </div>
</template>