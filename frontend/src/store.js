import { defineStore } from 'pinia'

export default defineStore({
  id: 'store',
  persist: true,

  state: () => ({ 
    username: null
  }),
})
