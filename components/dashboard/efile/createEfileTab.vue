<template>
    <div>

        <section class="section ">
            <TinyMce v-model="content" :init="tinymce"></TinyMce><br>
            <button @click="getValue" class="is-pulled-right button is-danger is-medium"><b>Create</b></button>
        </section>

    </div>
</template>

<script>

    import TinyMce from '@tinymce/tinymce-vue'

    export default {
        
        components:{
            TinyMce
        },

        data(){
            return{
                loading: true,
                
                content: null,

                tinymce:{
                    height: 500,
                    content_style: " body {padding: 3em;}, p{padding: 0 !important;}",
                    theme: 'modern',
                    plugins: ' code print fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link template table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
                    toolbar1: 'formatselect fontselect fontsize fontsizeselect  | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat pagebreak ',
                    image_advtab: true,
                    templates: [
                        { title: 'Sample Document', content: unescape("%3C%21DOCTYPE%20html%3E%0A%3Chtml%3E%0A%3Chead%3E%0A%3C/head%3E%0A%3Cbody%3E%0A%3Cp%3E%3Cimg%20style%3D%22width%3A%20100%25%3B%20height%3A%20120px%3B%20top%3A%200px%20%21important%3B%20left%3A%200px%20%21important%3B%20z-index%3A%20-20%20%21important%3B%20position%3A%20absolute%20%21important%3B%22%20src%3D%22https%3A//www.toyotafinance.co.in/images/banner-document-784x199.jpg%22%20alt%3D%22%20width%3D%22%20height%3D%22199%22%20/%3E%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Ch1%20style%3D%22text-align%3A%20center%3B%22%3E%26nbsp%3B%3C/h1%3E%0A%3Ch1%20style%3D%22text-align%3A%20center%3B%22%3ESample%20Document%3C/h1%3E%0A%3Cp%3Easdiasdfasdtyasrdyats%20ausydtua%20sytduaystd%20uasytd%20asdtasuy%20dtasd%20auysdtasuydt%20auysdtasasdas%20asd%20ad%20asd%20asd%20asd%20asdu%20tdasuydtas%20ydtasyud%20tasyu%20tdausyt%20dasdt%20auysdtasyu%20tdasuydtasuydt%20asudtasudt%20ausydtauydtasduyats%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%26nbsp%3B%3C/p%3E%0A%3Cp%3E%3Cimg%20style%3D%22float%3A%20right%3B%22%20src%3D%22https%3A//camo.githubusercontent.com/805e05b94844e39d7edd518f492c8599c71835b3/687474703a2f2f692e696d6775722e636f6d2f646e5873344e442e706e67%22%20alt%3D%22%20width%3D%22%20height%3D%2296%22%20/%3E%3C/p%3E%0A%3Cp%20style%3D%22padding-left%3A%2060px%3B%20text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3E%26nbsp%3B%3C/p%3E%0A%3Cp%20style%3D%22text-align%3A%20right%3B%22%3EJohn%20S%20Doe%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/p%3E%0A%3C/body%3E%0A%3C/html%3E") },
                        { title: 'Test template 2', content: 'Test 2' }
                    ]
                }//tinymce

            }//return
        }, 

        methods: {

            getValue(){
                // console.log(escape(`${this.content}`))
                console.log(`${this.content}`)
            }

        }
    }
</script>

<style scoped>

</style>