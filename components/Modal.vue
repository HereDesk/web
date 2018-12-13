<template>
  <div id="modal-template">
    <transition name="modal">
      <div class="modal modal-mask">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <slot name="header"></slot>
              <i v-if="isHeader" class="iconfont icon-close-windows size-1-5" @click="$emit('close')"></i>
            </div>

            <div class="modal-body">
              <slot name="body"></slot>
            </div>

            <div class="modal-footer" v-if="isFooter">
              <button type="button" class="btn btn-cancel" @click="$emit('close')">关闭</button>
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    isFooter: Boolean,
    isHeader: Boolean
  }
}
</script>