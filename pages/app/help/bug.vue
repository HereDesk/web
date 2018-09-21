<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="mt-5">
          <h5>缺陷分析</h5>
          <pre class="content-block">按产品和版本统计。目前只统计了：缺陷趋势分析、按缺陷创建人统计、缺陷状态分析、缺陷优先级分析、缺陷严重程度分析</pre>
        </div>
        <div class="mt-5">
          <h5>缺陷状态说明</h5>
          <pre class="content-block">缺陷状态包括：New、Open、Fixed、Reopen、Closed、Hang-up<br></pre>
        </div>
        <div class="mt-5">
          <h5>缺陷编辑</h5>
          <pre class="content-block">只有缺陷创建人、Test用户组、admin用户组才能编辑</pre>
        </div>
        <div class="mt-5">
          <h5>缺陷删除</h5>
          <pre class="content-block">只有缺陷创建人、Test用户组才能删除</pre>
        </div>
        <div class="mt-5">
          <h5>缺陷解决</h5>
          <pre class="content-block">缺陷解决包括：已解决、其它解决方案两种。<br>1.当点击"已解决"时，无需填写任何信息，直接解决成功,默认指派给缺陷创建者。<br>2.当点击“其它解决方案”时，可选择解决方案类型、指派人、备注等。其它解决方案包括：已修复、无法复现、重复bug、不是缺陷、设计如此、其它等。可在数据库表"t_bug_solution"表增加其它解决方案</pre>
        </div>
        <div class="mt-5">
          <h5>缺陷重新打开</h5>
          <pre class="content-block">重新打开缺陷，是指此缺陷没有修复成功，仍存在问题。</pre>
        </div>
        <div class="mt-5">
          <h5>缺陷延期挂起</h5>
          <pre class="content-block">延期挂起，是指此缺陷暂时不修复，留待以后解决。</pre>
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
