<template>
  <div class="basiceNine">
    <BasicForm>
      <template #formHeader >
        <div>
          123
        </div>
      </template>
    </BasicForm>
  </div>
</template>

<script>
import { BasicForm } from '@comp/Form';
export default {
  components: { BasicForm },
};
</script>

<style>
.basiceNine {
  height: 200vh;
}
</style>