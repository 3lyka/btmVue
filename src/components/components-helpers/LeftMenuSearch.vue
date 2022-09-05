<template>
  <li class="search-form menu__item">
    <div class="menu__item-img_no-frame">
      <img src="@/assets/img/loupe.svg" />
    </div>
    <div class="menu__item-name">
      <input
        class="menu__item-text search-form__search-input"
        type="text"
        placeholder="Найти"
      />
    </div>
  </li>
</template>

<script>
export default {
  name: 'LeftMenuSearch',
};
</script>

<style scoped></style>
