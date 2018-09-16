<template>
    <div>
        <br>
        <div class="tab-padding tabs is-centered is-boxed is-marginless is-paddingless">
            <ul>

                <li @click="changeActiveTab('my documents')" :class="{'is-active' : activeTab === 'my documents' }">
                    <a>
                        <span>My Words</span>
                    </a>
                </li>

                <li @click="changeActiveTab('shared documents')" :class="{'is-active' : activeTab === 'shared documents' }">
                    <a>
                        <!-- <p v-if="this.$store.state.efile_notification.pendingEfileNotif > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.$store.state.efile_notification.pendingEfileNotif}}</p></span>
                            &nbsp;&nbsp;
                        </p> -->
                        <span>Shared Words</span>
                    </a>
                </li>

            </ul>
        </div><!--tabs-->

        <!--tab's content-->
        <myDocuments v-if="activeTab === 'my documents' "/>
        <sharedDocuments  v-if="activeTab === 'shared documents' " />

    </div>
</template>

<script>
    import loader from '~/components/loader'
    import axios from 'axios'
    import keys from '~/components/keys.js'
    import myDocuments from './myDocument'
    import sharedDocuments from './sharedDocument'

    export default {

        components:{
            myDocuments,
            sharedDocuments,
            loader
        },//components
        
        
        data(){

            return{
                activeTab : 'my documents',
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