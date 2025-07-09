import { createStore } from 'vuex'
import userModule from '@/store/modules/users'
import postModule from '@/store/modules/post-list'
import comments from "@/store/modules/comments";
import todos from "@/store/modules/todos";
import photos from "@/store/modules/photos";
export default createStore({
  modules: {
    users: userModule,
    postList:postModule,
    comments:comments,
    todos: todos,

    photos:photos

  }
})
