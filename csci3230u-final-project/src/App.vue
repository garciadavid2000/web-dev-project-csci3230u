<script setup>
import { RouterLink, RouterView } from "vue-router";
import $ from "jquery";
import { onMounted } from "vue";
import { useUserDataStore } from "./stores/userData";

const userDataStore = useUserDataStore();
import { storeToRefs } from "pinia";
const { userData } = storeToRefs(userDataStore);

onMounted(() => {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});

</script>

<template>
  <header>
    <!-- <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/top-songs">Top Songs</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/browse">Search</RouterLink>
    </nav> -->
    <nav class="navbar is-dark mb-4" role="navigation" aria-label="main navigation">
      <!-- navbar-brand -->
      <div class="navbar-brand">
        <RouterLink to="/">
          <a class="navbar-item">
            <!-- made the logo wide and funny looking on purpose because thats how it looked in the lab picures -->
            <!-- replace the uncommented line with the commented line to have the logo sized evenly -->
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVIHOyzHbOhpoMDZegU6QFAEW05jUtfHwYkQ&s"
              width="60" height="70" alt="Sudoku Logo" />
            <!-- <img src="images/logo.gif" alt="Sudoku Logo" /> -->
          </a>
        </RouterLink>

        <RouterLink to="/dashboard" class="navbar-item">Epic And Cool Spotify App</RouterLink>

        <!-- Burger item -->
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <!-- needed 4 spans otherwise it would only show 2 lines for some reason -->
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <!-- navbar-menu -->
      <div id="navbarBasicExample" class="navbar-menu">
        <!-- nav-Start -->
        <div v-if="userData" class="navbar-start">
          <!-- Items -->
          <RouterLink to="/dashboard" class="navbar-item">Dashboard</RouterLink>
          <RouterLink to="/top-songs" class="navbar-item">Top Songs</RouterLink>
          <RouterLink to="/about" class="navbar-item">About</RouterLink>
          <RouterLink to="/browse" class="navbar-item">Search</RouterLink>
          <RouterLink to="/tunerank" class="navbar-item">TuneRank</RouterLink>
        </div>

      </div>
    </nav>
  </header>
  <div id="content">
    <RouterView />
  </div>
</template>

<style scoped>

</style>
