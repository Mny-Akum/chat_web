<template>
  <div>
    <my-cat/>
    <router-view />
  </div>
</template>
<script>
import clickEffect from "@/utils/clickEffect"
import MyCat from '@/components/MyCat'
export default {
  data() {
    return {

    }
  },
  components:{
    MyCat
  },
  mounted() {
    document.documentElement.style.fontSize = document.documentElement.clientHeight / 957 * 12 + 'px'
    clickEffect.note()
    this.$router.push("/login")
  },
  methods: {

  }
}
</script>

<style></style>
