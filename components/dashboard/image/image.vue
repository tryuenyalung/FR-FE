<template>
    <div>
        <br>
        <div class="tab-padding tabs is-centered is-boxed">
            <ul>

                <li @click="changeActiveTab('my images')" :class="{'is-active' : activeTab === 'my images' }">
                    <a>
                        <span>My Images</span>
                    </a>
                </li>

                <li @click="changeActiveTab('shared images')" :class="{'is-active' : activeTab === 'shared images' }">
                    <a>
                        <!-- <p v-if="this.$store.state.efile_notification.pendingEfileNotif > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.$store.state.efile_notification.pendingEfileNotif}}</p></span>
                            &nbsp;&nbsp;
                        </p> -->
                        <span>Shared Images</span>
                    </a>
                </li>

            </ul>
        </div><!--tabs-->

        <!--tab's content-->
        <myImages v-if="activeTab === 'my images' "/>
        <sharedImages  v-if="activeTab === 'shared images' " />

    </div>
</template>

<script>
    import loader from '~/components/loader'
    import axios from 'axios'
    import keys from '~/components/keys.js'
    import myImages from './myImage'
    import sharedImages from './sharedImage'

    export default {

        components:{
            myImages,
            sharedImages,
            loader
        },//components
        
        // created() {this.getAllNotifs()},
        
        data(){

            return{
                activeTab : 'my images',
            }//return
        
        },//data
        
        methods:{
            changeActiveTab(tab){
                this.activeTab = tab
                // this.getAllNotifs()
            },

            // getPendingEfileNotif(){
            //     const config = {
            //         method: 'GET',
            //         url: `${keys.BASE_URL}/api/v1/efiles/pending/${this.$store.state.user_details.user._id}`,
            //         headers:{
            //             "Authorization" : `Bearer ${this.$store.state.user_details.token}`
            //         }
            //     }

            //     axios(config)
            //         .then( res =>  {

            //             this.$store.dispatch('efile_notification/GET_PENDING_EFILE_NOTIFICATION', res.data.total)
                    
            //             // this.toggleLoader()
            //         })
            //         .catch( err => {
            //             // this.toggleLoader()
            //             alert(err)
            //         })

            // },

            // getRejectedEfileNotif(){

            //     const config = {
            //         method: 'GET',
            //         url: `${keys.BASE_URL}/api/v1/efiles/rejected/${this.$store.state.user_details.user._id}`,
            //         headers:{
            //             "Authorization" : `Bearer ${this.$store.state.user_details.token}`
            //         }
                    
            //     }


            //     axios(config)
            //         .then( res =>  {

            //             this.$store.dispatch('efile_notification/GET_REJECTED_EFILE_NOTIFICATION', res.data.total)
                    
            //             // this.toggleLoader()
            //         })
            //         .catch( err => {
            //             // this.toggleLoader()
            //             alert(err)
            //         })

            // },

            // getAllNotifs(){
            //     this.getPendingEfileNotif()
            //     this.getRejectedEfileNotif()
            // }



        }//methods
    }
</script>

<style scoped>

</style>