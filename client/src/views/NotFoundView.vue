<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <section>
        <h1>404</h1>

        <p>La page demandée n'existe pas.</p>

        <RouterLink to="/">
            Retour à l'accueil
        </RouterLink>
    </section>
</template>