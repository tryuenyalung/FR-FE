<template>
    <div>
        
        <section class="section has-background-white-ter is-fixed">

            <!-- <img class="is-paddingless is-marginless" src="~/assets/images/logo.png" alt="" ><br><br>  -->

            <figure class="avatar has-text-centered">
                <img width="170" height="170"  :src="user_avatar" >
            </figure>

            <aside class="menu">

                <p class="menu-label">Files</p>
                <ul class="menu-list">
                    <li @click="changeActiveContent('efile')" ><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'efile' }" >Efiles</a></li>
                    <li @click="changeActiveContent('document')" ><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'document' }" >Documents</a></li>
                    <li @click="changeActiveContent('spreadsheet')" ><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'spreadsheet' }" >Spreadsheets</a></li>
                    <li @click="changeActiveContent('presentation')" ><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'presentation' }" >Presentations</a></li>
                    <li @click="changeActiveContent('image')" ><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'image' }" >Images</a></li>
                </ul>

                <p class="menu-label">Account</p>
                <ul class="menu-list">
                    <li @click="changeActiveContent('update_info')" ><a :class="{'is-active subtitle is-5' : this.$store.state.sidebar.activeContent === 'update_info' }" >Update Info</a></li>
                    <li @click="logout"><a>Logout</a></li>
                </ul>

            </aside>
                    
        </section>
    </div>
</template>

<script>


    export default {
        // beforeCreate(){
        //     if(localStorage.getItem('jwt') === null ){
        //         this.$router.push('/')
        //     }
        // },
    

        data(){

            return{
                user_avatar :  localStorage.getItem('user.avatar')
            }

        },//data
 

        methods:{

            //go to homepage and clear localstorage
            logout(){
                localStorage.clear()
                this.$router.push('/')

                // this.$store.commit('logout/clearStoreAndLogout')
            },
             
            changeActiveContent(contentToRender){
                this.$store.dispatch('sidebar/CHANGE_ACTIVE_CONTENT', contentToRender)
            }

        }//methods
    }
</script>

<style scoped>

    section{
        height: 100vh;
    }

    .avatar img {
    padding: 5px;
    background: #fff;
    border-radius: 50%;
    -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  }
</style>