<template>
    <div>

        <!-- {{this.$store.state.sidebar.activeContent}} -->
        <efile v-if=" this.$store.state.sidebar.activeContent === 'efile' "/>
        <pdf v-if=" this.$store.state.sidebar.activeContent === 'pdf' "/>
        <document v-if=" this.$store.state.sidebar.activeContent === 'document' "/>
        <spreadsheet v-if=" this.$store.state.sidebar.activeContent === 'spreadsheet' "/>
        <presentation v-if=" this.$store.state.sidebar.activeContent === 'presentation' "/>
        <dshbrdImage v-if=" this.$store.state.sidebar.activeContent === 'image' "/>
        <updateInfo v-if=" this.$store.state.sidebar.activeContent === 'update_info' "/>
        
    </div>
</template>

<script>

    import efile from './efile/efile'
    import pdf from './pdf/pdf'
    import document from './document/document'
    import spreadsheet from './spreadsheet/spreadsheet'
    import presentation from './presentation/presentation'
    import dshbrdImage from './image/image'
    import updateInfo from './update_info/update_info'

    export default {
        components:{
            efile,
            pdf,
            document,
            spreadsheet,
            presentation,
            dshbrdImage,
            updateInfo
        }
    }
</script>

<style scoped>

</style>