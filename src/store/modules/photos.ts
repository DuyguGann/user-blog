import axios from 'axios'
import { ActionContext } from 'vuex'

export interface Photo {
    albumId: number
    id: number
    title: string
    url: string
    thumbnailUrl: string
}

export interface PhotosState {
    photos: Photo[]
    isLoading: boolean
    error: string | null
}

const state: PhotosState = {
    photos: [],
    isLoading: false,
    error: null
}

export default {
    namespaced: true,

    state,

    mutations: {
        setPhotos(state: PhotosState, photos: Photo[]) {
            state.photos = photos
        },
        setLoading(state: PhotosState, status: boolean) {
            state.isLoading = status
        },
        setError(state: PhotosState, error: string | null) {
            state.error = error
        }
    },

    getters: {
        getPhotos: (state: PhotosState) => state.photos,
        isLoading: (state: PhotosState) => state.isLoading,
        getError: (state: PhotosState) => state.error
    },

    actions: {
        async fetchPhotos(
            { commit }: ActionContext<PhotosState, unknown>,
            albumId: number
        ) {
            commit('setLoading', true)
            commit('setError', null)
            try {
                const response = await axios.get<Photo[]>(
                    `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`
                )
                commit('setPhotos', response.data)
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
