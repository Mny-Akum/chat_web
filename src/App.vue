<template>
  <div>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.$router.push("/login")
  },
  methods: {

  }
}
</script>

<style></style>
