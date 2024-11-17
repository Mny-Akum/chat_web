<template>
    <div :style="{width,height}" class="all" v-if="open">

    </div>
</template>
    <script>
    export default {
        name:"Levitation",
        props:['PersonalHomepage','height','width','open'],
        data(){
            return{

            }
        },
        methods:{

        },

    }
</script>
<style scoped>
.all{
    background: black;
    position: absolute;
    top: 0;
    left: 5.5rem;
}
</style>