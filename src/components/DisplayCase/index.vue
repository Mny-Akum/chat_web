<template>
  <div id="case_content">
    <div v-html="content">

    </div>
  </div>
</template>

<script>
export default {
    name:"displayCase",
    props:["content"],
    data(){
        return {

        }
    },
    methods:{

    }
}
</script>

<style lang="less" scoped>
#case_content{
    backdrop-filter: blur(2rem);
    box-shadow: inset 0px 0px 1rem 0.2rem rgb(255, 255, 255, 0.5);
    height: 50.2rem;
    width: 42rem;
    margin: 1.5rem 1rem;
    border-radius: 2rem;
}
</style>