<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import clickEffect from "@/utils/clickEffect"
export default {
  data() {
    return {

    }
  },
  mounted() {
    clickEffect.note()
    this.$router.push("/login")
  },
  methods: {

  }
}
</script>

<style></style>
