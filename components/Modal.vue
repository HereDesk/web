<template>
  <div id="modal-template">
    <transition name="modal">
      <div class="modal modal-mask">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">

            <div class="modal-header">
              <slot name="header"></slot>
              <!-- <i class="iconfont icon-close-windows size-1-5" @click="$emit('close')"></i> -->
            </div>

            <div class="modal-body">
              <slot name="body"></slot>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-cancel" @click="$emit('close')">关闭</button>
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
  .modal-mask {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }
</style>