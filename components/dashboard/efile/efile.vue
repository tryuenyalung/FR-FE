<template>
    <div>
        
        <div class="tab-padding tabs is-centered is-boxed">
            <ul>

                <li @click="changeActiveTab('create efile')" :class="{'is-active' : activeTab === 'create efile' }">
                    <a>
                   
                        <span>Create Efile</span>
                    </a>
                </li>

                <li @click="changeActiveTab('for approval')" :class="{'is-active' : activeTab === 'for approval' }">
                    <a>
                        <p v-if="this.$store.state.efile_notification.pendingEfileNotif > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.$store.state.efile_notification.pendingEfileNotif}}</p></span>
                            &nbsp;&nbsp;
                        </p>
                        <span>For Approval</span>
                    </a>
                </li>

                <li @click="changeActiveTab('rejected efile')" :class="{'is-active' : activeTab === 'rejected efile' }">
                    <a>
                        <p v-if="this.$store.state.efile_notification.rejectedEfileNotif > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.$store.state.efile_notification.rejectedEfileNotif}}</p></span>
                            &nbsp;&nbsp;
                        </p>
                        <span>Rejected Efile</span>
                    </a>
                </li>

                <li @click="changeActiveTab('private efile')" :class="{'is-active' : activeTab === 'private efile' }">
                    <a>
                        <span>Private Efile</span>
                    </a>
                </li>

                <li @click="changeActiveTab('public efile')" :class="{'is-active' : activeTab === 'public efile' }">
                    <a>
                        <span>Public Efile</span>
                    </a>
                </li>

            </ul>
        </div><!--tabs-->

        <!--tab's content-->
        <createEfile v-if="activeTab === 'create efile' "/>
        <forApproval  v-if="activeTab === 'for approval' " />
        <rejectedEfileTab  v-if="activeTab === 'rejected efile' "/>
        <privateEfileTab  v-if="activeTab === 'private efile' "/>
        <publicEfileTab  v-if="activeTab === 'public efile' "/>



    </div>
</template>

<script>
    import loader from '~/components/loader'
    import axios from 'axios'
    import keys from '~/components/keys.js'
    import createEfile from './createEfileTab'
    import forApproval from './forApprovalTab'
    import rejectedEfileTab from './rejectedEfileTab'
    import publicEfileTab from './publicEfileTab'
    import privateEfileTab from './privateEfileTab'

    export default {

        components:{
            createEfile,
            forApproval,
            rejectedEfileTab,
            publicEfileTab,
            privateEfileTab,
            loader
        },//components
        
        created() {this.getAllNotifs()},
        
        data(){

            return{
                activeTab : 'create efile',
            }//return
        
        },//data
        
        methods:{
            changeActiveTab(tab){
                this.activeTab = tab
                this.getAllNotifs()
            },

            getPendingEfileNotif(){
                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/pending/${this.$store.state.user_details.user._id}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                }

                axios(config)
                    .then( res =>  {

                        this.$store.dispatch('efile_notification/GET_PENDING_EFILE_NOTIFICATION', res.data.total)
                    
                        // this.toggleLoader()
                    })
                    .catch( err => {
                        // this.toggleLoader()
                        alert(err)
                    })

            },

            getRejectedEfileNotif(){

                const config = {
                    method: 'GET',
                    url: `${keys.BASE_URL}/api/v1/efiles/rejected/${this.$store.state.user_details.user._id}`,
                    headers:{
                        "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                    }
                    
                }


                axios(config)
                    .then( res =>  {

                        this.$store.dispatch('efile_notification/GET_REJECTED_EFILE_NOTIFICATION', res.data.total)
                    
                        // this.toggleLoader()
                    })
                    .catch( err => {
                        // this.toggleLoader()
                        alert(err)
                    })

            },

            getAllNotifs(){
                this.getPendingEfileNotif()
                this.getRejectedEfileNotif()
            }



        }//methods
    }
</script>

<style scoped>

</style>