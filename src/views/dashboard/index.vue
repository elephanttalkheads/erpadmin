<template>
  <div>
    <Card />
    <Sale />
    <Observe />

  </div>
</template>

<script>
import Card from '@/views/dashboard/Card'
import Sale from '@/views/dashboard/Sale'
import Observe from '@/views/dashboard/Observe'

export default {
  name: 'Dashboard',
  components: { Card, Sale, Observe },
  mounted() {
    console.log('-> this.$store', this.$store)
    this.$store.dispatch('getData')
  }
}
</script>

<style >

</style>
