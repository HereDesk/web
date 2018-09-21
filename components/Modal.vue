<template>
  <div id="modal-template">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
              </slot>
              <button class="x" @click="$emit('close')">
              </button>
            </div>

            <div class="modal-body">
              <slot name="body">
              </slot>
              <slot name="msg">
              </slot>
            </div>

            <div class="md-footer">
              <p class="ml-3">备注：绿色，代表当前需求进度</p>
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
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
/*  width: 300px;*/
  margin:0 20%;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

@media (max-width: 576px) {
  .modal-container {
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

.modal-header {
  border-bottom: 0px solid #fff;
}

.modal-header h6 {
  margin-top: 0;
  color: #000;
}

.modal-body {
  margin-top:-1rem;
}

.modal-default-button {
  float: right;
}

.md-footer {
  display: block;
  text-align: left;
  border-top: 0px solid #fff;
  font-size: 0.9rem;
  color:#8D6E63;
  background-color: none !important;
}

/*.modal-enter {
  opacity: 0;
}*/

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.close-btn {
  /*border:1px solid #fff;*/
}

.x {
  display: block;
  position: relative;
  right: 0;
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