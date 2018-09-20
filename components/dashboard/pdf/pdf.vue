<template>
    <div>
        <br>
        <div class="tab-padding tabs is-centered is-boxed is-marginless is-paddingless">
            <ul>

                <li @click="changeActiveTab('my pdfs')" :class="{'is-active' : activeTab === 'my pdfs' }">
                    <a>
                        <span>My Pdfs</span>
                    </a>
                </li>

                <li @click="changeActiveTab('shared pdfs')" :class="{'is-active' : activeTab === 'shared pdfs' }">
                    <a>
                        <!-- <p v-if="this.$store.state.efile_notification.pendingEfileNotif > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.$store.state.efile_notification.pendingEfileNotif}}</p></span>
                            &nbsp;&nbsp;
                        </p> -->
                        <span>Shared Pdfs</span>
                    </a>
                </li>

            </ul>
        </div><!--tabs-->

        <!--tab's content-->
        <myPdfs v-if="activeTab === 'my pdfs' "/>
        <sharedPdfs  v-if="activeTab === 'shared pdfs' " />

    </div>
</template>

<script>
    import loader from '~/components/loader'
    import axios from 'axios'
    import keys from '~/components/keys.js'
    import myPdfs from './myPdf'
    import sharedPdfs from './sharedPdf'

    export default {

        components:{
            myPdfs,
            sharedPdfs,
            loader
        },//components
        
        
        data(){

            return{
                activeTab : 'my pdfs',
            }//return
        
        },//data
        
        methods:{
            changeActiveTab(tab){
                this.activeTab = tab
                // this.getAllNotifs()
            },



        }//methods
    }
</script>

<style scoped>

</style>