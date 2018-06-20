<template>
     

        <div class="modal" :class="{'is-active' : isActive }" >
            <div class="modal-background"></div>
            <div class="modal-content" style="overflow: hidden;">
                <div id="cssSpiner" >

                </div>
            </div>
        </div>

  
</template>

<script>
    export default {
        props:{
            isActive : Boolean
        }//props
        
    }
</script>

<style scoped>

</style>