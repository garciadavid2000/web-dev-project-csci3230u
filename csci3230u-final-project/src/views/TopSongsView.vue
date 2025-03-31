<script setup>
// @ is an alias for src, making this an absolute path
import SongCard from '@/components/SongCard.vue';
import { ref } from 'vue'

const songsData = ref({
    tracks: [
        {
            name: "FE!N (feat. Playboi Carti)",
            album: "UTOPIA",
            artist: "Travis Scott, Playboi Carti",
            image: "https://i.scdn.co/image/ab67616d0000b273881d8d8378cd01099babcd44",
            duration_ms: 191700
        },
        {
            name: "Habla Matador",
            album: "10 Éxitos Duros",
            artist: "El Taiger, El Happy",
            image: "https://i.scdn.co/image/ab67616d0000b273f31ca9b1687b4b40fcbc251c",
            duration_ms: 163551
        },
        {
            name: "Die For You",
            album: "SMITHEREENS",
            artist: "Joji",
            image: "https://i.scdn.co/image/ab67616d0000b273cdd1a8a427b3f81f4f4f4f7d",
            duration_ms: 211666
        },
        {
            name: "Pa' Lante un Pie",
            album: "MIMY & TONY",
            artist: "Mimy Succar, Tony Succar",
            image: "https://i.scdn.co/image/ab67616d0000b273771b98100781795d322e5c8e",
            duration_ms: 257359
        },
        {
            name: "Chabuca Limeña",
            album: "MIMY & TONY",
            artist: "Mimy Succar, Tony Succar, Rafael \"Pollo\" Brito",
            image: "https://i.scdn.co/image/ab67616d0000b273771b98100781795d322e5c8e",
            duration_ms: 322426
        }
    ],
    totalListeningTimeMinutes: "19.11"
});


</script>


<template>
    <div>
        <SongCard v-for="song in songsData.tracks" :key="song.name" :cardProp="song" />
    </div>
</template>