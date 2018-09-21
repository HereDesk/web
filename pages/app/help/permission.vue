<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="mt-5">
          <h5>权限说明</h5>
          <pre class="content-block">1. 只有admin用户，才有权限进行用户管理、产品管理、版本管理<br>2. 用户，只有在产品用户列表中，才能访问产品</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'help'
  }
</script>
