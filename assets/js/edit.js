export default {
  mavon_md_base_toolbars: {
    bold: true,
    italic: true,
    underline: true,
    ol: true,
    ul: true,
    quote: true,
    code: true,
    table: true
  },
  quill_md_simple_options: {
    modules: {
      toolbar: [
        [{ 'header': 2 }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }],
        [{ 'list': 'ordered' }],
        ['link', 'image'],
        ['code', 'code-block', 'blockquote']
      ]
    },
    theme: 'snow',
    placeholder: '请输入内容...'
  },
  quill_md_bubble_options: {
    theme: 'bubble'
  }
}
