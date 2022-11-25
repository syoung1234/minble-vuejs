<template>
  <transition name="img-modal" appear>
    <div class="img-modal img-modal-overlay" @click.self="$emit('close')">
      <div class="img-modal-window mt-5">
        <div>
          <slot/>
        </div>
      </div>
    </div>
  </transition>
</template>
