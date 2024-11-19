<template>
  <div>
    <my-cat/>
    <router-view />
  </div>
</template>
<script>
import clickEffect from "@/utils/clickEffect"
import MyCat from '@/components/myCat/MyCat.vue'
export default {
  data() {
    return {

    }
  },
  components:{
    MyCat
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
