<template>
    <div>

  
        <dashNav/>

        <div class="columns">

            <div class="column is-block is-one-fifth is-hidden-mobile is-hidden-touch is-fullheight">
                <sideNav/>
                
            </div>

            <div class="column ">
                <dashboardContent/>
            </div><!--column-->
            
        </div><!--columns-->

    </div>
</template>

<script>

    import dashNav from '~/components/dashboard/dashNav'
    import sideNav from '~/components/dashboard/sideNav'
    import dashboardContent from '~/components/dashboard/content'


    export default {
        components:{
            dashNav,
            sideNav,
            dashboardContent
        },

        data(){
            return{

            }//return
        }, 

        methods: {
        }//methods
    }
</script>

<style scoped>

</style>