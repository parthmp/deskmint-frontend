declare module 'vue-material-design-icons/*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{
      size?: number | string
      fillColor?: string
    }>
    export default component
  }