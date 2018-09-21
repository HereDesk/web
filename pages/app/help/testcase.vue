<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="mt-5">
          <h5>测试用例包括哪些内容？</h5>
          <pre class="content-block">一条测试用例包括：产品信息、模块信息、优先级、标题、输入数据、执行条件、操作步骤、预期结果、备注等</pre>
        </div>
        <div class="mt-5">
          <h5>测试用例：失效 </h5>
          <pre class="content-block">因需求变化或其它因素，导致部分测试用例不在发生作用。可手动将这部分用例置为失效。将不再主动展示在列表页面。</pre>
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
