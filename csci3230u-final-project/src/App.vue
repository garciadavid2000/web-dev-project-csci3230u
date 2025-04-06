<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/top-songs">Top Songs</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/browse">Browse</RouterLink>
    </nav>
  </header>
  <div id="content">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  background-color: rgb(46, 53, 67);
  line-height: 1.5;
  display: flex;
  place-items: center;
  margin: 0;
  width: 100%;
}

#content {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 2rem;
  overflow: hidden;
  /* padding: 10px 20px; */
  display: flex;
  flex-direction: row;
  justify-content: flex-end; /* Align items to the right */
  align-items: center;
  text-align: left;
  padding: 1rem 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  /* border-left: 1px solid var(--color-border); */
}
/* 
nav a:first-of-type {
  border: 0;
} */
</style>
