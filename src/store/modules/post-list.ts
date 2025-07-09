import axios from 'axios'
import { ActionContext } from 'vuex'

export interface Post {
    userId: number
    id: number
    title: string
    body: string
}

export interface PostsState {
    posts: Post[]
    isLoading: boolean
    error: string | null
}

const state: PostsState = {
    posts: [],
    isLoading: false,
    error: null
}

export default {
    namespaced: true,

    state,

    mutations: {
        setPosts(state: PostsState, posts: Post[]) {
            state.posts = posts
        },
        addPost(state: PostsState, post: Post) {
            state.posts.unshift(post)
        },
        updatePost(state: PostsState, updatedPost: Post) {
            const index = state.posts.findIndex(p => p.id === updatedPost.id)
            if (index !== -1) {
                state.posts[index] = updatedPost
            }
        },
        deletePost(state: PostsState, id: number) {
            state.posts = state.posts.filter(p => p.id !== id)
        },
        setLoading(state: PostsState, status: boolean) {
            state.isLoading = status
        },
        setError(state: PostsState, error: string | null) {
            state.error = error
        }
    },

    getters: {
        getPosts: (state: PostsState): Post[] => state.posts,
        isLoading: (state: PostsState): boolean => state.isLoading,
        getError: (state: PostsState): string | null => state.error
    },

    actions: {
        async fetchPosts({ commit }: ActionContext<PostsState, unknown>, userId: number): Promise<void> {
            commit('setLoading', true)
            commit('setError', null)
            try {
                const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
                commit('setPosts', response.data)
            } catch (error: unknown) {
                commit('setError', error instanceof Error ? error.message : 'Bilinmeyen hata')
            } finally {
                commit('setLoading', false)
            }
        },

        async createPost({ commit }: ActionContext<PostsState, unknown>, post: Omit<Post, 'id'>): Promise<void> {
            try {
                const response = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', post)
                commit('addPost', response.data)
            } catch (error: unknown) {
                commit('setError', error instanceof Error ? error.message : 'Bilinmeyen hata')
            }
        },

        async updatePost({ commit }: ActionContext<PostsState, unknown>, post: Post): Promise<void> {
            try {
                const response = await axios.put<Post>(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post)
                commit('updatePost', response.data)
            } catch (error: unknown) {
                commit('setError', error instanceof Error ? error.message : 'Bilinmeyen hata')
            }
        },

        async partialUpdatePost(
            { commit }: ActionContext<PostsState, unknown>,
            partialPost: Partial<Post> & { id: number }
        ): Promise<void> {
            try {
                const response = await axios.patch<Post>(`https://jsonplaceholder.typicode.com/posts/${partialPost.id}`, partialPost)
                commit('updatePost', response.data)
            } catch (error: unknown) {
                commit('setError', error instanceof Error ? error.message : 'Bilinmeyen hata')
            }
        },

        async deletePost({ commit }: ActionContext<PostsState, unknown>, id: number): Promise<void> {
            try {
                await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
                commit('deletePost', id)
            } catch (error: unknown) {
                commit('setError', error instanceof Error ? error.message : 'Bilinmeyen hata')
            }
        }
    }
}
