<template>
    <div>
        <br>
        <div class="tab-padding tabs is-centered is-boxed is-marginless is-paddingless">
            <ul>

                <li @click="changeActiveTab('my presentations')" :class="{'is-active' : activeTab === 'my presentations' }">
                    <a>
                        <span>My Presentations</span>
                    </a>
                </li>

                <li @click="changeActiveTab('shared presentations')" :class="{'is-active' : activeTab === 'shared presentations' }">
                    <a>
                        <!-- <p v-if="this.$store.state.efile_notification.pendingEfileNotif > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.$store.state.efile_notification.pendingEfileNotif}}</p></span>
                            &nbsp;&nbsp;
                        </p> -->
                        <span>Shared Presentations</span>
                    </a>
                </li>

            </ul>
        </div><!--tabs-->

        <!--tab's content-->
        <myPresentations v-if="activeTab === 'my presentations' "/>
        <sharedPresentations  v-if="activeTab === 'shared presentations' " />

    </div>
</template>

<script>
    import loader from '~/components/loader'
    import axios from 'axios'
    import keys from '~/components/keys.js'
    import myPresentations from './myPresentation'
    import sharedPresentations from './sharedPresentation'

    export default {

        components:{
            myPresentations,
            sharedPresentations,
            loader
        },//components
        
        
        data(){

            return{
                activeTab : 'my presentations',
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