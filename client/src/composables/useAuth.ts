import { getAuthenticatedUser } from "@/services/auth.service";
import type { AuthUser } from "@/types/auth.type";
import { ref } from "vue";

const user = ref<AuthUser | null>(null);
const initialized = ref(false);

export function useAuth() {
    async function initializeAuth(): Promise<AuthUser | null> {
        if(initialized.value) {
            return user.value;
        }

        user.value = await getAuthenticatedUser();
        initialized.value = true;

        return user.value;
    }

    function setUser(authentificatedUser: AuthUser) {
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