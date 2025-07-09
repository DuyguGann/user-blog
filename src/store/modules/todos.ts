import axios from 'axios'
import { ActionContext, Module } from 'vuex'

export interface Todo {
    userId: number
    id: number
    title: string
    completed: boolean
}

export interface TodosState {
    todos: Todo[]
    isLoading: boolean
    error: string | null
}

const state: TodosState = {
    todos: [],
    isLoading: false,
    error: null
}

const todosModule: Module<TodosState, unknown> = {
    namespaced: true,

    state,

    mutations: {
        setTodos(state: TodosState, todos: Todo[]) {
            state.todos = todos
        },
        setLoading(state: TodosState, status: boolean) {
            state.isLoading = status
        },
        setError(state: TodosState, error: string | null) {
            state.error = error
        }
    },

    getters: {
        getTodos(state: TodosState): Todo[] {
            return state.todos
        },
        isLoading(state: TodosState): boolean {
            return state.isLoading
        },
        getError(state: TodosState): string | null {
            return state.error
        }
    },

    actions: {
        async fetchTodos({ commit }: ActionContext<TodosState, unknown>, userId: number): Promise<void> {
            commit('setLoading', true)
            commit('setError', null)
            try {
                const response = await axios.get<Todo[]>(
                    `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
                )
                commit('setTodos', response.data)
            } catch (error: unknown) {
                commit('setError', error instanceof Error ? error.message : 'Bir hata oluştu')
            } finally {
                commit('setLoading', false)
            }
        },

        async updateTodo(
            { commit, state }: ActionContext<TodosState, unknown>,
            updatedTodo: Todo
        ): Promise<void> {
            try {
                const response = await axios.patch<Todo>(
                    `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
                    { completed: updatedTodo.completed }
                )

                const newTodos = state.todos.map((todo) =>
                    todo.id === updatedTodo.id ? response.data : todo
                )
                commit('setTodos', newTodos)
            } catch (error: unknown) {
                commit('setError', error instanceof Error ? error.message : 'Güncelleme sırasında bir hata oluştu')
            }
        }
    }
}

export default todosModule
