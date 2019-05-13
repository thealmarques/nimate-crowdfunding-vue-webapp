<template>
  <div id="app">
    <NavigationBar/>
    <router-view></router-view>
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar";

export default {
  name: "App",
  components: {
    NavigationBar
  }
};
</script>

<style lang="scss">
@import "./assets/styles/app.scss";
</style>
