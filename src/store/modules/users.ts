import { Module, ActionContext } from 'vuex'
import axios from 'axios'

interface Address {
    city: string
}

export interface Users {
    id: number
    name: string
    email: string
    address: Address
}

interface UserState {
    users: Users[]
    user: Users | null
    isLoading: boolean
    error: string | null
}

const state: UserState = {
    users: [],
    user: null,
    isLoading: false,
    error: null
}

const userModule: Module<UserState, unknown> = {
    namespaced: true,
    state,
    getters: {
        getUsers: (state): Users[] => state.users,
        getUser: (state): Users | null => state.user,
        isLoading: (state): boolean => state.isLoading,
        getError: (state): string | null => state.error
    },
    mutations: {
        SET_USERS(state: UserState, users: Users[]) {
            state.users = users
        },
        SET_USER(state: UserState, user: Users) {
            state.user = user
        },
        SET_LOADING(state: UserState, loading: boolean) {
            state.isLoading = loading
        },
        SET_ERROR(state: UserState, error: string | null) {
            state.error = error
        }
    },
    actions: {
        async fetchUsers({ commit }: ActionContext<UserState, unknown>): Promise<void> {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                const response = await axios.get<Users[]>('https://jsonplaceholder.typicode.com/users')
                commit('SET_USERS', response.data)
            } catch (error: unknown) {
                commit('SET_ERROR', error instanceof Error ? error.message : 'Bilinmeyen hata')
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchUserDetail(
            { commit }: ActionContext<UserState, unknown>,
            id: number
        ): Promise<void> {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                const response = await axios.get<Users>(`https://jsonplaceholder.typicode.com/users/${id}`)
                commit('SET_USER', response.data)
            } catch (error: unknown) {
                commit('SET_ERROR', error instanceof Error ? error.message : 'Bilinmeyen hata')
            } finally {
                commit('SET_LOADING', false)
            }
        }
    }
}

export default userModule
