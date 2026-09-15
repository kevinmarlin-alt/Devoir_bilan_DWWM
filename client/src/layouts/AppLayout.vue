<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <div class="app-layout">
        <header class="app-header">
            <RouterLink
                class="app-logo"
                to="/"
            >
                Harmonie Domicile
            </RouterLink>

            <div class="app-user">
                Utilisateur
            </div>
        </header>

        <div class="app-body">
            <aside class="app-sidebar">
                <nav aria-label="Navigation principale">
                    <RouterLink to="/">
                        Accueil
                    </RouterLink>
                </nav>
            </aside>

            <main class="app-content">
                <RouterView />
            </main>
        </div>

        <nav
            class="app-mobile-nav"
            aria-label="Navigation mobile"
        >
            <RouterLink to="/">
                Accueil
            </RouterLink>
        </nav>
    </div>
</template>

<style scoped>
.app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-header {
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    border-bottom: 1px solid #ddd;
}

.app-logo {
    font-weight: 700;
    text-decoration: none;
    color: inherit;
}

.app-body {
    flex: 1;
    display: flex;
}

.app-sidebar {
    width: 240px;
    padding: 1.5rem;
    border-right: 1px solid #ddd;
}

.app-content {
    flex: 1;
    padding: 1.5rem;
}

.app-mobile-nav {
    display: none;
}

@media (max-width: 768px) {
    .app-sidebar {
        display: none;
    }

    .app-content {
        padding: 1rem;
        padding-bottom: 5rem;
    }

    .app-mobile-nav {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;

        display: flex;
        justify-content: space-around;

        min-height: 64px;
        padding: 0.5rem;

        background: white;
        border-top: 1px solid #ddd;
    }
}
</style>