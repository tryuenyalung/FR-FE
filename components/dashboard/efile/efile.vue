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
                        <p v-if="pendingEfile > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.pendingEfile}}</p></span>
                            &nbsp;&nbsp;
                        </p>
                        <span>For Approval</span>
                    </a>
                </li>

                <li @click="changeActiveTab('for publishing')" :class="{'is-active' : activeTab === 'for publishing' }">
                    <a>
                        <p v-if="rejectedEfile > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.rejectedEfile}}</p></span>
                            &nbsp;&nbsp;
                        </p>
                        <span>Rejected Efile</span>
                    </a>
                </li>

                <li @click="changeActiveTab('approved')" :class="{'is-active' : activeTab === 'approved' }">
                    <a>
                        <span>Approved</span>
                    </a>
                </li>

                <li @click="changeActiveTab('rejected')" :class="{'is-active' : activeTab === 'rejected' }">
                    <a>
                        <span>Rejected</span>
                    </a>
                </li>

            </ul>
        </div><!--tabs-->

        <!--tab's content-->
        <createEfile v-if="activeTab === 'create efile' "/>
        <approved  v-if="activeTab === 'approved' "/>
        <forApproval  v-if="activeTab === 'for approval' " />
        <forPublishing  v-if="activeTab === 'for publishing' "/>



    </div>
</template>

<script>
    import createEfile from './createEfileTab'
    import approved from './approvedTab'
    import forApproval from './forApprovalTab'
    import forPublishing from './forPublishingTab'

    export default {

        components:{
            createEfile,
            approved,
            forApproval,
            forPublishing 
        },//components

        data(){

            return{
                pendingEfile : this.$store.state.efile_notification.pendingEfile,
                rejectedEfile : this.$store.state.efile_notification.rejectedEfile,
                activeTab : 'create efile',
            }//return
        
        },//data
        
        methods:{
            changeActiveTab(tab){
                this.activeTab = tab
            }
        }//methods
    }
</script>

<style scoped>

</style>