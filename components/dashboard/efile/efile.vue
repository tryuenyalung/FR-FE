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

                <li @click="changeActiveTab('rejected efile')" :class="{'is-active' : activeTab === 'rejected efile' }">
                    <a>
                        <p v-if="rejectedEfile > 0">
                            <span class="tag is-danger"><p class="title is-6 has-text-white">{{this.rejectedEfile}}</p></span>
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
            privateEfileTab
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