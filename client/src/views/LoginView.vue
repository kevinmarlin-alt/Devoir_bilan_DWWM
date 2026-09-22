<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthError, login } from '@/services/auth.service';
import { getDashboardRouteName } from '@/router/role-route';
import { useAuth } from '@/composables/useAuth';

const router = useRouter()

const { setUser } = useAuth();

const loginError = ref<string | null>(null);
const isSubmitting = ref(false);

async function handleSubmit (e: Event) {
    e.preventDefault();

    if(isSubmitting.value) {
        return;
    }

    loginError.value = null;
    isSubmitting.value = true;

    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const credentials = {
        email: String(data.get('email') ?? ''),
        password: String(data.get('password') ?? ''),
    }

    try {
        const user = await login(credentials);

        setUser(user);
    
        const routeName = getDashboardRouteName(user.roles);
    
        if(!routeName) {
            loginError.value = 'Aucun tableau de bord disponible pour cette utilisateur';
            return;
        }
    
        router.push({ name: routeName });
        
    } catch (error) {
        if(error instanceof AuthError) {
            loginError.value = error.message;
            return;
        }
        loginError.value = 'Une erreur inattendue est survenue';
    } finally {
        isSubmitting.value = false;
    }
    

}



</script>

<template>

<main class="login-page">
    <p class="login-page__slogan-top">
        Au service d'un quotidien<br>
        plus serein
    </p>
    <div class="panel-container">
        <section class="login-page__auth auth-panel">
            <div class="auth-panel__card">
                <header class="auth-panel__header">
                    <h1 class="auth-panel__title">
                        Connexion à l'espace professionnel
                    </h1>
                    <p class="auth-panel__description">
                        Accédez à la plateforme Harmonie Domicile
                    </p>
                </header>
                <form 
                    class="auth-panel__form login-form"
                    @submit="handleSubmit" 
                    novalidate
                >
                    <div class="login-form__field">
                        <label for="email" class="login-form__label">
                            Adresse e-mail professionnelle
                        </label>
                        <div class="login-form__control">
                            <span class="login-form__icon">✉️</span>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                class="login-form__input"
                                autocomplete="email"
                                placeholder="nom@harmonie-domicile.fr"
                                value="admin@harmonie.test"
                                required
                            />
                        </div>
                        <p class="login-form__error"></p>
                    </div>
                    <div class="login-form__field">
                        <label for="password" class="login-form__label">
                            Mot de passe
                        </label>
                        <div class="login-form__control">
                            <span class="login-form__icon">🔒</span>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                class="login-form__input"
                                autocomplete="current-password"
                                placeholder="Votre mot de passe"
                                value="Password123!"
                                required
                            />
                            <button
                                class="login-form__password-toggle"
                                type="button"
                                aria-label="Afficher le mot de passe"
                            >
                            👁️
                            </button>
                        </div>
                        <p class="login-form__error"></p>
                    </div>
                    <div class="login-form__options">
                        <label class="login-form__checkbox-label">
                            <input
                                type="checkbox"
                                class="login-form__checkbox"
                            />
                            <span class="login-form__remember-label">
                                Se souvenir de moi
                            </span>
                        </label>
                        <a
                            class="login-form__forgot-link"
                            href="http://"
                        >
                            Mot de passe oublié ?
                        </a>
                    </div>
                    <!-- Message d'erreur de connexion -->
                    <p 
                        v-if="loginError" 
                        class="login-form__error" 
                        role="alert"
                    >   
                        {{ loginError }}
                    </p>

                    <button
                        class="login-form__submit"
                        type="submit"
                        :disabled="isSubmitting"
                    >
                        <span class="login-form__submit-label">
                            {{ isSubmitting ? 'Connexion...' : 'Se connecter' }}
                        </span>
                        <span 
                            v-if="!isSubmitting"
                            class="login-form__submit-icon">
                            →
                        </span>
                    </button>
                </form>
                <hr class="auth-panel__hr"/>
                <aside class="auth-panel__security-notice security-notice">
                    <span class="security-notice__icon"></span>
                    <div class="security-notice__content">
                        <strong class="security-notice__title">
                            Accès réservé au personnel autorisé
                        </strong>
                        <p class="security-notice__description">
                            Connexion sécurisée · Données protégées
                        </p>
                    </div>
                </aside>
                <hr class="auth-panel__hr"/>
                <footer class="auth-panel__support support-info">
                    <span class="support-info__icon"></span>
                    <div class="support-info__content">
                        <strong class="support-info__title">
                            Besoin d'aide ?
                        </strong>
                        <p class="support-info__description">
                            Contectez l'administrateur ou le support interne.
                        </p>
                    </div>
                </footer>
        
            </div>
        </section>
        <section class="login-gape__intro intro-panel">
            <header class="intro-panel__header">
                <img
                    class="intro-panel__logo"
                    src="/assets/logo.png"
                    alt="Harmonie Domicile"
                    width="800"
                    height="270"
                />
                <p class="intro-panel__tagline">Portail professionnel</p>
            </header>
            <div class="intro-panel__content">
                <h2 class="intro-panel__title">
                    Des équipes engagées pour un meilleur accompagnement
                </h2>
                <p class="intro-panel__description">
                    Accédez à vos outils métiers et facilitez la cpprdination des services à domicile.
                </p>
                <ul class="intro-panel__features">
                    <li class="intro-panel__feature">
                        <span class="intro-panel__feature-icon"></span>
                        <div class="intro-panel__feature-content">
                            <strong class="intro-panel__feature-title">
                                Gestions des interventions
                            </strong>
                            <span class="intro-panel__feature-description">
                                Planification et suivi en temps réel
                            </span>
                        </div>
                    </li>
                    <li class="intro-panel__feature">
                        <span class="intro-panel__feature-icon"></span>
                        <div class="intro-panel__feature-content">
                            <strong class="intro-panel__feature-title">
                                Suivi des bénéficiaires
                            </strong>
                            <span class="intro-panel__feature-description">
                                Information centralisées et à jour
                            </span>
                        </div>
                    </li>
                    <li class="intro-panel__feature">
                        <span class="intro-panel__feature-icon"></span>
                        <div class="intro-panel__feature-content">
                            <strong class="intro-panel__feature-title">
                                Coordination des équipes
                            </strong>
                            <span class="intro-panel__feature-description">
                                Une organisation plus efficace
                            </span>
                        </div>
                    </li>
                    <li class="intro-panel__feature">
                        <span class="intro-panel__feature-icon"></span>
                        <div class="intro-panel__feature-content">
                            <strong class="intro-panel__feature-title">
                                Accès à vos outils métiers
                            </strong>
                            <span class="intro-panel__feature-description">
                                Tout votre environnement de travail
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        
        </section>
    </div>


    <p class="login-page__slogan-bottom">
        Ensemble,<br/>
        au service des territoires
    </p>
</main>

</template>

<style>

.login-page {
    background-color: #f2f4f1;
    position: relative;
    padding: 1rem;
    
}

.panel-container {
    display: flex;
    flex-direction: column-reverse;
}

.login-page__slogan-top {
    position: absolute;
    top: 1rem;
    right: 1rem;
    text-align: end;
    text-transform: uppercase;
    font-size: .6rem;
    text-wrap: initial;
}

.login-page__slogan-bottom {
    text-transform: uppercase;
    font-size: .6rem;
}

.intro-panel__header {
    margin-bottom: 2rem;
}
.intro-panel__logo {
    width: 150px;
}

.intro-panel__tagline {
    padding-left: 60px;
    text-transform: uppercase;
    font-size: .6em;
}

.intro-panel__title {
    font-size: 2rem;
    max-width: 300px;
    margin-bottom: 1rem;
    line-height: 2rem;
}

.intro-panel__description {
    max-width: 260px;
    margin-bottom: 1rem;
}



.intro-panel__features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
}

.intro-panel__feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 5em;

}

.intro-panel__feature:nth-child(n + 4) {
    display: none;
}

.intro-panel__feature-icon {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 100px;
    background-color: rgb(230, 236, 227);
    margin-bottom: 5px;
}

.intro-panel__feature-content {
    width: 100%;
    margin-bottom: 1.5rem;
}

.intro-panel__feature-title {
    font-size: .7rem;
    line-height: 0rem !important; 
}

.intro-panel__feature-description {
    display: none;
}

.auth-panel__card {
    box-shadow: 0 0 10px #dbdbdb;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    background-color: #fbfbfb;
}

.auth-panel__hr {
    margin: 1rem 0;
    border: none;
    border-top: 1px solid rgb(220, 225, 222);
}

.auth-panel__header {
    margin-bottom: 1.5rem;
}

.auth-panel__title {
    font-size: 2em;
    margin-bottom: 0.5rem;
}

.login-form__field {
    margin-bottom: 1rem;
}

.login-form__label {
    font-size: 0.9rem;
}

.login-form__control {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 0 .8rem;
    margin-top: 5px;
}

.login-form__input {
    width: 100%;
    margin: 0 5px;
    padding: 15px 10px;
}

.login-form__password-toggle:hover {
    cursor: pointer;
}

.login-form__error {
    margin-bottom: 1rem;
}

.login-form__options {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.login-form__checkbox-label {
    display: flex;
    align-items: center;
}

.login-form__checkbox {
    margin-right: 15px;
}

.login-form__remember-label {
    font-size: 0.8rem;
}

.login-form__forgot-link {
    font-size: 0.8rem;
    text-decoration: underline;
    color: #4e614d;
}

.login-form__error {
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: red;
}

.login-form__submit {
    background-color: #4e614d;
    color: #fff;
    padding: 15px 0;
    width: 100%;
    border-radius: 10px;
}

.login-form__submit:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

.login-form__submit:hover {
    background-color: #323d31;
}

.security-notice {
    display: flex;
    align-items: center;
    background-color: #f2f7f1;
    border-radius: 10px;
    margin-bottom: 1rem;
    color: #536e52;
    padding: 10px 15px ;
}

.security-notice__icon {
    width: 40px;
    height: 40px;
    border-radius: 100px;
    background-color: #e2eae0;
    margin-right: 15px;
}

.security-notice__title {
    font-size: 0.9rem;
}
.security-notice__description {
    font-size: 0.8rem;
}

.support-info {
    display: flex;
    align-items: center;
}

.support-info__icon {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background-color: #f0f0f0;
    margin-right: 15px;
}

.support-info__title {
    font-size: 0.9rem;
}
.support-info__description {
    font-size: 0.8rem;
}

</style>
