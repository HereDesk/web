
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Vue from 'vue'

// import hljs from 'highlight.js'
// import 'highlight.js/styles/github.css'
// hljs.configure({
//   languages: ['javascript', 'ruby', 'python','html','css']
// });

import quillEditor from 'vue-quill-editor'

Vue.use(quillEditor,{
	modules: {
		syntax: true, 
		toolbar: [
			[{ 'header': 2 }],
			// [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			// ['underline']
			['bold', 'italic'],
			[{ 'color': [] }, { 'background': [] }],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'align': [] }],
			['link','image'],
			['task-list'],
			[ 'code','code-block','blockquote','formula'],
			[{ 'script': 'sub' }, { 'script': 'super' }],
			['clean'],
			// [{ 'direction': 'rtl' }], 
		]
	},
	theme: 'snow',
	placeholder: '请输入内容...'
})