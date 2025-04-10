<script setup>
import { RouterLink, RouterView } from "vue-router";
import $ from "jquery";
import { onMounted } from "vue";
import { useUserDataStore } from "@/stores/userData";
import IconRecordPlayer from "@/components/icons/IconRecordPlayer.vue";

import { storeToRefs } from "pinia";

const userDataStore = useUserDataStore();
const { userData } = storeToRefs(userDataStore);

onMounted(() => {
  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});
</script>

<template>
  <header>
    <nav class="navbar py-3 is-black is-sticky" role="navigation" aria-label="main navigation">
      <div class="container is-fluid">
        <div class="navbar-brand">
          <RouterLink to="/">
            <a class="navbar-item">
              <IconRecordPlayer />
            </a>
          </RouterLink>
          <RouterLink to="/" class="navbar-item">🎼Spotify Personalized🎵</RouterLink>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <RouterLink to="/dashboard" class="navbar-item">Dashboard</RouterLink>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">Your Favourites</a>
              <div class="navbar-dropdown">
                <RouterLink to="/hof" class="navbar-item">Hall of Fame</RouterLink>
                <hr class="navbar-divider">
                <RouterLink to="/rp" class="navbar-item">Recently Played</RouterLink>
              </div>
            </div>
            <RouterLink to="/tunerank" class="navbar-item">TasteRank</RouterLink>
            <RouterLink to="/browse" class="navbar-item">Search</RouterLink>
          </div>

          <!-- Place the About link in the navbar-end section -->
          <div class="navbar-end">
            <RouterLink to="/about" class="navbar-item">About</RouterLink>
            <!-- Optionally, you can add other right-side items here -->
          </div>
        </div>
      </div>
    </nav>
  </header>
  <div id="content">
    <RouterView />
  </div>
</template>

<!-- Scoped style with global selectors -->
<style scoped>
/* Use :global to apply background styles outside this component */
:global(html), :global(body) {
  margin-bottom: 10px;
  padding: 0;
  height: 100%;
  background: url("@/assets/bg.png") no-repeat center center fixed;
  filter: blur();
  background-size: cover;
  font-family: 'Libre Baskerville', Baskerville, serif;
}

/* Ensure content area fills the viewport */
#content {
  min-height: 100vh;
}

.navbar.is-black {
  background-color: #1c1c1c !important;
}

.navbar {
  border-radius: 5px;
  padding-bottom: 10px;
}

.navbar-item:hover {
  background-color: #ffa500; 
  border-radius: 5%;           
  padding: 0.5rem;              
}

.navbar.is-s {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000; /* Ensure it stays above other elements */
}
/* Other component-specific styles can go here */
</style>
