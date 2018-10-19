<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-full"
  >
    <h1>{{ category.name }}</h1>
    <CategoryListItem :category="category"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CategoryListItem from '@/components/CategoryListItem';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  components: {
    CategoryListItem
  },

  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: String
    }
  },

  computed: {
    ...mapState({
      categories: state => state.categories
    }),
    category() {
      return this.categories[this.id];
    }
  },

  created() {
    this.fetchCategory({ id: this.id })
      .then(category => {
        this.fetchForums({ ids: category.forums });
      })
      .then(() => {
        this.asyncDataStatus_fetched();
      });
  },

  methods: {
    ...mapActions('forums', ['fetchForums']),
    ...mapActions('categories', ['fetchCategory'])
  }
};
</script>
