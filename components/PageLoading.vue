<template>
  <div class="container-fluid">
    <div class="row">
     <div class="col text-center">
         <transition name="loading">
          <div class="main-loading-page loading">
            <!-- <h1>Loading</h1> -->
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style>
/*
  Loading
*/

.main-loading-page {
  text-align: center;
  padding: 20%;
}

@media (max-width: 576px) {
  .main-loading-page {
    margin-top: 50%;
  }
}

.loading h1 {
  color: #ccc;
  font-size: 1.4rem;
  letter-spacing: .1em;
}

.loading span:nth-of-type(2) {
  background: #008FB2;
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
}
.loading span:nth-of-type(3) {
  background: #009B9E;
  -webkit-animation-delay: 0.4s;
          animation-delay: 0.4s;
}
.loading span:nth-of-type(4) {
  background: #00A77D;
  -webkit-animation-delay: 0.6s;
          animation-delay: 0.6s;
}
.loading span:nth-of-type(5) {
  background: #00B247;
  -webkit-animation-delay: 0.8s;
          animation-delay: 0.8s;
}
.loading span:nth-of-type(6) {
  background: #5AB027;
  -webkit-animation-delay: 1.0s;
          animation-delay: 1.0s;
}
.loading span:nth-of-type(7) {
  background: #A0B61E;
  -webkit-animation-delay: 1.2s;
          animation-delay: 1.2s;
}

.loading span {
  display: inline-block;
  vertical-align: middle;
  width: 0.7em;
  height: 0.7em;
  margin: .19em;
  background: #007DB6;
  border-radius: .6em;
  -webkit-animation: loading 1s infinite alternate;
          animation: loading 1s infinite alternate;
}

@-webkit-keyframes loading {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes loading {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
