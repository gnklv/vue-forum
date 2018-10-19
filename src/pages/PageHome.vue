<template>
  <div
    v-if="asyncDataStatus_ready"
    class="col-full push-top"
  >
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categoriesValues"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CategoryList from '@/components/CategoryList';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  components: {
    CategoryList
  },

  mixins: [asyncDataStatus],

  data() {
    return {
      ready: false
    };
  },

  computed: {
    ...mapState({
      categories: state => state.categories
    }),
    categoriesValues() {
      return Object.values(this.categories);
    }
  },

  created() {
    this.fetchAllCategories()
      .then(categories =>
        Promise.all(categories.map(category =>
          this.fetchForums({ ids: Object.keys(category.forums) }))
        )
      )
      .then(() => {
        this.asyncDataStatus_fetched();
      });
  },

  methods: {
    ...mapActions('forums', ['fetchForums']),
    ...mapActions('categories', ['fetchAllCategories'])
  }
};
</script>
