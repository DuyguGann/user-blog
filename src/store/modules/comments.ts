import axios from 'axios'
import { ActionContext } from 'vuex'

export interface Comment {
    postId: number
    id: number
    name: string
    email: string
    body: string
}

export interface CommentsState {
    comments: Comment[]
    isLoading: boolean
    error: string | null
}

const state: CommentsState = {
    comments: [],
    isLoading: false,
    error: null
}

export default {
    namespaced: true,

    state,

    mutations: {
        setComments(state: CommentsState, comments: Comment[]) {
            state.comments = comments
        },
        setLoading(state: CommentsState, loading: boolean) {
            state.isLoading = loading
        },
        setError(state: CommentsState, error: string | null) {
            state.error = error
        }
    },

    getters: {
        getComments(state: CommentsState): Comment[] {
            return state.comments
        },
        isLoading(state: CommentsState): boolean {
            return state.isLoading
        },
        getError(state: CommentsState): string | null {
            return state.error
        }
    },

    actions: {
        async fetchComments({ commit }: ActionContext<CommentsState, unknown>, postId: number) {
            commit('setLoading', true)
            commit('setError', null)
            try {
                const response = await axios.get<Comment[]>(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
                commit('setComments', response.data)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    commit('setError', error.message)
                } else {
                    commit('setError', 'Bilinmeyen bir hata oluştu')
                }
            } finally {
                commit('setLoading', false)
            }
        }
    }

}
