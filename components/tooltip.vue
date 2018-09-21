<template>
  <div>
    <transition name="tooltip" :duration="10000">
      <div class="tooltip-mask">
        <div class="tooltip-wrapper">
          <div class="tooltip-container p-0">
            <!-- header -->
            <div class="tooltip-header">
              <h6>提示：</h6>
            </div>
            <!-- body -->
            <div class="tooltip-body">
              <slot name="body">
              </slot>
              <slot name="action">
              </slot>
            </div>
            <!-- footer -->
            <div class="tooltip-footer">
              <slot name="footer">
                <span class="close-text" @click="$emit('close')">我知道了</span>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
.tooltip-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.tooltip-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.tooltip-container {
/*  width: 300px;*/
  margin:0 40%;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

@media (max-width: 576px) {
  .tooltip-container {
  /*  width: 300px;*/
    margin:0 10%;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }
}

.tooltip-body {
  min-height: 6rem;
}

.tooltip-header {
  border-bottom: 0px solid #fff;
}

.tooltip-header h6 {
  margin-top: 0;
  color: #000;
}

.tooltip-footer {
  display: block;
  text-align: center;
  border-top: 1px solid #fff;
  font-size: 0.9rem;
  color:#8D6E63;
  background-color: #424242 !important;
}

.close-text {
  color: #FFF;
}

.tooltip-leave-active {
  opacity: 0;
}

.tooltip-enter .tooltip-container,
.tooltip-leave-active .tooltip-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.close-btn {
  /*border:1px solid #fff;*/
}

.x {
  display: block;
  position: relative;
  float: right;
  left: 0;
  top: 0;
  width: 25px;
  height: 25px;
  border-radius: 50px;
  border-color:#fff;
  transition: transform .25s ease-in-out;
}
.x:hover {
  transform: rotate(180deg);
}
.x:before {
  content: "";
  position: absolute;
  display: block;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 25px;
  height: 0;
  border-top: 1px solid rgba(0,0,0,0.5);
  transform: rotate(45deg);
  transform-origin: center;
}
.x:after {
  content: "";
  position: absolute;
  display: block;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 25px;
  height: 0;
  border-top: 1px solid rgba(0,0,0,0.5);
  transform: rotate(-45deg);
  transform-origin: center;
}
</style>