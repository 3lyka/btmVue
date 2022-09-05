<template>
  <component class="menu__feedback" :is="tag || 'div'" :href="href">
    <div class="menu__feedback-item">
      <div class="menu__feedback-img">
        <slot name="icon">
          <FeedbackIcon />
        </slot>
      </div>
      <p class="menu__feedback-text" v-if="leftMenuOpen">
        <slot> Служба поддержки </slot>
      </p>
    </div>
  </component>
</template>

<script>
import { defineComponent } from 'vue';
import FeedbackIcon from './icons/FeedbackIcon.vue';

export default defineComponent({
  name: 'LeftMenuFeedBack',
  components: { FeedbackIcon },
  props: {
    leftMenuOpen: { type: Boolean },
    tag: { type: String },
    href: { type: String },
  },
});
</script>

<style scoped></style>
