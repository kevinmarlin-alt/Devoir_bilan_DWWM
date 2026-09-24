import { getAuthenticatedUser } from "@/services/auth.service.js";
import { ref } from "vue";

const user = ref(null);
const initialized = ref(false);

export function useAuth() {
    async function initializeAuth() {
        if(initialized.value) {
            return user.value;
        }

        user.value = await getAuthenticatedUser();
        initialized.value = true;

        return user.value;
    }

    function setUser(authentificatedUser) {
        user.value = authentificatedUser;
        initialized.value = true;
    }

    function clearUser() {
        user.value = null;
        initialized.value = true;
    }

    return {
        user,
        initialized,
        initializeAuth,
        setUser,
        clearUser
    }
};