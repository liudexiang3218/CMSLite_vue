<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App',
  created() {
    this.$i18n.locale = this.$store.getters.language
  }
}
</script>
