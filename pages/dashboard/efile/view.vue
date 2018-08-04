<template>
    <div>

        <loader :isActive="this.isLoaderActive"/>

        <section class="section">
            <TinyMce v-model="content" :init="tinymce" /><br>
        </section>

    </div>
</template>

<script>

    import TinyMce from '@tinymce/tinymce-vue'
    import axios from 'axios'
    import keys from '~/components/keys.js'
    import loader from '~/components/loader'


    export default {
        
   
        components:{
            TinyMce,
            loader
        },

        created(){
            this.tinymce = {
                height: 650,
                readonly: 1,
                content_style: keys.TINYMCE_STYLE,
                theme: 'modern',
                plugins: 'code print fullpage',
            }
        },

        mounted(){
            const id = this.$route.query.id
            
            

            const config = {
                method: 'GET',
                url: `${keys.BASE_URL}/api/v1/efiles/${id}`,
                headers:{
                    "Authorization" : `Bearer ${this.$store.state.user_details.token}`
                }
            }

            if(id === undefined  | id === null){
                this.$router.push('/dashboard/efile/view/idParameterNeeded')
            }else{
                axios(config)
                    .then(res => {
                        this.content = this.renderContent(res.data)
                        setTimeout( () => this.toggleLoader(), 3000)
                    })
                    .catch(err => {
                        this.$notify( this.showNotif('error', 'Server Warning', 'fa-exclamation-triangle', err.response.data.errors))
                        this.toggleLoader()
                    })
            }
            
        },

       


      
        data(){
            return{
                API_SIGNATURE: `${keys.BASE_URL}${keys.API_SIGNATURE}/`,
                isLoaderActive: true,
                content: '',

                tinymce:{},//tinymce


            }//return
        }, 

        methods: {
            
            renderContent(efileData){
                let efile = efileData
                let signatures = ''
                let content = unescape(efileData.content)
                content = content.substring(0, content.length - 20)

                efileData.signatures.forEach( (x) =>{
                    signatures += `<span>
                                        <div style='display:inline-block !important; text-align:center !important; padding-left:6px !important; padding-right:6px !important;'>
                                            <img src='${this.API_SIGNATURE}${x.signature}' width='150'> <br> ${x.name} <br>${x.position}
                                        </div>
                                    <span>`
                    
                })

                content = ` ${content}<div style='text-align: center !important'>${signatures}</div></body></html>`
                return content

            },

            showNotif(type, title, icon, msg){
                return{
                    type: type,
                    group: 'vnotif',
                    title: `<span ><span class='fas ${icon} fa-2x'></span><span class='title is-5'> ${title}:</span></span>`,
                    text: `<p class='subtitle is-5'>${msg}</p>`
                }
            },

            toggleLoader(){
                this.isLoaderActive = !this.isLoaderActive
            }


        }
    }
</script>

<style scoped>



.is-table-scrollable{
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.is-table-scrollable tbody{
  display:block;
  width: 100%;
  overflow: auto;
  height: 400px;
}


.is-table-scrollable th, .is-table-scrollable td {
  padding: 5px;
  text-align: left;
  width: 200px;
}

.yuen {
    height: 30px;
    width: 30px;
}
 

      
</style>