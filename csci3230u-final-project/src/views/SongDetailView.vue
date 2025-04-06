<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const songId = route.params.id
</script>

<template>
  <div>
    <h1>Song Detail Page</h1>
    <p>Track ID: {{ songId }}</p>
  </div>
</template>